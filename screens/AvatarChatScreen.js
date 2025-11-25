import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { useUserData } from './UserDataContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRESET_ROUTINES } from './RoutineCatalog';

const API_KEY = "AIzaSyD0b2vVee6OYEWfwABSw6GTTrLoQbMv0dg";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
  generationConfig: { responseMimeType: "application/json" }
});

const USER = { _id: 1, name: "Tú" };

const AvatarChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const { avatar, isLoading: isLoadingAvatar } = useAvatar();

  // --- INICIO DE LA MODIFICACIÓN ---
  // 1. Traemos 'dietas' y la nueva función 'updateDietTemplate'
  const {
    rutinas,
    dietas, // 👈 Nuevo
    recetasCalendar,
    setRoutinePreset,
    addRecipeToCalendar,
    updateDietTemplate, // 👈 Nuevo
    isLoadingData
  } = useUserData();
  // --- FIN DE LA MODIFICACIÓN ---

  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [avatarBot, setAvatarBot] = useState(null);

  useEffect(() => {
    if (!isLoadingAvatar && avatar) {
      setAvatarBot({ _id: 2, name: "Avatar", avatar: null });
      setMessages([
        {
          _id: 1,
          text: `¡Hola! Soy tu coach inteligente. ¿Qué necesitas?`, // 👈 Texto actualizado
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
  
          // --- INICIO DE LA MODIFICACIÓN ---
          // 2. Añadimos el manejo de la nueva herramienta
          } else if (call.tool_name === "update_diet_template") {
            console.log("Llamando updateDietTemplate:", call.parameters); // Para depurar
            await updateDietTemplate(
              call.parameters.dia,
              call.parameters.nombre_comida, // "Desayuno", "Almuerzo", "Cena"
              call.parameters.comida_detalle,
              call.parameters.calorias
            );
          }
          // --- FIN DE LA MODIFICACIÓN ---
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
    // --- INICIO DE LA MODIFICACIÓN ---
    // 3. Añadimos 'dietas_actuales' al contexto que enviamos a la IA
    const contextData = JSON.stringify({
      dia_actual: new Date().toLocaleDateString('es-ES', { weekday: 'long' }),
      fecha_hoy: new Date().toISOString().split("T")[0],
      rutinas_actuales: rutinas,
      dietas_actuales: dietas, // 👈 Nuevo
      calendario_reciente: Object.entries(recetasCalendar).slice(-3),
      presets_disponibles: Object.keys(PRESET_ROUTINES).join(", ")
    });

    // 4. Actualizamos el System Prompt con la nueva herramienta
    const systemPrompt = `
Eres un coach de fitness avanzado en una app. 
Personalidad: ${avatar || "normal"}.

Puedes LEER y MODIFICAR los datos usando herramientas. Tienes dos tipos de datos de comida:
1. DIETAS (plantillas del Home, por día de la semana, ej: "lunes").
2. CALENDARIO (comidas específicas por fecha, ej: "2025-11-13").

HERRAMIENTAS DISPONIBLES:

// Herramienta para cambiar la RUTINA de un DÍA de la semana (Lunes, Martes, etc.)
- set_routine_preset(dia: string, presetName: string)

// Herramienta para AÑADIR o MODIFICAR la DIETA/COMIDA del HOME (plantilla semanal).
// 'nombre_comida' debe ser "Desayuno", "Almuerzo" o "Cena".
- update_diet_template(dia: string, nombre_comida: string, comida_detalle: string, calorias: number)

// Herramienta para AÑADIR una comida al CALENDARIO en una FECHA específica.
// ¡Usa 'fecha_hoy' si el usuario pide añadir algo "hoy" al calendario!
- add_recipe_calendar(fecha: string, receta: string)

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
    // --- FIN DE LA MODIFICACIÓN ---

    const result = await model.generateContent(systemPrompt + `\nUsuario: "${userMessage}"`);
    const text = result.response.text();

    console.log("Respuesta RAW de Gemini:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini no devolvió JSON válido:", text);
      // Si Gemini no da JSON, igual muestra su respuesta en texto plano
      return { final_response: text.replace(/```json|```/g, '') }; 
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

// ... (Estilos quedan igual) ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", padding: 10, backgroundColor: "#f8f8f8" },
  lottie: { width: 100, height: 100 }
});

export default AvatarChatScreen;