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

// Importamos los contextos correctos
import { useUserData } from './UserDataContext';
import { useSubscription } from './SubscriptionContext';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// --- NUEVA PALETA DE COLORES PARA HOME (FITA Oscura con Amarillo Mostaza de acento) ---
const HOME_COLORS = {
  background: '#1A332B',      // Verde muy oscuro, casi negro (base del aguacate)
  primary: '#5CB85C',         // Verde aguacate vibrante (similar al logo)
  secondary: '#8BC34A',       // Verde más claro (pulpa de aguacate más brillante)
  
  accent: '#EBA83A',          // ¡AMARILLO MOSTAZA! Ahora más específico
  
  textDark: '#FFFFFF',        // Blanco puro para el texto principal
  textMedium: '#E0E0E0',      // Gris muy claro para descripciones
  textLight: '#A0A0A0',       // Gris medio para placeholders o texto sutil
  cardBg: '#2E473D',          // Verde grisáceo oscuro para el fondo de las tarjetas
  cardBorder: '#4CAF50',      // Un verde más definido para bordes (opcional, para pop)
  shadowColor: 'rgba(0, 0, 0, 0.5)', // Sombra más pronunciada
  
  // Colores para el FAB Menu (Armonizados con FITA oscuro, FAB Orange ajustado)
  fabRed: '#D32F2F',          // Rojo oscuro
  fabPurple: '#673AB7',       // Púrpura oscuro
  fabOrange: '#EBA83A',       // ¡AMARILLO MOSTAZA! para el botón del Scanner
  fabBlue: '#1976D2',         // Azul oscuro
  fabTeal: '#00796B',         // Verde azulado oscuro

  verVideoBtn: '#4CAF50',     // Verde aguacate para el botón "Ver video" (resalta bien)
};

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dynamicTip, setDynamicTip] = useState("¡Vamos a entrenar!");

  const [dietaDiaIndex, setDietaDiaIndex] = useState(new Date().getDay());
  const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  const {
    rutinas,
    dietas,
    isLoadingData
  } = useUserData();

  const { isSubscribed, activateSubscription } = useSubscription();

  useEffect(() => {
    setDynamicTip(getDynamicTip());
  }, []);

  const cambiarDietaDia = (delta) => {
    setDietaDiaIndex((prevIndex) => {
      let newIndex = prevIndex + delta;
      if (newIndex < 0) {
        newIndex = diasSemana.length - 1;
      } else if (newIndex >= diasSemana.length) {
        newIndex = 0;
      }
      return newIndex;
    });
  };

  const getDynamicTip = () => {
    const hour = new Date().getHours();
    const morningTips = [
      "¡Buen día! Un desayuno alto en proteína es clave.",
      "Recuerda calentar bien antes de tu rutina de hoy.",
      "La consistencia gana a la intensidad. ¡Vamos por ello!",
      "¡A empezar el día con energía! ¿Listo/a para hoy?",
      "No olvides tu botella de agua. La hidratación es primero."
    ];
    const afternoonTips = [
      "¡Buenas tardes! ¿Listo/a para la rutina de hoy?",
      "No olvides hidratarte bien durante la tarde.",
      "Un snack saludable ahora te dará energía para el entreno.",
      "¡Vamos a entrenar! Termina el día con fuerza.",
      "Revisa tu postura. Un pequeño ajuste hace una gran diferencia."
    ];
    const eveningTips = [
      "¡Buenas noches! ¿Completaste tu rutina de hoy?",
      "Una cena ligera y proteica ayuda a la recuperación muscular.",
      "Recuerda estirar 10 minutos antes de dormir. Tu cuerpo lo agradecerá.",
      "El descanso es parte del entrenamiento. ¡A dormir bien!",
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
        <View style={[styles.mediaAsset, { backgroundColor: HOME_COLORS.textLight, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: HOME_COLORS.textDark, fontSize: 12 }}>Sin Media</Text>
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={styles.contenedorPrincipal}> 
      <StatusBar backgroundColor={HOME_COLORS.background} barStyle="light-content" /> 
      
      <SafeAreaView style={styles.safeAreaContent}> 
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.padre}>

            <View style={styles.avatarCoachWrapper}>
              <AvatarCoach />
              <Text style={styles.avatarTexto}>{dynamicTip}</Text>
            </View>

            <Text style={styles.titulo}>Rutina de hoy ({diaActualRutina}):</Text>
            {isLoadingData ? (
              <ActivityIndicator size="large" color={HOME_COLORS.primary} />
            ) : rutinaHoy.length > 0 ? (
              rutinaHoy.map((ejercicio, index) => (
                <View key={index} style={styles.tarjeta}>
                  <TouchableOpacity onPress={() => openVideo(ejercicio.video)} disabled={!ejercicio.video}>
                    {renderAsset(ejercicio)}
                  </TouchableOpacity>
                  <View style={styles.textoContainer}>
                    <Text style={styles.nombre}>{ejercicio.nombre}</Text>
                    <Text style={styles.repeticiones}>{ejercicio.repeticiones}</Text>
                    {ejercicio.video && (
                      <TouchableOpacity style={styles.verVideoBoton} onPress={() => openVideo(ejercicio.video)}>
                        <Text style={styles.verVideoTexto}>📺 Ver video</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noRutina}>Hoy es día de descanso <Text>😴</Text></Text> 
            )}

            <View style={styles.dietaSectionContainer}>
              <View style={styles.dietaHeader}>
                <TouchableOpacity onPress={() => cambiarDietaDia(-1)} style={styles.navButton}>
                  <Icon name="arrow-left-circle" size={30} color={HOME_COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.tituloDieta}>Dieta del día ({diaMostradoDieta}):</Text>
                <TouchableOpacity onPress={() => cambiarDietaDia(1)} style={styles.navButton}>
                  <Icon name="arrow-right-circle" size={30} color={HOME_COLORS.primary} />
                </TouchableOpacity>
              </View>

              {isLoadingData ? (
                // ActivityIndicator con el color accent (amarillo mostaza)
                <ActivityIndicator size="small" color={HOME_COLORS.accent} />
              ) : dietaHoy.length > 0 ? (
                dietaHoy.map((comida, index) => (
                  <View key={index} style={styles.tarjetaDieta}>
                    <Text style={styles.nombreDieta}>{comida.nombre}</Text>
                    <Text style={styles.comida}>{comida.comida}</Text>
                    <Text style={styles.calorias}>Calorías: {comida.calorias} kcal</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noRutina}>Hoy no hay dieta programada <Text>🍎</Text></Text> 
              )}
              {/* Total Calorías con el color accent (amarillo mostaza) */}
              {!isLoadingData && <Text style={styles.totalCalorias}>Total del día: {totalCalorias} kcal</Text>}
            </View>

            <View style={{ height: 100 }} />
          </View>
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
        <View style={styles.fabOptionsContainer}>
          {/* Opción Cerrar Sesión */}
          <View style={styles.fabOptionRow}>
            <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Cerrar Sesión</Text></View>
            <TouchableOpacity style={[styles.fabSmall, { backgroundColor: HOME_COLORS.fabRed }]} onPress={cerrarSesion}>
              <Text style={styles.fabIcon}>🚪</Text> 
            </TouchableOpacity>
          </View>

          {/* Opción Recetas */}
          <View style={styles.fabOptionRow}>
            <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Recetas</Text></View>
            <TouchableOpacity style={[styles.fabSmall, { backgroundColor: HOME_COLORS.fabPurple }]} onPress={() => navigation.navigate('CalendarRecipes')}>
              <Text style={styles.fabIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* Opción Scanner - Ahora con el color amarillo mostaza */}
          <View style={styles.fabOptionRow}>
            <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Scanner</Text></View>
            <TouchableOpacity style={[styles.fabSmall, { backgroundColor: HOME_COLORS.fabOrange }]} onPress={() => navigation.navigate('Scanner')}>
              <Text style={styles.fabIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          {/* Opción Coach IA */}
          <View style={styles.fabOptionRow}>
            <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Coach IA</Text></View>
            <TouchableOpacity style={[styles.fabSmall, { backgroundColor: HOME_COLORS.fabBlue }]} onPress={() => {
              if (!isSubscribed) {
                return Alert.alert(
                  "Suscripción requerida",
                  "Necesitas una suscripción activa para acceder al Coach IA.",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Suscribirme",
                      onPress: () => navigation.navigate('Suscripcion')
                    },
                    {
                      text: "🔓 ACTIVAR YA (DEV)",
                      onPress: async () => {
                        await activateSubscription();
                        Alert.alert("Éxito", "Modo Premium activado para desarrollo.");
                        navigation.navigate('AvatarChat');
                      },
                      style: "default"
                    }
                  ]
                );
              }
              navigation.navigate('AvatarChat');
            }}>
              <Text style={styles.fabIcon}>💬</Text>
            </TouchableOpacity>
          </View>

          {/* Opción Avatar */}
          <View style={styles.fabOptionRow}>
            <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Avatar</Text></View>
            <TouchableOpacity style={[styles.fabSmall, { backgroundColor: HOME_COLORS.fabTeal }]} onPress={() => navigation.navigate('Avatar')}>
              <Text style={styles.fabIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.fabMain} onPress={toggleMenu} activeOpacity={0.8}>
        <Text style={styles.fabMainText}>{menuOpen ? '✖' : '☰'}</Text>
      </TouchableOpacity>

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
    backgroundColor: HOME_COLORS.background,
  },
  safeAreaContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },

  padre: {
    alignItems: 'center',
  },
  avatarCoachWrapper: {
    backgroundColor: HOME_COLORS.cardBg,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 25,
    width: '100%',
    alignItems: 'center',
    elevation: 6,
    shadowColor: HOME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatarTexto: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: HOME_COLORS.textDark,
    textAlign: 'center',
    paddingHorizontal: 10
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    alignSelf: 'flex-start',
    color: HOME_COLORS.textDark,
  },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: HOME_COLORS.cardBg,
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    width: '100%',
    elevation: 4,
    shadowColor: HOME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    borderWidth: 0,
  },
  mediaAsset: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: HOME_COLORS.textLight,
  },
  textoContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
    color: HOME_COLORS.textDark,
  },
  repeticiones: {
    fontSize: 15,
    color: HOME_COLORS.textMedium,
    marginTop: 5,
  },
  verVideoBoton: {
    backgroundColor: HOME_COLORS.verVideoBtn,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  verVideoTexto: {
    fontSize: 13,
    color: HOME_COLORS.textDark,
    fontWeight: 'bold'
  },
  noRutina: {
    fontSize: 18,
    color: HOME_COLORS.textMedium,
    fontStyle: 'italic',
    marginVertical: 20
  },

  dietaSectionContainer: {
    backgroundColor: HOME_COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    marginTop: 30,
    width: '100%',
    elevation: 6,
    shadowColor: HOME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dietaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  navButton: {
    padding: 5,
  },
  tituloDieta: {
    fontSize: 22,
    fontWeight: 'bold',
    color: HOME_COLORS.textDark,
    flexShrink: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  tarjetaDieta: {
    backgroundColor: HOME_COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 0,
  },
  nombreDieta: {
    fontSize: 17,
    fontWeight: 'bold',
    color: HOME_COLORS.textDark,
    marginBottom: 4,
  },
  comida: {
    fontSize: 15,
    color: HOME_COLORS.textMedium,
  },
  calorias: {
    fontSize: 14,
    color: HOME_COLORS.secondary,
    marginTop: 6,
    fontWeight: 'bold',
  },
  totalCalorias: {
    fontSize: 18,
    fontWeight: 'bold',
    color: HOME_COLORS.accent, // ¡Amarillo mostaza para total calorías!
    marginTop: 20,
    textAlign: 'center'
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: HOME_COLORS.cardBg,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: HOME_COLORS.fabRed,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: HOME_COLORS.cardBg,
    fontWeight: 'bold',
    fontSize: 16,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  fabMain: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: HOME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: HOME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 10,
  },
  fabMainText: {
    color: HOME_COLORS.textDark,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2
  },
  fabOptionsContainer: {
    position: 'absolute',
    top: 100,
    right: 30,
    alignItems: 'flex-end',
    zIndex: 9,
  },
  fabOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fabSmall: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginLeft: 10,
  },
  fabIcon: {
    fontSize: 20,
  },
  fabLabel: {
    backgroundColor: HOME_COLORS.cardBg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: HOME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: HOME_COLORS.textDark,
  }
});