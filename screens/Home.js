import {
  Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, Modal,
  SafeAreaView, Alert, Dimensions, ActivityIndicator, StatusBar
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import AvatarCoach from './AvatarCoach';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useUserData } from './UserDataContext';
import { useSubscription } from './SubscriptionContext';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// --- PALETA DE COLORES FITA OSCURA ---
const HOME_COLORS = {
  background: '#1A332B',
  primary: '#5CB85C',
  secondary: '#8BC34A',
  accent: '#EBA83A',
  textDark: '#FFFFFF',
  textMedium: '#CCCCCC',
  textLight: '#A0A0A0',
  cardBg: '#253A32',
  cardBgLighter: '#2E473D',
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  menuBg: '#2E473D',
  fabRed: '#D32F2F',
  verVideoBtn: '#5CB85C',
  // NUEVO COLOR PARA LA CABECERA: Un tono ligeramente distinto para separarla
  headerBg: '#1F3A30',
};

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dynamicTip, setDynamicTip] = useState("¡Vamos a entrenar!");

  const [dietaDiaIndex, setDietaDiaIndex] = useState(new Date().getDay());
  const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  const { rutinas, dietas, isLoadingData } = useUserData();
  const { isSubscribed, activateSubscription } = useSubscription();

  useEffect(() => { setDynamicTip(getDynamicTip()); }, []);

  const cambiarDietaDia = (delta) => {
    setDietaDiaIndex((prevIndex) => {
      let newIndex = prevIndex + delta;
      if (newIndex < 0) newIndex = diasSemana.length - 1;
      else if (newIndex >= diasSemana.length) newIndex = 0;
      return newIndex;
    });
  };

  const getDynamicTip = () => {
    const hour = new Date().getHours();
    const morningTips = [
      "¡Buen día! Un desayuno alto en proteína es clave.",
      "Recuerda calentar bien antes de tu rutina de hoy.",
      "La consistencia gana a la intensidad. ¡Vamos por ello!",
      "¡A empezar el día con energía!",
      "No olvides hidratarte. El agua es tu combustible."
    ];
    const afternoonTips = [
      "¡Buenas tardes! ¿Listo/a para la rutina?",
      "Mantén la hidratación durante la tarde.",
      "Un snack saludable te dará energía para el entreno.",
      "¡Vamos a entrenar! Termina el día con fuerza.",
      "Cuida tu postura, marca la diferencia."
    ];
    const eveningTips = [
      "¡Buenas noches! ¿Cumpliste tu objetivo hoy?",
      "Una cena ligera ayuda a la recuperación muscular.",
      "Estira 10 minutos antes de dormir. Tu cuerpo lo agradecerá.",
      "El descanso es parte fundamental del progreso.",
      "Planifica tu día de mañana para asegurar el éxito."
    ];
    let tipsList;
    if (hour < 12) tipsList = morningTips;
    else if (hour < 19) tipsList = afternoonTips;
    else tipsList = eveningTips;
    return tipsList[Math.floor(Math.random() * tipsList.length)];
  };

  const openVideo = (videoUrl) => {
    const videoId = getYouTubeId(videoUrl);
    if (videoId) {
      setSelectedVideoId(videoId);
      setIsPlaying(true);
      setModalVisible(true);
    } else {
      Alert.alert("Aviso", "Este ejercicio no tiene video disponible.");
    }
  };

  const closeVideo = () => {
    setIsPlaying(false);
    setModalVisible(false);
    setSelectedVideoId(null);
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") closeVideo();
  }, []);

  const diaActualRutina = diasSemana[new Date().getDay()];
  const rutinaHoy = rutinas[diaActualRutina] || [];

  const diaMostradoDieta = diasSemana[dietaDiaIndex];
  const dietaHoy = (dietas && dietas[diaMostradoDieta]) ? dietas[diaMostradoDieta] : [];
  const totalCalorias = dietaHoy.reduce((total, comida) => total + (comida.calorias || 0), 0);

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch(() => Alert.alert('Error', 'No se pudo cerrar sesión.'));
  };

  const renderAsset = (ejercicio) => {
    if (!ejercicio.imagen) {
      return (
        <View style={[styles.mediaAsset, { backgroundColor: HOME_COLORS.cardBgLighter, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: HOME_COLORS.textLight, fontSize: 10 }}>Sin Media</Text>
        </View>
      );
    }
    const isLottie = typeof ejercicio.imagen === 'object' && ejercicio.imagen !== null;
    if (isLottie) {
      return <LottieView source={ejercicio.imagen} autoPlay loop style={styles.mediaAsset} />;
    } else {
      return <Image source={ejercicio.imagen} style={styles.mediaAsset} resizeMode="cover" />;
    }
  };

  const toggleMenu = () => { setMenuOpen(!menuOpen); };

  const renderMenuItem = (icon, label, onPress, iconColor) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconContainer, { backgroundColor: iconColor || HOME_COLORS.primary }]}>
        <Text style={styles.menuIconEmoji}>{icon}</Text>
      </View>
      <Text style={styles.menuLabelText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedorPrincipal}>
      {/* Barra de estado con el color de la nueva cabecera para continuidad */}
      <StatusBar backgroundColor={HOME_COLORS.headerBg} barStyle="light-content" /> 
      
      <SafeAreaView style={styles.safeAreaContent}> 
        
        {/* --- NUEVA BARRA SUPERIOR PROFESIONAL (Fuera del ScrollView) --- */}
        <View style={styles.topHeaderBar}>
          {/* Texto centrado */}
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>
          
          {/* Botón del menú posicionado absolutamente a la derecha */}
          <TouchableOpacity style={styles.staticMenuButton} onPress={toggleMenu} activeOpacity={0.6}>
            <Icon name={menuOpen ? "close" : "menu"} size={28} color={HOME_COLORS.textDark} />
          </TouchableOpacity>
        </View>
        {/* ------------------------------------------------------------- */}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* HEADER & AVATAR (Coach Section) */}
          <View style={styles.coachSection}>
            <View style={styles.avatarContainer}>
              <AvatarCoach />
            </View>
            <View style={styles.greetingBubble}>
              <Text style={styles.greetingText}>{dynamicTip}</Text>
              <View style={styles.bubbleTriangle} />
            </View>
          </View>

          {/* RUTINA */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tu Rutina de Hoy</Text>
            <Text style={styles.sectionSubtitle}>{diaActualRutina.charAt(0).toUpperCase() + diaActualRutina.slice(1)}</Text>
            
            {isLoadingData ? (
              <ActivityIndicator size="large" color={HOME_COLORS.primary} style={{marginTop: 20}} />
            ) : rutinaHoy.length > 0 ? (
              rutinaHoy.map((ejercicio, index) => (
                <View key={index} style={styles.workoutCard}>
                  <TouchableOpacity onPress={() => openVideo(ejercicio.video)} disabled={!ejercicio.video} activeOpacity={0.7}>
                    {renderAsset(ejercicio)}
                    {ejercicio.video && (
                      <View style={styles.playIconOverlay}>
                         <Icon name="play-circle" size={24} color={HOME_COLORS.textDark} />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={styles.workoutTextContainer}>
                    <Text style={styles.workoutName}>{ejercicio.nombre}</Text>
                    <Text style={styles.workoutReps}>{ejercicio.repeticiones}</Text>
                    {ejercicio.video && (
                      <TouchableOpacity style={styles.verVideoBtnCompact} onPress={() => openVideo(ejercicio.video)}>
                        <Text style={styles.verVideoTextCompact}>Ver video</Text>
                        <Icon name="arrow-right" size={14} color={HOME_COLORS.textDark} style={{marginLeft: 4}}/>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                 <Icon name="bed" size={40} color={HOME_COLORS.textLight} />
                 <Text style={styles.emptyStateText}>Hoy es día de descanso. ¡Recupérate!</Text>
              </View>
            )}
          </View>

          {/* DIETA */}
          <View style={styles.sectionContainer}>
            <View style={styles.dietHeaderContainer}>
              <View>
                 <Text style={styles.sectionTitle}>Plan de Alimentación</Text>
                 <Text style={styles.sectionSubtitle}>{diaMostradoDieta.charAt(0).toUpperCase() + diaMostradoDieta.slice(1)}</Text>
              </View>
              <View style={styles.dietNavControls}>
                <TouchableOpacity onPress={() => cambiarDietaDia(-1)} style={styles.navButton}>
                  <Icon name="chevron-left" size={28} color={HOME_COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cambiarDietaDia(1)} style={styles.navButton}>
                  <Icon name="chevron-right" size={28} color={HOME_COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {isLoadingData ? (
              <ActivityIndicator size="small" color={HOME_COLORS.accent} style={{marginTop: 20}} />
            ) : dietaHoy.length > 0 ? (
              <View style={styles.dietListContainer}>
                {dietaHoy.map((comida, index) => (
                  <View key={index} style={styles.dietMealCard}>
                    <View style={styles.dietMealIcon}>
                       <Icon name="food-apple" size={20} color={HOME_COLORS.primary} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.mealName}>{comida.nombre}</Text>
                      <Text style={styles.mealDescription}>{comida.comida}</Text>
                    </View>
                    <Text style={styles.mealCalories}>{comida.calorias} kcal</Text>
                  </View>
                ))}
                 <View style={styles.totalCaloriesContainer}>
                    <Text style={styles.totalCaloriesLabel}>Total Diario:</Text>
                    <Text style={styles.totalCaloriesValue}>{totalCalorias} kcal</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                 <Icon name="food-off" size={40} color={HOME_COLORS.textLight} />
                 <Text style={styles.emptyStateText}>No hay dieta programada para este día.</Text>
              </View>
            )}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>

      {/* --- ELEMENTOS FIJOS --- */}

      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />
      )}

      {/* MENÚ DESPLEGABLE (Posición ajustada para la nueva cabecera) */}
      {menuOpen && (
        <View style={styles.menuDropdown}>
          {renderMenuItem("👤", "Mi Avatar", () => navigation.navigate('Avatar'), HOME_COLORS.primary)}
          {renderMenuItem("📅", "Calendario", () => navigation.navigate('CalendarRecipes'), HOME_COLORS.secondary)}
          {renderMenuItem("📷", "Scanner", () => navigation.navigate('Scanner'), HOME_COLORS.accent)}
          {renderMenuItem("💬", "Coach IA", () => {
             if (!isSubscribed) { Alert.alert("Suscripción Requerida", "Necesitas Premium para el Coach IA."); return; }
             navigation.navigate('AvatarChat');
          }, '#1976D2')}
          <View style={styles.menuDivider} />
          {renderMenuItem("ℹ️", "Quiénes Somos", () => navigation.navigate('AboutUs'), '#607D8B')}
          {renderMenuItem("🚪", "Cerrar Sesión", cerrarSesion, HOME_COLORS.fabRed)}
        </View>
      )}

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeVideo}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {selectedVideoId && (
              <YoutubePlayer
                height={200}
                width={Dimensions.get('window').width * 0.85}
                play={isPlaying}
                videoId={selectedVideoId}
                onChangeState={onStateChange}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeVideo}>
              <Text style={styles.closeButtonText}>Cerrar Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- ESTRUCTURA PRINCIPAL ---
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: HOME_COLORS.background,
    position: 'relative',
  },
  safeAreaContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20, // Padding superior normal ahora que la cabecera está fuera
    paddingBottom: 40,
  },

  // --- NUEVA BARRA SUPERIOR PROFESIONAL ---
  topHeaderBar: {
    backgroundColor: HOME_COLORS.headerBg, // Color distintivo
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centra el contenido horizontalmente (el texto)
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4, // Sombra sutil para dar profundidad
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10, // Asegura que esté por encima del scroll
  },
  welcomeText: {
    fontSize: 24, // Tamaño de título
    fontWeight: 'bold',
    color: HOME_COLORS.textDark,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  // Botón del menú posicionado absolutamente DENTRO de la barra
  staticMenuButton: {
    position: 'absolute',
    right: 20, // Anclado a la derecha
    padding: 8,
    // backgroundColor eliminado para que se integre mejor en la nueva barra
  },

  // --- SECCIÓN DEL COACH ---
  coachSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 20, // Espacio entre la barra superior y el coach
  },
  avatarContainer: { marginRight: 15 },
  greetingBubble: {
    flex: 1,
    backgroundColor: HOME_COLORS.cardBg,
    padding: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    elevation: 2,
    shadowColor: HOME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  greetingText: { color: HOME_COLORS.textDark, fontSize: 15, lineHeight: 20, fontStyle: 'italic' },
  bubbleTriangle: {
    position: 'absolute', bottom: -8, left: 0, width: 0, height: 0,
    borderStyle: 'solid', borderTopWidth: 8, borderRightWidth: 10, borderBottomWidth: 0, borderLeftWidth: 0,
    borderTopColor: HOME_COLORS.cardBg, borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent',
  },

  // --- SECCIONES GENERALES ---
  sectionContainer: { marginBottom: 35 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: HOME_COLORS.textDark, marginBottom: 2, letterSpacing: 0.5 },
  sectionSubtitle: { fontSize: 14, color: HOME_COLORS.primary, fontWeight: '600', marginBottom: 15, textTransform: 'capitalize' },

  // --- TARJETAS DE RUTINA ---
  workoutCard: {
    flexDirection: 'row', backgroundColor: HOME_COLORS.cardBg, borderRadius: 16, padding: 12, marginBottom: 12, alignItems: 'center',
    elevation: 3, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  mediaAsset: { width: 80, height: 80, borderRadius: 12, marginRight: 15 },
  playIconOverlay: { position: 'absolute', top: 0, left: 0, right: 15, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12 },
  workoutTextContainer: { flex: 1, justifyContent: 'center' },
  workoutName: { fontSize: 16, fontWeight: '700', color: HOME_COLORS.textDark, marginBottom: 4 },
  workoutReps: { fontSize: 14, color: HOME_COLORS.textMedium, marginBottom: 8 },
  verVideoBtnCompact: { flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.verVideoBtn, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignSelf: 'flex-start' },
  verVideoTextCompact: { fontSize: 12, color: HOME_COLORS.textDark, fontWeight: 'bold' },

  // --- DIETA ---
  dietHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  dietNavControls: { flexDirection: 'row', backgroundColor: HOME_COLORS.cardBg, borderRadius: 25, padding: 4 },
  navButton: { padding: 6 },
  dietListContainer: { backgroundColor: HOME_COLORS.cardBg, borderRadius: 18, padding: 15, marginTop: 10 },
  dietMealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.cardBgLighter, borderRadius: 12, padding: 12, marginBottom: 10 },
  dietMealIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(92, 184, 92, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mealName: { fontSize: 15, fontWeight: '700', color: HOME_COLORS.textDark },
  mealDescription: { fontSize: 13, color: HOME_COLORS.textMedium, marginTop: 2 },
  mealCalories: { fontSize: 14, fontWeight: '700', color: HOME_COLORS.accent },
  totalCaloriesContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  totalCaloriesLabel: { fontSize: 16, color: HOME_COLORS.textMedium },
  totalCaloriesValue: { fontSize: 20, fontWeight: '800', color: HOME_COLORS.accent },

  // --- ESTADOS VACÍOS ---
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: HOME_COLORS.cardBg, borderRadius: 16, marginTop: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: HOME_COLORS.textLight },
  emptyStateText: { color: HOME_COLORS.textMedium, fontSize: 15, marginTop: 10, textAlign: 'center' },

  // --- MODAL ---
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: HOME_COLORS.cardBg, padding: 15, borderRadius: 20, alignItems: 'center', elevation: 10 },
  closeButton: { marginTop: 20, padding: 12, backgroundColor: HOME_COLORS.fabRed, borderRadius: 12, width: '100%', alignItems: 'center' },
  closeButtonText: { color: HOME_COLORS.textDark, fontWeight: 'bold', fontSize: 16 },

  // --- MENÚ DESPLEGABLE ---
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 15,
  },
  menuDropdown: {
    position: 'absolute',
    // Ajustado: Altura aproximada de la barra (60-70) + un pequeño margen
    top: 70,
    right: 10, // Un poco más a la derecha para alinearse con el botón
    width: 220,
    backgroundColor: HOME_COLORS.menuBg,
    borderRadius: 16,
    paddingVertical: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIconContainer: {
    width: 32, height: 32,
    borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  menuIconEmoji: { fontSize: 18 },
  menuLabelText: {
    fontSize: 15,
    fontWeight: '600',
    color: HOME_COLORS.textDark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 5,
    marginHorizontal: 16,
  },
});