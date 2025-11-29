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

// --- NUEVA PALETA: FITA LUMINOSA Y CÁLIDA ---
const HOME_COLORS = {
  // Fondo general claro y cálido (casi blanco con un toque crema/gris)
  background: '#F5F7F2',

  // Cabecera Verde Sólida para identidad de marca
  headerBg: '#5CB85C',
  headerText: '#FFFFFF', // Texto blanco para que resalte en la cabecera verde

  // Verdes de la marca
  primary: '#5CB85C',
  secondary: '#8BC34A',

  // AMARILLO/MOSTAZA POTENCIADO (Más soleado y vibrante)
  accent: '#FBC02D', // Amarillo oro

  // Textos oscuros para fondo claro
  textDark: '#2D3E32',   // Verde bosque muy oscuro para títulos principales
  textMedium: '#5D6D64', // Gris verdoso medio para descripciones
  textLight: '#9EA7A3',  // Gris claro para detalles sutiles

  // Tarjetas blancas y limpias
  cardBg: '#FFFFFF',
  cardBgLighter: '#FAFAFA', // Casi blanco para sub-elementos
  shadowColor: 'rgba(0, 0, 0, 0.1)', // Sombra suave

  menuBg: '#FFFFFF', // Menú blanco

  // Colores FAB (Ajustados para vibrar más)
  fabRed: '#E53935',
  verVideoBtn: '#5CB85C',
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
        // Ajustado el fondo del placeholder para que no sea tan oscuro
        <View style={[styles.mediaAsset, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: HOME_COLORS.textMedium, fontSize: 10 }}>Sin Media</Text>
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
      {/* Usamos el color de acento (amarillo) por defecto si no se especifica otro, para darle más vida al menú */}
      <View style={[styles.menuIconContainer, { backgroundColor: iconColor || HOME_COLORS.accent }]}>
        <Text style={styles.menuIconEmoji}>{icon}</Text>
      </View>
      <Text style={styles.menuLabelText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedorPrincipal}>
      {/* Barra de estado clara porque la cabecera es verde oscura */}
      <StatusBar backgroundColor={HOME_COLORS.headerBg} barStyle="light-content" />

      <SafeAreaView style={styles.safeAreaContent}>

        {/* --- BARRA SUPERIOR VERDE --- */}
        <View style={styles.topHeaderBar}>
          {/* Texto blanco para contrastar con el fondo verde */}
          <Text style={styles.welcomeText}>¡Bienvenido!</Text>

          {/* Icono del menú en blanco */}
          <TouchableOpacity style={styles.staticMenuButton} onPress={toggleMenu} activeOpacity={0.6}>
            <Icon name={menuOpen ? "close" : "menu"} size={28} color={HOME_COLORS.headerText} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* HEADER & AVATAR (Coach Section) */}
          <View style={styles.coachSection}>
            <View style={styles.avatarContainer}>
              <AvatarCoach />
            </View>
            {/* Burbuja de texto blanca */}
            <View style={styles.greetingBubble}>
              <Text style={styles.greetingText}>{dynamicTip}</Text>
              <View style={styles.bubbleTriangle} />
            </View>
          </View>

          {/* RUTINA */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tu Rutina de Hoy</Text>
            {/* Subtítulo en amarillo/mostaza para resaltar */}
            <Text style={styles.sectionSubtitle}>{diaActualRutina.charAt(0).toUpperCase() + diaActualRutina.slice(1)}</Text>

            {isLoadingData ? (
              // Spinner amarillo
              <ActivityIndicator size="large" color={HOME_COLORS.accent} style={{marginTop: 20}} />
            ) : rutinaHoy.length > 0 ? (
              rutinaHoy.map((ejercicio, index) => (
                <View key={index} style={styles.workoutCard}>
                  <TouchableOpacity onPress={() => openVideo(ejercicio.video)} disabled={!ejercicio.video} activeOpacity={0.7}>
                    {renderAsset(ejercicio)}
                    {ejercicio.video && (
                      <View style={styles.playIconOverlay}>
                         <Icon name="play-circle" size={30} color={HOME_COLORS.cardBg} style={{ opacity: 0.9 }} />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={styles.workoutTextContainer}>
                    <Text style={styles.workoutName}>{ejercicio.nombre}</Text>
                    <Text style={styles.workoutReps}>{ejercicio.repeticiones}</Text>
                    {ejercicio.video && (
                      <TouchableOpacity style={styles.verVideoBtnCompact} onPress={() => openVideo(ejercicio.video)}>
                        <Text style={styles.verVideoTextCompact}>Ver video</Text>
                        <Icon name="arrow-right" size={14} color={HOME_COLORS.cardBg} style={{marginLeft: 4}}/>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                 <Icon name="bed" size={40} color={HOME_COLORS.accent} style={{opacity: 0.7}} />
                 <Text style={styles.emptyStateText}>Hoy es día de descanso. ¡Recupérate!</Text>
              </View>
            )}
          </View>

          {/* DIETA */}
          <View style={styles.sectionContainer}>
            <View style={styles.dietHeaderContainer}>
              <View>
                 <Text style={styles.sectionTitle}>Plan de Alimentación</Text>
                 {/* Subtítulo en amarillo */}
                 <Text style={styles.sectionSubtitle}>{diaMostradoDieta.charAt(0).toUpperCase() + diaMostradoDieta.slice(1)}</Text>
              </View>
              <View style={styles.dietNavControls}>
                <TouchableOpacity onPress={() => cambiarDietaDia(-1)} style={styles.navButton}>
                  {/* Flechas en verde */}
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
                       {/* Icono de comida en verde */}
                       <Icon name="food-apple" size={20} color={HOME_COLORS.primary} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.mealName}>{comida.nombre}</Text>
                      <Text style={styles.mealDescription}>{comida.comida}</Text>
                    </View>
                    {/* Calorías individuales en amarillo */}
                    <Text style={styles.mealCalories}>{comida.calorias} kcal</Text>
                  </View>
                ))}
                 <View style={styles.totalCaloriesContainer}>
                    <Text style={styles.totalCaloriesLabel}>Total Diario:</Text>
                    {/* Calorías totales en amarillo grande */}
                    <Text style={styles.totalCaloriesValue}>{totalCalorias} kcal</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                 <Icon name="food-off" size={40} color={HOME_COLORS.accent} style={{opacity: 0.7}} />
                 <Text style={styles.emptyStateText}>No hay dieta programada para este día.</Text>
              </View>
            )}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>

      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />
      )}

      {menuOpen && (
        <View style={styles.menuDropdown}>
          {renderMenuItem("👤", "Mi Avatar", () => navigation.navigate('Avatar'), HOME_COLORS.primary)}
          {renderMenuItem("📅", "Recetas", () => navigation.navigate('CalendarRecipes'), HOME_COLORS.secondary)}
          {/* Scanner usa el amarillo de acento */}
          {renderMenuItem("📷", "Scanner", () => navigation.navigate('Scanner'), HOME_COLORS.accent)}
          {renderMenuItem("💬", "Coach IA", () => {
             if (!isSubscribed) { Alert.alert("Suscripción Requerida", "Necesitas Premium para el Coach IA."); return; }
             navigation.navigate('AvatarChat');
          }, '#42A5F5')}
          <View style={styles.menuDivider} />
          {renderMenuItem("ℹ️", "Quiénes Somos", () => navigation.navigate('AboutUs'), '#90A4AE')}
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
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: HOME_COLORS.background, // Fondo claro
    position: 'relative',
  },
  safeAreaContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // --- BARRA SUPERIOR VERDE ---
  topHeaderBar: {
    backgroundColor: HOME_COLORS.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Sombra más suave
    shadowRadius: 4,
    zIndex: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: HOME_COLORS.headerText, // Texto blanco
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  staticMenuButton: {
    position: 'absolute',
    right: 20,
    padding: 8,
    // Fondo ligeramente transparente para el botón sobre el verde
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },

  // --- SECCIÓN DEL COACH ---
  coachSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 20,
  },
  avatarContainer: { marginRight: 15 },
  greetingBubble: {
    flex: 1,
    backgroundColor: HOME_COLORS.cardBg, // Burbuja blanca
    padding: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    elevation: 1, // Sombra muy sutil
    shadowColor: HOME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  greetingText: { color: HOME_COLORS.textDark, fontSize: 15, lineHeight: 20, fontStyle: 'italic' },
  bubbleTriangle: {
    position: 'absolute', bottom: -8, left: 0, width: 0, height: 0,
    borderStyle: 'solid', borderTopWidth: 8, borderRightWidth: 10, borderBottomWidth: 0, borderLeftWidth: 0,
    // Triángulo blanco para coincidir con la burbuja
    borderTopColor: HOME_COLORS.cardBg, borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent',
  },

  // --- SECCIONES GENERALES ---
  sectionContainer: { marginBottom: 35 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: HOME_COLORS.textDark, marginBottom: 2, letterSpacing: 0.5 },
  // Subtítulos en amarillo/mostaza
  sectionSubtitle: { fontSize: 14, color: HOME_COLORS.accent, fontWeight: '700', marginBottom: 15, textTransform: 'capitalize' },

  // --- TARJETAS DE RUTINA (Blancas) ---
  workoutCard: {
    flexDirection: 'row', backgroundColor: HOME_COLORS.cardBg, borderRadius: 16, padding: 12, marginBottom: 12, alignItems: 'center',
    elevation: 2, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4,
    borderWidth: 1, borderColor: '#F0F0F0', // Borde sutil para definición
  },
  mediaAsset: { width: 80, height: 80, borderRadius: 12, marginRight: 15 },
  playIconOverlay: { position: 'absolute', top: 0, left: 0, right: 15, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12 },
  workoutTextContainer: { flex: 1, justifyContent: 'center' },
  workoutName: { fontSize: 16, fontWeight: '700', color: HOME_COLORS.textDark, marginBottom: 4 },
  workoutReps: { fontSize: 14, color: HOME_COLORS.textMedium, marginBottom: 8 },
  // Botón Ver Video (Verde con texto blanco)
  verVideoBtnCompact: { flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.verVideoBtn, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignSelf: 'flex-start' },
  verVideoTextCompact: { fontSize: 12, color: HOME_COLORS.cardBg, fontWeight: 'bold' }, // Texto blanco

  // --- DIETA (Contenedor Blanco) ---
  dietHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  dietNavControls: { flexDirection: 'row', backgroundColor: HOME_COLORS.cardBg, borderRadius: 25, padding: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  navButton: { padding: 6 },
  dietListContainer: { backgroundColor: HOME_COLORS.cardBg, borderRadius: 18, padding: 15, marginTop: 10, elevation: 2, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  dietMealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.cardBgLighter, borderRadius: 12, padding: 12, marginBottom: 10 },
  dietMealIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(92, 184, 92, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mealName: { fontSize: 15, fontWeight: '700', color: HOME_COLORS.textDark },
  mealDescription: { fontSize: 13, color: HOME_COLORS.textMedium, marginTop: 2 },
  // Calorías en amarillo
  mealCalories: { fontSize: 14, fontWeight: '700', color: HOME_COLORS.accent },
  totalCaloriesContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  totalCaloriesLabel: { fontSize: 16, color: HOME_COLORS.textMedium },
  totalCaloriesValue: { fontSize: 20, fontWeight: '800', color: HOME_COLORS.accent },

  // --- ESTADOS VACÍOS ---
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: HOME_COLORS.cardBg, borderRadius: 16, marginTop: 10, borderStyle: 'dashed', borderWidth: 2, borderColor: '#E0E0E0' },
  emptyStateText: { color: HOME_COLORS.textLight, fontSize: 15, marginTop: 10, textAlign: 'center', fontWeight: '500' },

  // --- MODAL ---
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: HOME_COLORS.cardBg, padding: 15, borderRadius: 20, alignItems: 'center', elevation: 10 },
  closeButton: { marginTop: 20, padding: 12, backgroundColor: HOME_COLORS.fabRed, borderRadius: 12, width: '100%', alignItems: 'center' },
  closeButtonText: { color: HOME_COLORS.cardBg, fontWeight: 'bold', fontSize: 16 },

  // --- MENÚ DESPLEGABLE (Blanco) ---
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 15,
  },
  menuDropdown: {
    position: 'absolute',
    top: 70,
    right: 10,
    width: 220,
    backgroundColor: HOME_COLORS.menuBg, // Menú blanco
    borderRadius: 16,
    paddingVertical: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
  menuIconEmoji: { fontSize: 18, color: HOME_COLORS.cardBg }, // Iconos blancos sobre fondo de color
  menuLabelText: {
    fontSize: 15,
    fontWeight: '600',
    color: HOME_COLORS.textDark, // Texto oscuro
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEEEEE', // Divisor claro
    marginVertical: 5,
    marginHorizontal: 16,
  },
});