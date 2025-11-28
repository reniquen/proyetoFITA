// ./screens/AvatarChatScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { useUserData } from './UserDataContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRESET_ROUTINES } from './RoutineCatalog';
import { useSubscription } from './SubscriptionContext';
// 👇 1. IMPORTAMOS EL NUEVO CATÁLOGO CHILENO
import { CHILEAN_FOOD } from './ChileanFoodCatalog';

// ⚠️ IMPORTANTE: Usa tu clave segura aquí (desde .env o backend)
// Si usas .env: import { GEMINI_API_KEY } from '@env';
const API_KEY = "AIzaSyAAafhpOoBcZ2voadkJMFOd86W4gM5tXHo"; 

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

const USER = { _id: 1, name: "Tú" };

const AvatarChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const { avatar, isLoading: isLoadingAvatar } = useAvatar();

  const {
    rutinas,
    dietas,
    recetasCalendar,
    setRoutinePreset,
    addRecipeToCalendar,
    updateDietTemplate,
    isLoadingData
  } = useUserData();

  const { isSubscribed, loadingSubscription } = useSubscription();

  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [avatarBot, setAvatarBot] = useState(null);

  useEffect(() => {
    if (!isLoadingAvatar && avatar) {
      setAvatarBot({ _id: 2, name: "Avatar", avatar: null });
      setMessages([
        {
          _id: 1,
          text: `¡Hola! Soy tu coach inteligente. ¿Buscamos una rutina o quizás una receta rica (y chilena 🇨🇱)?`,
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

      if (responseJSON.tool_calls) {
        for (const call of responseJSON.tool_calls) {
          if (call.tool_name === "set_routine_preset") {
            await setRoutinePreset(call.parameters.dia, call.parameters.presetName);
          } else if (call.tool_name === "add_recipe_calendar") {
            await addRecipeToCalendar(call.parameters.fecha, call.parameters.receta);
          } else if (call.tool_name === "update_diet_template") {
            await updateDietTemplate(
              call.parameters.dia,
              call.parameters.nombre_comida,
              call.parameters.comida_detalle,
              call.parameters.calorias
            );
          }
        }
      }

      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: responseJSON.final_response || "¡Hecho! He actualizado tu plan.",
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
    // 👇 2. INYECTAMOS LOS DATOS CHILENOS EN EL CONTEXTO
    const contextData = JSON.stringify({
      dia_actual: new Date().toLocaleDateString('es-CL', { weekday: 'long' }),
      fecha_hoy: new Date().toISOString().split("T")[0],
      rutinas_actuales: rutinas,
      dietas_actuales: dietas,
      calendario_reciente: Object.entries(recetasCalendar).slice(-3),
      presets_disponibles: Object.keys(PRESET_ROUTINES).join(", "),
      catalogo_chileno: CHILEAN_FOOD // <--- Aquí va la magia
    });

    const systemPrompt = `
Eres un coach de fitness avanzado en una app llamada FITA. 
Personalidad: ${avatar || "normal"}.
Ubicación/Contexto cultural: Chile 🇨🇱.

OBJETIVO PRINCIPAL:
Ayudar al usuario con sus rutinas y dietas. Tienes acceso a una base de datos especial de **Comida Chilena** (ingredientes y recetas típicas pero saludables).
- Cuando el usuario pida comida, intenta sugerir opciones chilenas del catálogo si encajan en sus macros, o mézclalas con opciones internacionales estándar.
- Si sugieres un plato chileno (ej: Cazuela, Charquicán), explica brevemente por qué es bueno (ej: "es alto en fibra").
- Mantén un tono motivador y cercano.

HERRAMIENTAS DISPONIBLES:
- set_routine_preset(dia: string, presetName: string)
- update_diet_template(dia: string, nombre_comida: string, comida_detalle: string, calorias: number)
- add_recipe_calendar(fecha: string, receta: string)

Datos actuales del usuario y Catálogo Chileno:
${contextData}

RESPONDE SIEMPRE EN FORMATO JSON:
{
  "tool_calls": [
    { "tool_name": "nombre", "parameters": { } }
  ],
  "final_response": "texto para el usuario (usa emojis)"
}
`;
    const result = await model.generateContent(systemPrompt + `\nUsuario: "${userMessage}"`);
    const text = result.response.text();
    console.log("Respuesta RAW de Gemini:", text);

    try {
      // Limpieza básica por si Gemini devuelve markdown ```json ... ```
      const cleanedText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error("Gemini no devolvió JSON válido:", text);
      return { final_response: cleanedText || text };
    }
  };

  // loaders
  if (isLoadingAvatar || isLoadingData || loadingSubscription || !avatarBot) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // bloqueo por suscripción
  if (!isSubscribed) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Chatbot bloqueado 🔒</Text>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Debes suscribirte para acceder al entrenador inteligente.
        </Text>

        <TouchableOpacity
          style={{ backgroundColor: "#007AFF", padding: 14, borderRadius: 10 }}
          onPress={() => navigation.navigate("Suscripcion")}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Suscribirme</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
        placeholder="Escribe aquí... (ej: 'Dame una cena chilena ligera')"
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