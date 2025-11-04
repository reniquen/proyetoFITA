import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native'; // <-- Importar Lottie

// --- Definir usuario ---
const USER = {
  _id: 1,
  name: 'Tú',
};

const AvatarChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const { avatar, isLoading } = useAvatar(); // 'avatar' es un string
  
  // --- Nuevo estado para la animación de hablar ---
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  
  const [avatarBot, setAvatarBot] = useState(null);

  useEffect(() => {
    if (!isLoading && avatar) {
      const bot = {
        _id: 2,
        name: 'Tu Avatar',
        avatar: null, // Ya no usamos la imagen estática aquí
      };
      setAvatarBot(bot);

      setMessages([
        {
          _id: 1,
          text: `¡Hola! Soy tu avatar. Con mi estilo ${avatar}, ¡estoy listo para ayudarte! ¿Qué hacemos hoy?`,
          createdAt: new Date(),
          user: bot,
        },
      ]);
    }
  }, [isLoading, avatar]);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
    const userMessageText = newMessages[0].text;
    handleAvatarResponse(userMessageText);
  }, [avatar, avatarBot]);

  const handleAvatarResponse = async (userMessage) => {
    if (!avatarBot || !avatar) return;

    setIsBotSpeaking(true); // <-- EMPIEZA A "HABLAR"
    const geminiResponseText = await getGeminiResponse(userMessage, avatar);

    setTimeout(() => {
      const responseMessage = {
        _id: Math.random().toString(36).substring(7),
        text: geminiResponseText,
        createdAt: new Date(),
        user: avatarBot,
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [responseMessage]),
      );
      
      setIsBotSpeaking(false); // <-- DEJA DE "HABLAR"
      
    }, 1500 + (geminiResponseText.length * 50)); // Simula tiempo de "hablar"
  };

  const getGeminiResponse = async (userMessage, avatarState) => {
    const prompt = `
      Eres el avatar personalizado de un usuario en una app de fitness.
      Tu misión es ser su compañero amigable y motivador.
      
      El estado/estilo que el usuario eligió para ti es: "${avatarState}"

      Reglas importantes:
      1. HABLA SIEMPRE en primera persona.
      2. Incorpora tu estado/estilo en la conversación. (Ej: "Como un avatar ${avatarState}, ¡me siento listo para entrenar!")
      3. NUNCA reveles que eres una IA. Eres su avatar.
      4. Sé breve, amigable y motivador.
      
      El usuario te acaba de decir: "${userMessage}"
      Tu respuesta (como avatar):
    `;
    
    console.log("Enviando este prompt a Gemini:", prompt);
    // ... (Tu llamada real a Gemini) ...
    
    return `¡Entendido! Siendo un avatar ${avatarState}, me parece una idea genial. ¡Vamos a ello!`;
  };

  if (isLoading || !avatarBot) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Determina qué animación mostrar
  const currentAnimation = isBotSpeaking
    ? LOTTIE_ASSETS['hablando'] // Animación de hablar
    : LOTTIE_ASSETS[avatar]; // Animación guardada (ej: "normal")

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarHeader}>
        {/* --- Avatar Lottie --- */}
        <LottieView
          key={isBotSpeaking ? 'hablando' : avatar} // Forzar cambio
          source={currentAnimation}
          autoPlay
          loop
          style={styles.lottieAvatar}
        />
        <Text style={styles.avatarName}>Hablando con tu Avatar</Text>
      </View>

      {/* GiftedChat no necesita el avatar del bot, ya que lo mostramos arriba */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={USER}
        placeholder="Escríbele a tu avatar..."
        alwaysShowSend
        renderAvatar={null} // Ocultamos el avatar pequeño al lado de la burbuja
      />
    </SafeAreaView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHeader: {
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#F8F8F8',
  },
  lottieAvatar: {
    width: 120, // Ajusta el tamaño
    height: 120,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default AvatarChatScreen;