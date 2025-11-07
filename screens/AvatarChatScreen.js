import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { useUserData } from './UserDataContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRESET_ROUTINES } from './RoutineCatalog';

const API_KEY = "AIzaSyC1pejgzyzB-aZlIvMxKl--PTUC7UKQ8xM";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

const USER = { _id: 1, name: "Tú" };

const AvatarChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const { avatar, isLoading: isLoadingAvatar } = useAvatar();

  // ✅ SIN updateRoutine (NO existe en tu Provider)
  const {
    rutinas,
    recetasCalendar,
    setRoutinePreset,
    addRecipeToCalendar,
    isLoadingData
  } = useUserData();

  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [avatarBot, setAvatarBot] = useState(null);

  useEffect(() => {
    if (!isLoadingAvatar && avatar) {
      const currentAvatarKey = LOTTIE_ASSETS[avatar] ? avatar : "normal";

      setAvatarBot({ _id: 2, name: "Avatar", avatar: null });

      setMessages([
        {
          _id: 1,
          text: `¡Hola! Soy tu coach inteligente. Puedo ver y modificar tus rutinas y tu calendario de comidas. ¿Qué necesitas?`,
          createdAt: new Date(),
          user: { _id: 2, name: "Avatar" }
        }
      ]);
    }
  }, [isLoadingAvatar, avatar]);

  const onSend = useCallback((newMessages = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
    handleAvatarResponse(newMessages[0].text);
  }, []);

  const handleAvatarResponse = async (userMessage) => {
    setIsBotSpeaking(true);

    try {
      const responseJSON = await getGeminiAdvancedResponse(userMessage);

      // ✅ Procesar herramientas de IA
      if (responseJSON.tool_calls) {
        for (const call of responseJSON.tool_calls) {
          if (call.tool_name === "set_routine_preset") {
            await setRoutinePreset(call.parameters.dia, call.parameters.presetName);

          } else if (call.tool_name === "add_recipe_calendar") {
            await addRecipeToCalendar(call.parameters.fecha, call.parameters.receta);
          }
        }
      }

      // ✅ Respuesta final del bot
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: responseJSON.final_response || "¡Hecho!",
        createdAt: new Date(),
        user: avatarBot
      };

      setMessages(prev => GiftedChat.append(prev, [botMessage]));

    } catch (error) {
      console.error("Error IA:", error);
      Alert.alert("Error", "Tu IA tuvo un problema. Intenta de nuevo.");
    } finally {
      setIsBotSpeaking(false);
    }
  };

  const getGeminiAdvancedResponse = async (userMessage) => {
    const contextData = JSON.stringify({
      dia_actual: new Date().toLocaleDateString('es-ES', { weekday: 'long' }),
      fecha_hoy: new Date().toISOString().split("T")[0],
      rutinas_actuales: rutinas,
      calendario_reciente: Object.entries(recetasCalendar).slice(-3),
      presets_disponibles: Object.keys(PRESET_ROUTINES).join(", ")
    });

    const systemPrompt = `
Eres un coach de fitness avanzado en una app. 
Personalidad: ${avatar || "normal"}.

Puedes LEER y MODIFICAR los datos usando herramientas:

- set_routine_preset(dia, presetName)
- add_recipe_calendar(fecha, receta)

Datos actuales del usuario:
${contextData}

RESPONDE SIEMPRE EN FORMATO JSON:
{
  "tool_calls": [
    { "tool_name": "nombre", "parameters": { ... } }
  ],
  "final_response": "texto para el usuario"
}
`;

    const result = await model.generateContent(systemPrompt + `\nUsuario: "${userMessage}"`);
    const text = result.response.text();

    console.log("Respuesta RAW de Gemini:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini no devolvió JSON válido:", text);
      return { final_response: text };
    }
  };

  if (isLoadingAvatar || isLoadingData || !avatarBot) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LottieView
          source={LOTTIE_ASSETS[avatar] || LOTTIE_ASSETS["normal"]}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={USER}
        renderAvatar={null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", padding: 10, backgroundColor: "#f8f8f8" },
  lottie: { width: 100, height: 100 }
});

export default AvatarChatScreen;
