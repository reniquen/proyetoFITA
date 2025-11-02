import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAvatar } from '../screens/AvatarContext'; // <-- 1. IMPORTAR HOOK (con ruta corregida)
import { AVATAR_ASSETS } from './AvatarAssets'; // <-- 2. IMPORTAR ASSETS

// --- Definir usuarios del chat ---
const USER = {
  _id: 1, // ID del usuario
  name: 'Tú',
};

// --- Componente de la Pantalla ---
const AvatarChatScreen = () => {
  const [messages, setMessages] = useState([]);
  
  // --- 3. LEER EL AVATAR REAL DEL CONTEXTO ---
  const { avatar, isLoading } = useAvatar();

  // --- 4. DEFINIR EL BOT DINÁMICAMENTE ---
  // Creamos el bot solo cuando el avatar haya cargado
  const [avatarBot, setAvatarBot] = useState(null);

  useEffect(() => {
    if (!isLoading && avatar) {
      // Definimos el bot con los datos reales
      const bot = {
        _id: 2,
        name: 'Tu Avatar',
        // Usamos la imagen de la cabeza del avatar real
        avatar: AVATAR_ASSETS.cabeza[avatar.cabeza] 
      };
      setAvatarBot(bot);

      // Mensaje inicial del Avatar (usando datos reales)
      setMessages([
        {
          _id: 1,
          text: `¡Hola! Soy tu avatar. Con este torso ${avatar.torso} y estas piernas ${avatar.piernas} que elegiste, ¡estoy listo para ayudarte! ¿Qué hacemos hoy?`,
          createdAt: new Date(),
          user: bot, // Usamos el bot que acabamos de crear
        },
      ]);
    }
  }, [isLoading, avatar]); // Se ejecuta cuando el avatar carga

  // Función que se llama cuando el usuario envía un mensaje
  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
    const userMessageText = newMessages[0].text;
    handleAvatarResponse(userMessageText);
  }, []);

  // --- 5. PASAR EL AVATAR REAL A GEMINI ---
  const handleAvatarResponse = async (userMessage) => {
    // Asegurarse que el bot (y el avatar) estén listos
    if (!avatarBot || !avatar) return;

    // Llamamos a Gemini con el avatar REAL
    const geminiResponseText = await getGeminiResponse(userMessage, avatar);

    setTimeout(() => {
      const responseMessage = {
        _id: Math.random().toString(36).substring(7),
        text: geminiResponseText,
        createdAt: new Date(),
        user: avatarBot, // Usar el bot dinámico
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [responseMessage]),
      );
    }, 1500);
  };

  // --- 6. USAR EL AVATAR REAL EN EL PROMPT ---
  const getGeminiResponse = async (userMessage, avatarProps) => {
    
    // --- PROMPT DINÁMICO ---
    const prompt = `
      Eres el avatar personalizado de un usuario en una app de fitness.
      Tu misión es ser su compañero amigable y motivador.
      
      Las características del avatar que el usuario te dio son:
      - Cabeza: ${avatarProps.cabeza}
      - Torso: ${avatarProps.torso}
      - Piernas: ${avatarProps.piernas}

      Reglas importantes:
      1. HABLA SIEMPRE en primera persona, como si FUERAS el avatar.
      2. Incorpora tus características en la conversación. (Ej: "Con este torso ${avatarProps.torso} que me diste, ¡me siento listo para entrenar!")
      3. NUNCA reveles que eres una IA. Eres su avatar.
      4. Sé breve, amigable y motivador.
      
      El usuario te acaba de decir:
      "${userMessage}"

      Tu respuesta (como avatar):
    `;
    
    console.log("Enviando este prompt a Gemini:", prompt);

    // ... (Aquí iría tu llamada real a Gemini) ...
    
    // --- RESPUESTA SIMULADA (Usa datos reales) ---
    return `¡Entendido! Como tu avatar con torso ${avatarProps.torso}, me parece una idea genial. ¡Vamos a ello!`;
  };


  // --- Renderizado ---
  // Muestra "Cargando..." mientras el avatar se obtiene del Context
  if (isLoading || !avatarBot) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando tu avatar...</Text>
      </View>
    );
  }

  // Una vez cargado, muestra el chat
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarHeader}>
        <Image
          source={avatarBot.avatar} // Imagen real del bot
          style={styles.avatarImage}
        />
        <Text style={styles.avatarName}>Hablando con tu Avatar</Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={USER}
        placeholder="Escríbele a tu avatar..."
        alwaysShowSend
        renderAvatarOnTop
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: '#007AFF' },
                left: { backgroundColor: '#E5E5EA' },
              }}
              textStyle={{
                right: { color: '#FFF' },
                left: { color: '#000' },
              }}
            />
          );
        }}
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
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AvatarChatScreen;