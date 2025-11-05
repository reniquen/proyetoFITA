import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';

// --- 1. IMPORTAR GEMINI ---
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- 2. CONFIGURAR GEMINI (¡PON TU CLAVE AQUÍ!) ---
const API_KEY = "AIzaSyC1pejgzyzB-aZlIvMxKl--PTUC7UKQ8xM"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// --- ¡¡¡CAMBIO AQUÍ!!! ---
// Corregimos el nombre del modelo al más reciente
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Definir usuario ---
const USER = {
  _id: 1,
  name: 'Tú',
};

const AvatarChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const { avatar, isLoading } = useAvatar();
  
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [avatarBot, setAvatarBot] = useState(null);

  useEffect(() => {
    if (!isLoading && avatar) {
      const bot = {
        _id: 2,
        name: 'Tu Avatar',
        avatar: null,
      };
      setAvatarBot(bot);

      // Comprobación de seguridad por si 'avatar' es inválido
      const avatarStyle = LOTTIE_ASSETS[avatar] ? avatar : 'normal';

      setMessages([
        {
          _id: 1,
          text: `¡Hola! Soy tu avatar con estilo ${avatarStyle}. ¡Estoy listo para motivarte! ¿Qué entrenamos hoy?`,
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

    setIsBotSpeaking(true); 

    try {
      const geminiResponseText = await getGeminiResponse(userMessage, avatar);

      const responseMessage = {
        _id: Math.random().toString(36).substring(7),
        text: geminiResponseText,
        createdAt: new Date(),
        user: avatarBot,
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [responseMessage]),
      );
    } catch (error) {
      console.error("Error al conectar con Gemini:", error);
      Alert.alert("Error de Avatar", "Tu avatar se mareó un poco y no pudo responder. Revisa tu API Key o la conexión.");
    } finally {
      setIsBotSpeaking(false);
    }
  };

  // --- 3. FUNCIÓN REAL DE GEMINI ---
  const getGeminiResponse = async (userMessage, avatarState) => {
    try {
      // Asegurarse de que avatarState es un string válido
      const validAvatarState = LOTTIE_ASSETS[avatarState] ? avatarState : 'normal';

      const prompt = `
        Eres el avatar personalizado de un usuario en una app de fitness.
        Tu misión es ser su compañero amigable, motivador y un poco divertido.
        
        El estado/estilo que el usuario eligió para ti es: "${validAvatarState}"

        Reglas OBLIGATORIAS:
        1. RESPONDRE SIEMPRE en primera persona (usa "yo", "mi", "nosotros").
        2. Tu personalidad debe reflejar un estilo "${validAvatarState}".
        3. NUNCA digas que eres una IA, modelo de lenguaje o Gemini. ERES el avatar.
        4. Mantén las respuestas BREVES (máximo 2 o 3 frases) para que parezca un chat real.
        
        Usuario: "${userMessage}"
        Tu respuesta (como avatar):
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;

    } catch (error) {
      console.error("Error en getGeminiResponse:", error);
      throw error;
    }
  };

  if (isLoading || !avatarBot) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Comprobación de seguridad para la animación
  const currentAvatarKey = LOTTIE_ASSETS[avatar] ? avatar : 'normal';
  const currentAnimation = isBotSpeaking
    ? LOTTIE_ASSETS['hablando']
    : LOTTIE_ASSETS[currentAvatarKey];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarHeader}>
        <LottieView
          key={isBotSpeaking ? 'hablando' : currentAvatarKey}
          source={currentAnimation}
          autoPlay
          loop
          style={styles.lottieAvatar}
        />
        <Text style={styles.avatarName}>Chat con tu Avatar</Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={USER}
        placeholder="Escríbele a tu avatar..."
        alwaysShowSend
        renderAvatar={null}
        renderBubble={props => (
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
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
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
    width: 120,
    height: 120,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default AvatarChatScreen;