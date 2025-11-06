import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { useUserData } from './UserDataContext'; // <-- IMPORTANTE: Acceso a los datos
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRESET_ROUTINES } from './RoutineCatalog';

// ¡RECUERDA USAR TU API KEY REAL AQUÍ!
const API_KEY = "AIzaSyC1pejgzyzB-aZlIvMxKl--PTUC7UKQ8xM"; 
const genAI = new GoogleGenerativeAI(API_KEY);
// Usamos gemini-1.5-flash que es mejor para seguir instrucciones complejas (JSON)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" } // FORZAMOS RESPUESTA JSON SIEMPRE
});

const USER = { _id: 1, name: 'Tú' };

const AvatarChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const { avatar, isLoading: isLoadingAvatar } = useAvatar();
  // Obtenemos datos y funciones para manipularlos
  // **AQUÍ SE INCLUYEN setRoutinePreset y addRecipeToCalendar**
  const { 
    rutinas, 
    recetasCalendar, 
    setRoutinePreset, 
    updateRoutine, 
    addRecipeToCalendar, 
    isLoadingData 
  } = useUserData();
  
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [avatarBot, setAvatarBot] = useState(null);

  useEffect(() => {
    if (!isLoadingAvatar && avatar) {
      const currentAvatarKey = LOTTIE_ASSETS[avatar] ? avatar : 'normal';
      setAvatarBot({ _id: 2, name: 'Tu Avatar', avatar: null });
      setMessages([{
        _id: 1,
        text: `¡Hola! Soy tu coach inteligente. Puedo ver y modificar tus rutinas y tu calendario de comidas. ¿Qué necesitas?`,
        createdAt: new Date(),
        user: { _id: 2, name: 'Avatar' },
      }]);
    }
  }, [isLoadingAvatar, avatar]);

  const onSend = useCallback((newMessages = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
    handleAvatarResponse(newMessages[0].text);
  }, []);

  const handleAvatarResponse = async (userMessage) => {
    setIsBotSpeaking(true);
    try {
      // 1. Llamamos a Gemini (que ahora puede decidir usar herramientas)
      const responseJSON = await getGeminiAdvancedResponse(userMessage);
      
      // 2. Analizamos si Gemini quiere usar una herramienta
      if (responseJSON.tool_calls) {
        for (const call of responseJSON.tool_calls) {
          if (call.tool_name === 'update_routine') {
             // EJECUTAMOS LA FUNCIÓN REAL EN LA APP
             await updateRoutine(call.parameters.dia, [{ nombre: call.parameters.ejercicio, repeticiones: call.parameters.reps }]);
             // Añadimos un mensaje de sistema invisible para confirmar
             // (En una implementación real, volveríamos a llamar a Gemini con el resultado)
          } else if (call.tool_name === 'add_recipe_calendar') {
             // Se reemplazó updateRoutine por addRecipeToCalendar para ser coherente con el tool_name
             await addRecipeToCalendar(call.parameters.fecha, call.parameters.receta);
          
          // **AQUÍ SE AÑADE LA NUEVA HERRAMIENTA setRoutinePreset**
          } else if (call.tool_name === 'set_routine_preset') { 
             await setRoutinePreset(call.parameters.dia, call.parameters.presetName);
          }
        }
      }

      // 3. Mostramos la respuesta de texto final al usuario
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: responseJSON.final_response || "¡Hecho!", // Usa la respuesta del JSON
        createdAt: new Date(),
        user: avatarBot,
      };
      setMessages(prev => GiftedChat.append(prev, [botMessage]));

    } catch (error) {
      console.error("Error IA:", error);
      Alert.alert("Error", "Tu IA tuvo un cortocircuito. Intenta de nuevo.");
    } finally {
      setIsBotSpeaking(false);
    }
  };

  // --- CEREBRO AVANZADO DE GEMINI ---
  const getGeminiAdvancedResponse = async (userMessage) => {
    // 1. Preparamos el CONTEXTO (RAG-lite)
    // Le damos a la IA los datos actuales para que sepa qué contestar
    const contextData = JSON.stringify({
      dia_actual: new Date().toLocaleDateString('es-ES', { weekday: 'long' }),
      fecha_hoy: new Date().toISOString().split('T')[0],
      rutinas_actuales: rutinas,
      // Solo le damos las recetas de los próximos 3 días para no saturar el prompt
      calendario_reciente: Object.entries(recetasCalendar).slice(-3),
      // **AQUÍ SE AÑADEN LAS RUTINAS PREestablecidas para el contexto**
      presets_disponibles: Object.keys(PRESET_ROUTINES).join(', ')
    });

    // 2. El Prompt de Sistema "Agente"
    const systemPrompt = `
      Eres un coach de fitness avanzado en una app. Tienes personalidad: ${avatar || 'normal'}.
      
      TU SUPERPODER: Puedes leer y MODIFICAR los datos del usuario usando "herramientas".
      
      HERRAMIENTAS DISPONIBLES (si el usuario pide un cambio, DEBES usarlas):
      - update_routine(dia: string, ejercicio: string, reps: string): Reemplaza la rutina de un día COMPLETO.
      - add_recipe_calendar(fecha: string YYYY-MM-DD, receta: string): Agrega una comida al calendario.
      - set_routine_preset(dia: string, presetName: string): Cambia la rutina de un día usando un preset.
      
      **¡IMPORTANTE!** Los presets válidos están en 'presets_disponibles' en el Contexto.

      DATOS ACTUALES DEL USUARIO (Contexto):
      ${contextData}

      INSTRUCCIONES DE RESPUESTA (OBLIGATORIO RESPONDER SIEMPRE EN ESTE FORMATO JSON):
      {
        "tool_calls": [ // Array opcional, solo si necesitas ejecutar acciones
          { "tool_name": "nombre_herramienta", "parameters": { ...argumentos } }
        ],
        "final_response": "Tu respuesta conversacional amigable aquí para el usuario."
      }

      Ejemplo de uso de Preset (Usuario: "Pon la rutina de cardio al lunes"):
      { 
        "tool_calls": [{ 
          "tool_name": "set_routine_preset", 
          "parameters": { "dia": "lunes", "presetName": "CARDIO_QUEMA" } 
        }], 
        "final_response": "¡Entendido! Acabo de aplicar el preset CARDIO_QUEMA para tu lunes. ¡A quemar calorías!" 
      }
      
      Ejemplo 2 (Usuario: "¿Qué me toca hoy?"):
      {
        "final_response": "Hoy [día] te toca [ver rutinas_actuales en el contexto]. ¡A darle con todo!"
      }
    `;

    const result = await model.generateContent(systemPrompt + `\nUsuario: "${userMessage}"`);
    const text = result.response.text();
    console.log("Respuesta RAW de Gemini (JSON):", text);
    
    try {
      // Parseamos la respuesta JSON que forzamos a Gemini a generar
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini no devolvió JSON válido:", text);
      return { final_response: text }; // Fallback por si acaso
    }
  };

  if (isLoadingAvatar || isLoadingData || !avatarBot) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
         <LottieView source={LOTTIE_ASSETS[avatar] || LOTTIE_ASSETS['normal']} autoPlay loop style={styles.lottie} />
      </View>
      <GiftedChat messages={messages} onSend={messages => onSend(messages)} user={USER} renderAvatar={null} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 10, backgroundColor: '#f8f8f8' },
  lottie: { width: 100, height: 100 },
});

export default AvatarChatScreen;