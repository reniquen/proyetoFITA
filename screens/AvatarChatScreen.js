import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, Composer } from 'react-native-gifted-chat';
import { useAvatar } from './AvatarContext';
import { useUserData } from './UserDataContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRESET_ROUTINES } from './RoutineCatalog';
import { useSubscription } from './SubscriptionContext';
import { CHILEAN_FOOD } from './ChileanFoodCatalog';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ⚠️ IMPORTANTE: Usa tu clave segura aquí
const API_KEY = "AIzaSyAfM3gdPuoig_PprpIcIVuWN_ORm9gV9O8";

const genAI = new GoogleGenerativeAI(API_KEY);

// --- PALETA "VIBRANT FITA" ---
const COLORS = {
  background: '#F2F5ED', // Crema verdoso cálido
  headerBg: '#4CAF50',
  headerText: '#FFFFFF',
  primary: '#4CAF50', 
  accent: '#FFC107', // Amarillo Ámbar
  textDark: '#263238',
  textMedium: '#546E7A',
  chatBg: '#FFFFFF', // Fondo del área de chat
  userBubble: '#4CAF50', // Burbuja del usuario (Verde)
  coachBubble: '#F9FBF7', // Burbuja del coach (Marfil)
  coachBubbleBorder: '#C8E6C9', // Borde sutil para el coach
  inputBg: '#F5F5F5', // Fondo de la barra de entrada
  inputPlaceholder: '#9E9E9E',
};

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
      setAvatarBot({ 
          _id: 2, 
          name: "Coach FITA", 
          // No usamos el avatar de GiftedChat, lo renderizaremos custom
          avatar: null 
      });
      setMessages([
        {
          _id: 1,
          text: `¡Hola! Soy tu Coach FITA. ¿Buscamos una rutina o quizás una receta rica (y chilena 🇨🇱)?`,
          createdAt: new Date(),
          user: { _id: 2, name: "Coach FITA" }
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
    const contextData = JSON.stringify({
      dia_actual: new Date().toLocaleDateString('es-CL', { weekday: 'long' }),
      fecha_hoy: new Date().toISOString().split("T")[0],
      rutinas_actuales: rutinas,
      dietas_actuales: dietas,
      calendario_reciente: Object.entries(recetasCalendar).slice(-3),
      presets_disponibles: Object.keys(PRESET_ROUTINES).join(", "),
      catalogo_chileno: CHILEAN_FOOD
    });

    const systemPrompt = `
Eres un coach de fitness avanzado en una app llamada FITA. 
Personalidad: ${avatar || "normal"}.
Ubicación/Contexto cultural: Chile 🇨🇱.

OBJETIVO PRINCIPAL:
Ayudar al usuario con sus rutinas y dietas. Tienes acceso a una base de datos especial de **Comida Chilena**.
- Cuando el usuario pida comida, intenta sugerir opciones chilenas del catálogo si encajan en sus macros.
- Si sugieres un plato chileno, explica brevemente por qué es bueno.
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

    try {
      const cleanedText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error("Gemini no devolvió JSON válido:", text);
      return { final_response: cleanedText || text };
    }
  };

  // --- FUNCIONES DE RENDERIZADO PERSONALIZADO PARA GIFTED CHAT ---

  // 1. Burbujas de mensaje
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: COLORS.coachBubble,
            borderWidth: 1,
            borderColor: COLORS.coachBubbleBorder,
            borderBottomLeftRadius: 0, // Cola del lado izquierdo para el coach
            marginBottom: 5,
            elevation: 1,
          },
          right: {
            backgroundColor: COLORS.userBubble,
            borderBottomRightRadius: 0, // Cola del lado derecho para el usuario
            marginBottom: 5,
            elevation: 1,
          },
        }}
        textStyle={{
          left: { color: COLORS.textDark, fontSize: 16 },
          right: { color: '#FFFFFF', fontSize: 16 },
        }}
      />
    );
  };

  // 2. Barra de entrada de texto
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: COLORS.chatBg,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingVertical: 8,
          paddingHorizontal: 10,
        }}
        primaryStyle={{ alignItems: 'center' }}
      />
    );
  };

  // 3. Campo de texto (Composer)
  const renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={{
        color: COLORS.textDark,
        backgroundColor: COLORS.inputBg,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 8 : 0,
        marginRight: 10,
        fontSize: 16,
      }}
      placeholderTextColor={COLORS.inputPlaceholder}
    />
  );

  // 4. Botón de enviar
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Icon name="send" size={24} color="#FFFFFF" />
        </View>
      </Send>
    );
  };

  // 5. Avatar personalizado al lado de los mensajes del bot
  const renderAvatar = (props) => {
      // Solo mostramos avatar para el bot
      if (props.currentMessage.user._id === 2) {
          return (
              <View style={styles.chatAvatarContainer}>
                   <LottieView
                      source={LOTTIE_ASSETS[avatar] || LOTTIE_ASSETS["normal"]}
                      autoPlay
                      loop
                      style={styles.chatAvatarLottie}
                      resizeMode="cover"
                    />
              </View>
          );
      }
      return null;
  };

  // 6. Indicador de "Escribiendo..."
  const renderLoading = () => {
      if (!isBotSpeaking) return null;
      return (
          <View style={styles.typingIndicatorContainer}>
               <LottieView
                  // Un lottie simple de 3 puntos saltando sería ideal aquí.
                  // Por ahora usamos uno del coach como placeholder, pero muy pequeño.
                  source={LOTTIE_ASSETS[avatar] || LOTTIE_ASSETS["normal"]}
                  autoPlay
                  loop
                  style={{ width: 40, height: 40, opacity: 0.6 }}
                />
                <Text style={styles.typingText}>Coach está escribiendo...</Text>
          </View>
      );
  };


  // --- MANEJO DE ESTADOS DE CARGA Y BLOQUEO ---
  if (isLoadingAvatar || isLoadingData || loadingSubscription || !avatarBot) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Conectando con tu Coach...</Text>
      </View>
    );
  }

  if (!isSubscribed) {
    return (
      <SafeAreaView style={styles.blockedContainer}>
        <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
        <Icon name="lock-outline" size={60} color={COLORS.accent} style={{marginBottom: 20}} />
        <Text style={styles.blockedTitle}>Coach IA Bloqueado</Text>
        <Text style={styles.blockedSubtitle}>
          Suscríbete a FITA Premium para desbloquear el potencial de tu entrenador inteligente personal.
        </Text>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => navigation.navigate("Suscripcion")}
        >
          <Text style={styles.subscribeButtonText}>Obtener Premium</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.headerBg} barStyle="light-content" />
      
      {/* --- NUEVA CABECERA VERDE --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Icon name="arrow-left" size={24} color={COLORS.headerText} />
        </TouchableOpacity>
        <View style={styles.headerAvatarContainer}>
          <LottieView
            source={LOTTIE_ASSETS[avatar] || LOTTIE_ASSETS["normal"]}
            autoPlay
            loop
            style={styles.headerLottie}
          />
        </View>
        <View>
            <Text style={styles.headerTitle}>Coach IA</Text>
            <Text style={styles.headerSubtitle}>Siempre listo para ayudarte</Text>
        </View>
      </View>

      {/* --- CHAT GIFTED CHAT PERSONALIZADO --- */}
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={USER}
          placeholder="Escribe tu mensaje aquí..."
          alwaysShowSend
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderAvatar={renderAvatar} // Avatar al lado del mensaje
          showAvatarForEveryMessage={true} // Mostrar siempre
          renderFooter={renderLoading} // Indicador de escribiendo al final
          keyboardShouldPersistTaps="never"
          bottomOffset={Platform.OS === 'ios' ? 40 : 0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // --- CABECERA ---
  header: {
    backgroundColor: COLORS.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
      marginRight: 15,
  },
  headerAvatarContainer: {
      width: 50, height: 50,
      borderRadius: 25,
      backgroundColor: '#FFF',
      justifyContent: 'center', alignItems: 'center',
      marginRight: 12,
      borderWidth: 2, borderColor: COLORS.accent,
      overflow: 'hidden'
  },
  headerLottie: { width: '90%', height: '90%' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.headerText },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },

  // --- ÁREA DE CHAT ---
  chatContainer: {
      flex: 1,
      backgroundColor: COLORS.chatBg, // Fondo blanco para los mensajes
  },
  
  // Avatar pequeño al lado del mensaje del bot
  chatAvatarContainer: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: COLORS.coachBubble,
      justifyContent: 'center', alignItems: 'center',
      borderWidth: 1, borderColor: COLORS.coachBubbleBorder,
      overflow: 'hidden',
      marginRight: 5, marginBottom: 5,
  },
  chatAvatarLottie: { width: '85%', height: '85%' },

  // Indicador de escribiendo
  typingIndicatorContainer: {
      flexDirection: 'row', items: 'center', padding: 10, marginLeft: 10, marginBottom: 10
  },
  typingText: { color: COLORS.textMedium, fontSize: 12, fontStyle: 'italic', marginLeft: 5 },

  // Botón de enviar
  sendButton: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: COLORS.accent, // Color ámbar para el botón
      justifyContent: 'center', alignItems: 'center',
      marginLeft: 5, marginBottom: 5, // Ajuste para alinear con el input
      elevation: 2,
  },

  // --- ESTADOS DE CARGA Y BLOQUEO ---
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  loadingText: { marginTop: 15, fontSize: 16, color: COLORS.textMedium, fontWeight: '600' },
  
  blockedContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 30, backgroundColor: COLORS.background },
  blockedTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 12, color: COLORS.textDark },
  blockedSubtitle: { textAlign: "center", marginBottom: 30, fontSize: 16, color: COLORS.textMedium, lineHeight: 22 },
  subscribeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15, paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },
  subscribeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});

export default AvatarChatScreen;