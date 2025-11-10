import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { useUserData } from './UserDataContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
// ✅ 1. IMPORTAMOS LOS EJERCICIOS DISPONIBLES
import { PRESET_ROUTINES, EXERCISES } from './RoutineCatalog';

const API_KEY = "AIzaSyC1pejgzyzB-aZlIvMxKl--PTUC7UKQ8xM"; // Asegúrate de proteger esta clave
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

const USER = { _id: 1, name: "Tú" };

const AvatarChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const { avatar, isLoading: isLoadingAvatar } = useAvatar();

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
  }, [avatarBot, rutinas, recetasCalendar]); // <-- Asegúrate de tener los datos más frescos

  const handleAvatarResponse = async (userMessage) => {
    setIsBotSpeaking(true);

    try {
      // Pasamos el estado actual al método de respuesta
      const responseJSON = await getGeminiAdvancedResponse(userMessage, rutinas, recetasCalendar);

      // Procesar herramientas de IA
      if (responseJSON.tool_calls && responseJSON.tool_calls.length > 0) {
        for (const call of responseJSON.tool_calls) {
          if (call.tool_name === "set_routine_preset") {
            await setRoutinePreset(call.parameters.dia, call.parameters.presetName);
          } else if (call.tool_name === "add_recipe_calendar") {
            await addRecipeToCalendar(call.parameters.fecha, call.parameters.receta);
          }
        }
      }

      // Respuesta final del bot
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: responseJSON.final_response || "¡Hecho! ¿Algo más?",
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

  // ✅ 2. PASAMOS LOS DATOS AL GENERADOR DE RESPUESTA
  const getGeminiAdvancedResponse = async (userMessage, currentRutinas, currentRecetas) => {
    
    // Creamos la lista de ejercicios que la IA puede "ver"
    const availableExercises = Object.keys(EXERCISES).map(key => EXERCISES[key].nombre);

    const contextData = JSON.stringify({
      dia_actual: new Date().toLocaleDateString('es-ES', { weekday: 'long' }),
      fecha_hoy: new Date().toISOString().split("T")[0],
      rutinas_actuales: currentRutinas,
      calendario_reciente: Object.entries(currentRecetas).slice(-3),
      presets_disponibles: Object.keys(PRESET_ROUTINES).join(", "),
      // ✅ 3. INYECTAMOS LOS EJERCICIOS AL CONTEXTO
      ejercicios_disponibles: availableExercises 
    });

    // ✅ 4. MEJORAMOS EL SYSTEM PROMPT CON REGLAS ESTRICTAS
    const systemPrompt = `
Eres un coach de fitness avanzado en una app. 
Personalidad: ${avatar || "normal"}.

Puedes LEER y MODIFICAR los datos usando herramientas:
- set_routine_preset(dia, presetName)
- add_recipe_calendar(fecha, receta)

Datos actuales del usuario:
${contextData}

REGLAS DE EJERCICIOS (¡MUY IMPORTANTE!):
1.  Si el usuario pide "ejercicios" (ej: para brazos, piernas, torso), DEBES basar tu respuesta ÚNICAMENTE en la lista de "ejercicios_disponibles" que te he pasado en el contexto.
2.  Relaciona la parte del cuerpo que pide (piernas, torso, brazos, etc.) con los ejercicios de esa lista.
    -   Ejemplo 1: Si pide "piernas", sugiere "Sentadillas" o "Prensa de Pierna" (si están en la lista).
    -   Ejemplo 2: Si pide "torso" o "espalda", sugiere "Dominadas" (si está en la lista).
    -   Ejemplo 3: Si pide "pecho" o "brazos", sugiere "Press de Banca" o "Press Militar" (si están en la lista).
3.  Tu objetivo principal es usar los ejercicios que YA existen en la app (la lista de "ejercicios_disponibles"), porque esos son los que tienen videos y animaciones Lottie. No inventes ejercicios nuevos si uno de la lista sirve.
4.  Si el usuario pide cambiar una rutina (ej: "cambia el lunes a pierna"), debes usar la herramienta 'set_routine_preset' con el 'dia' y un 'presetName' de la lista 'presets_disponibles'.

RESPONDE SIEMPRE EN FORMATO JSON VÁLIDO:
{
  "tool_calls": [
    { "tool_name": "nombre_herramienta", "parameters": { "param1": "valor1" } }
  ],
  "final_response": "Tu respuesta en texto aquí."
}
Si no necesitas usar una herramienta, envía "tool_calls" como un array vacío [].
`;

    const result = await model.generateContent(systemPrompt + `\nUsuario: "${userMessage}"`);
    const text = result.response.text();

    console.log("Respuesta RAW de Gemini:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini no devolvió JSON válido:", text);
      // Fallback si la IA no responde con JSON
      return { tool_calls: [], final_response: text };
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
        // Opcional: mostrar un indicador mientras la IA "escribe"
        isTyping={isBotSpeaking} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", padding: 10, backgroundColor: "#f8f8f8", borderBottomWidth: 1, borderBottomColor: "#eee" },
  lottie: { width: 100, height: 100 }
});

export default AvatarChatScreen;