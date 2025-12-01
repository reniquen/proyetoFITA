import {
    Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, Modal,
    SafeAreaView, Alert, Dimensions, ActivityIndicator, StatusBar, BackHandler
  } from 'react-native';
  import { useFocusEffect } from '@react-navigation/native';
  import React, { useState, useCallback, useEffect } from 'react';
  import YoutubePlayer from 'react-native-youtube-iframe';
  import { auth } from './firebaseConfig';
  import { signOut } from 'firebase/auth';
  import AvatarCoach from './AvatarCoach';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  
  import { useUserData } from './UserDataContext';
  import { useSubscription } from './SubscriptionContext';
  
  function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  // --- PALETA "VIBRANT FITA" ---
  const HOME_COLORS = {
    background: '#F2F5ED',
    headerBg: '#4CAF50',
    headerText: '#FFFFFF',
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#FFC107',
    accentSoft: '#FFF8E1',
    coachMasterCardBg: '#F1F8E9',
    coachCardBorder: '#C8E6C9',
    superCardHeaderBg: '#4CAF50',
    superCardBodyBg: '#F9FBF7',
    innerCardBg: '#FFFFFF',
    textDark: '#263238',
    textMedium: '#546E7A',
    textLight: '#B0BEC5',
    textInverse: '#FFFFFF',
    coachBubbleBorder: '#FFC107',
    shadowColor: '#263238',
    menuBg: '#FFFFFF',
    fabRed: '#E53935',
    successDark: '#2E7D32',
  };
  
  export default function Home({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dynamicTip, setDynamicTip] = useState("¡Vamos a entrenar!");
  
    // --- ESTADOS PARA NAVEGACIÓN DE DÍAS ---
    const [rutinaDiaIndex, setRutinaDiaIndex] = useState(new Date().getDay());
    const [dietaDiaIndex, setDietaDiaIndex] = useState(new Date().getDay());
  
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  
    // --- CONTEXTO ---
    const { rutinas, dietas, isLoadingData } = useUserData();
    const { isSubscribed } = useSubscription();
  
    // --- BLOQUE DE SEGURIDAD DE CARGA ---
    if (isLoadingData) {
      return (
        <View style={[styles.contenedorPrincipal, { justifyContent: 'center', alignItems: 'center' }]}>
          <StatusBar backgroundColor={HOME_COLORS.headerBg} barStyle="light-content" />
          <ActivityIndicator size="large" color={HOME_COLORS.accent} />
          <Text style={{ marginTop: 15, color: HOME_COLORS.textMedium, fontSize: 16, fontWeight: '600' }}>
            Preparando tu plan personalizado...
          </Text>
        </View>
      );
    }
  
    useEffect(() => { setDynamicTip(getDynamicTip()); }, []);
  
    useFocusEffect(
      React.useCallback(() => {
        const handleBackPress = () => {
          if (menuOpen) {
            setMenuOpen(false);
            return true;
          }
          handleLogout();
          return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
      }, [menuOpen])
    );
  
    // --- LÓGICA PARA CAMBIAR DÍAS ---
    const cambiarDietaDia = (delta) => {
      setDietaDiaIndex((prevIndex) => {
        let newIndex = prevIndex + delta;
        if (newIndex < 0) newIndex = diasSemana.length - 1;
        else if (newIndex >= diasSemana.length) newIndex = 0;
        return newIndex;
      });
    };
  
    const cambiarRutinaDia = (delta) => {
      setRutinaDiaIndex((prevIndex) => {
        let newIndex = prevIndex + delta;
        if (newIndex < 0) newIndex = diasSemana.length - 1;
        else if (newIndex >= diasSemana.length) newIndex = 0;
        return newIndex;
      });
    };
  
    const confirmarRutinaCompletada = () => {
      Alert.alert(
        "¡Excelente trabajo! 💪",
        `Has completado tu rutina del ${diasSemana[rutinaDiaIndex]}. ¡Sigue así!`,
        [{ text: "¡Gracias!", onPress: () => console.log("Rutina completada") }]
      );
    };
  
    const getDynamicTip = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "¡Buen día! Un desayuno alto en proteína es clave.";
      if (hour < 19) return "¡Vamos a entrenar! Termina el día con fuerza.";
      return "El descanso es parte fundamental del progreso.";
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
  
    // ==================================================================
    // 🔥 EXTRACCIÓN DE DATOS 🔥
    // ==================================================================
    
    // CORRECCIÓN LÓGICA: Usar rutinaDiaIndex (estado) en lugar de new Date().getDay()
    // para que al pulsar las flechas, cambien los datos.
    const diaMostradoRutina = diasSemana[rutinaDiaIndex];
    const datosRutinaDia = rutinas ? rutinas[diaMostradoRutina] : null;
    const rutinaHoy = datosRutinaDia ? datosRutinaDia.ejercicios : [];
    const enfoqueHoy = datosRutinaDia ? datosRutinaDia.enfoque : '';
  
    const diaMostradoDieta = diasSemana[dietaDiaIndex];
    const datosDietaDia = dietas ? dietas[diaMostradoDieta] : null;
    const dietaHoy = datosDietaDia ? datosDietaDia.comidas : [];
  
    const totalCalorias = dietaHoy.reduce((total, comida) => total + (comida.calorias || 0), 0);
    // ==================================================================
  
  
    const handleLogout = () => {
      Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, Salir", onPress: () => signOut(auth).then(() => navigation.replace('Login')) }
      ]);
    };
  
    const renderAsset = (ejercicio) => {
      if (ejercicio.imagen) {
        return <Image source={ejercicio.imagen} style={styles.mediaAsset} resizeMode="cover" />;
      }
      return (
        <View style={[styles.mediaAsset, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: HOME_COLORS.textMedium, fontSize: 10 }}>Sin Imagen</Text>
        </View>
      );
    };
  
    const toggleMenu = () => { setMenuOpen(!menuOpen); };
  
    const renderMenuItem = (iconName, label, onPress, iconColor) => (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={[styles.menuIconContainer, { backgroundColor: iconColor || HOME_COLORS.accent }]}>
          <Icon name={iconName} size={20} color={HOME_COLORS.textInverse} />
        </View>
        <Text style={styles.menuLabelText}>{label}</Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.contenedorPrincipal}>
        <StatusBar backgroundColor={HOME_COLORS.headerBg} barStyle="light-content" />
        <SafeAreaView style={styles.safeAreaContent}>
          <View style={styles.topHeaderBar}>
            <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            <TouchableOpacity style={styles.staticMenuButton} onPress={toggleMenu} activeOpacity={0.6}>
              <Icon name={menuOpen ? "close" : "menu"} size={28} color={HOME_COLORS.headerText} />
            </TouchableOpacity>
          </View>
  
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* COACH CARD */}
            <View style={styles.coachMasterCard}>
              <View style={styles.coachSectionContainerInner}>
                <View style={styles.avatarWrapper}><AvatarCoach /></View>
                <View style={styles.speechBubbleWrapper}>
                  <View style={styles.speechBubbleTailTop} />
                  <View style={styles.speechBubbleBodyCentered}>
                    <Text style={styles.greetingTextCentered}>“{dynamicTip}”</Text>
                  </View>
                </View>
              </View>
            </View>
  
            {/* === RUTINA CARD === */}
            <View style={styles.superCardContainer}>
              {/* Header con Navegación (Flechas) */}
              <View style={styles.superCardHeaderDiet}>
                <TouchableOpacity onPress={() => cambiarRutinaDia(-1)} style={styles.navButtonHeader}>
                  <Icon name="chevron-left" size={32} color={HOME_COLORS.textInverse} />
                </TouchableOpacity>
  
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="dumbbell" size={24} color={HOME_COLORS.textInverse} style={{ marginRight: 10 }} />
                  <Text style={styles.superCardTitle}>Plan de Ejercicios</Text>
                </View>
  
                <TouchableOpacity onPress={() => cambiarRutinaDia(1)} style={styles.navButtonHeader}>
                  <Icon name="chevron-right" size={32} color={HOME_COLORS.textInverse} />
                </TouchableOpacity>
              </View>
  
              <View style={styles.superCardContent}>
                {/* Título del día centrado */}
                <View style={styles.subtitleWrapperCentered}>
                  <Text style={styles.sectionSubtitle}>{diasSemana[rutinaDiaIndex].toUpperCase()}</Text>
                  {enfoqueHoy ? <Text style={styles.enfoqueText}>{enfoqueHoy}</Text> : null}
                  <View style={styles.subtitleUnderlineCentered} />
                </View>
  
                {rutinaHoy.length > 0 ? (
                  <>
                    {rutinaHoy.map((ejercicio, index) => (
                      <View key={index} style={styles.workoutCardInner}>
                        <View style={styles.cardAccentBar} />
                        <TouchableOpacity onPress={() => openVideo(ejercicio.video)} disabled={!ejercicio.video} activeOpacity={0.9} style={styles.mediaContainer}>
                          {renderAsset(ejercicio)}
                          {ejercicio.video && (
                            <View style={styles.playIconOverlay}>
                              <Icon name="play-circle" size={32} color={HOME_COLORS.accent} />
                            </View>
                          )}
                        </TouchableOpacity>
  
                        <View style={styles.workoutTextContainer}>
                          <Text style={styles.workoutName}>{ejercicio.nombre}</Text>
                          <Text style={styles.workoutReps}>
                            {ejercicio.sets} {ejercicio.sets > 1 ? 'Series' : 'Serie'} de {ejercicio.repeticiones} Reps
                          </Text>
                        </View>
                      </View>
                    ))}
  
                    <TouchableOpacity
                      style={styles.completeRoutineButton}
                      onPress={confirmarRutinaCompletada}
                      activeOpacity={0.8}
                    >
                      <Icon name="check-circle" size={24} color={HOME_COLORS.textInverse} style={{ marginRight: 8 }} />
                      <Text style={styles.completeRoutineText}>¡Rutina Completada!</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Icon name="bed" size={40} color={HOME_COLORS.accent} style={{ opacity: 0.8 }} />
                    <Text style={styles.emptyStateText}>Hoy es día de descanso. ¡Recupérate!</Text>
                  </View>
                )}
              </View>
            </View>
  
            {/* === DIETA CARD === */}
            <View style={styles.superCardContainer}>
              <View style={styles.superCardHeaderDiet}>
                <TouchableOpacity onPress={() => cambiarDietaDia(-1)} style={styles.navButtonHeader}>
                  <Icon name="chevron-left" size={32} color={HOME_COLORS.textInverse} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="food-apple" size={24} color={HOME_COLORS.textInverse} style={{ marginRight: 10 }} />
                  <Text style={styles.superCardTitle}>Plan de Alimentación</Text>
                </View>

                <TouchableOpacity onPress={() => cambiarDietaDia(1)} style={styles.navButtonHeader}>
                  <Icon name="chevron-right" size={32} color={HOME_COLORS.textInverse} />
                </TouchableOpacity>
              </View>
  
              <View style={styles.superCardContent}>
                <View style={styles.subtitleWrapperCentered}>
                  <Text style={styles.sectionSubtitle}>{diaMostradoDieta.toUpperCase()}</Text>
                  <View style={styles.subtitleUnderlineCentered} />
                </View>
  
                {dietaHoy.length > 0 ? (
                  <>
                    <View style={styles.dietListContainer}>
                      {dietaHoy.map((comida, index) => (
                        <View key={index} style={styles.dietMealCardInner}>
                          <View style={styles.dietMealIcon}>
                            <Icon name="silverware-fork-knife" size={18} color={HOME_COLORS.innerCardBg} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.mealName}>{comida.nombre}</Text>
                            <Text style={styles.mealDescription}>{comida.comida}</Text>
                          </View>
                          <View style={styles.caloriesBadge}>
                            <Text style={styles.mealCalories}>{comida.calorias} kcal</Text>
                          </View>
                        </View>
                      ))}
                    </View>

                    <View style={styles.totalCaloriesHighlightCardInner}>
                      <View style={styles.totalCaloriesIconBubble}>
                        <Icon name="fire" size={24} color={HOME_COLORS.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.totalCaloriesLabelLight}>Total Diario Objetivo</Text>
                      </View>
                      <Text style={styles.totalCaloriesValueLight}>{totalCalorias} kcal</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Icon name="food-off" size={40} color={HOME_COLORS.accent} style={{ opacity: 0.8 }} />
                    <Text style={styles.emptyStateText}>No hay dieta programada para este día. (Pronto disponible)</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ height: 50 }} />
          </ScrollView>
        </SafeAreaView>
  
        {menuOpen && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenuOpen(false)} />}
        {menuOpen && (
          <View style={styles.menuDropdown}>
            {renderMenuItem("account-circle-outline", "Mi Avatar", () => navigation.navigate('Avatar'), HOME_COLORS.primary)}
            {renderMenuItem("calendar-month-outline", "Calendario", () => navigation.navigate('CalendarRecipes'), HOME_COLORS.secondary)}
            {renderMenuItem("barcode-scan", "Scanner", () => navigation.navigate('Scanner'), HOME_COLORS.accent)}
            {renderMenuItem("shoe-print", "Contador", () => navigation.navigate('ContadorPasos'), HOME_COLORS.accent)}
            {renderMenuItem("shoe-print", "Premium", () => navigation.navigate('Suscripcion'), HOME_COLORS.accent)}
            {renderMenuItem("chat-processing-outline", "Coach IA", () => {
              if (!isSubscribed) { Alert.alert("Suscripción Requerida", "Necesitas Premium para el Coach IA."); return; }
              navigation.navigate('AvatarChat');
            }, '#42A5F5')}
            <View style={styles.menuDivider} />
            {renderMenuItem("information-outline", "Terminos y condiciones", () => navigation.navigate('TerminosCondiciones'), '#90A4AE')}
            {renderMenuItem("logout-variant", "Cerrar Sesión", handleLogout, HOME_COLORS.fabRed)}
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
    contenedorPrincipal: { flex: 1, backgroundColor: HOME_COLORS.background, position: 'relative' },
    safeAreaContent: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
    topHeaderBar: {
      backgroundColor: HOME_COLORS.headerBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      paddingVertical: 15, paddingHorizontal: 20, elevation: 8, shadowColor: HOME_COLORS.shadowColor,
      shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, zIndex: 10,
    },
    welcomeText: { fontSize: 24, fontWeight: 'bold', color: HOME_COLORS.headerText, letterSpacing: 0.5, textAlign: 'center' },
    staticMenuButton: { position: 'absolute', right: 20, padding: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8 },
    coachMasterCard: {
      backgroundColor: HOME_COLORS.coachMasterCardBg, borderRadius: 24, paddingVertical: 25, paddingHorizontal: 15,
      marginBottom: 35, marginTop: 25, borderWidth: 1, borderColor: HOME_COLORS.coachCardBorder,
      elevation: 3, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5,
    },
    coachSectionContainerInner: { flexDirection: 'column', alignItems: 'center' },
    avatarWrapper: { marginBottom: 10 },
    speechBubbleWrapper: { flexDirection: 'column', alignItems: 'center', width: '95%' },
    speechBubbleBodyCentered: {
      backgroundColor: HOME_COLORS.innerCardBg, padding: 18, borderRadius: 22, borderWidth: 2, borderColor: HOME_COLORS.coachBubbleBorder,
      alignItems: 'center', elevation: 4, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5,
    },
    speechBubbleTailTop: {
      width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 18,
      borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: HOME_COLORS.coachBubbleBorder, marginBottom: -3, zIndex: 1,
    },
    greetingTextCentered: { color: HOME_COLORS.textDark, fontSize: 17, lineHeight: 24, fontStyle: 'italic', fontWeight: '600', textAlign: 'center' },
    superCardContainer: {
      backgroundColor: HOME_COLORS.superCardBodyBg, borderRadius: 24, marginBottom: 35, overflow: 'hidden',
      elevation: 8, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10,
    },
    superCardHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: HOME_COLORS.superCardHeaderBg, paddingVertical: 18, paddingHorizontal: 20,
    },
    superCardHeaderDiet: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: HOME_COLORS.superCardHeaderBg, paddingVertical: 15, paddingHorizontal: 15,
    },
    superCardTitle: { fontSize: 20, fontWeight: '900', color: HOME_COLORS.textInverse, letterSpacing: 0.5 },
    superCardContent: { padding: 20 },
    navButtonHeader: { padding: 4 },
    subtitleWrapperCentered: { flexDirection: 'column', alignItems: 'center', marginBottom: 20 },
    sectionSubtitle: { fontSize: 16, color: HOME_COLORS.accent, fontWeight: '700', textTransform: 'capitalize' },
    enfoqueText: { fontSize: 14, color: HOME_COLORS.textMedium, fontStyle: 'italic', marginTop: 4 },
    subtitleUnderlineCentered: { height: 3, width: 50, backgroundColor: HOME_COLORS.accent, marginTop: 5, borderRadius: 2 },
    workoutCardInner: {
      flexDirection: 'row', backgroundColor: HOME_COLORS.innerCardBg, borderRadius: 16, marginBottom: 12, alignItems: 'center', overflow: 'hidden',
      elevation: 2, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)'
    },
    cardAccentBar: { width: 6, height: '100%', backgroundColor: HOME_COLORS.primary },
    mediaContainer: { paddingVertical: 10, paddingLeft: 10 },
    mediaAsset: { width: 80, height: 80, borderRadius: 12, marginRight: 15, backgroundColor: '#f0f0f0' },
    playIconOverlay: { position: 'absolute', top: 10, left: 10, right: 15, bottom: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12 },
    workoutTextContainer: { flex: 1, justifyContent: 'center', paddingVertical: 10, paddingRight: 10 },
    workoutName: { fontSize: 16, fontWeight: '700', color: HOME_COLORS.textDark, marginBottom: 4 },
    workoutReps: { fontSize: 13, color: HOME_COLORS.textMedium, marginBottom: 8 },
    completeRoutineButton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: HOME_COLORS.successDark,
      paddingVertical: 14,
      borderRadius: 16,
      marginTop: 20,
      elevation: 4,
      shadowColor: HOME_COLORS.successDark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    completeRoutineText: {
      color: HOME_COLORS.textInverse,
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 0.5
    },
    verVideoBtnCompact: { flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.primary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignSelf: 'flex-start' },
    verVideoTextCompact: { fontSize: 11, color: HOME_COLORS.innerCardBg, fontWeight: 'bold' },
    dietListContainer: { marginTop: 5 },
    dietMealCardInner: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.innerCardBg, borderRadius: 14, padding: 12, marginBottom: 10,
      elevation: 2, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)'
    },
    dietMealIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: HOME_COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    mealName: { fontSize: 15, fontWeight: '700', color: HOME_COLORS.textDark },
    mealDescription: { fontSize: 12, color: HOME_COLORS.textMedium, marginTop: 2 },
    caloriesBadge: { backgroundColor: HOME_COLORS.accentSoft, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, borderWidth: 1, borderColor: HOME_COLORS.accent },
    mealCalories: { fontSize: 13, fontWeight: '700', color: HOME_COLORS.textDark },
    totalCaloriesHighlightCardInner: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: HOME_COLORS.primary, borderRadius: 18, padding: 18, marginTop: 15,
      elevation: 4, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5,
    },
    totalCaloriesIconBubble: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    totalCaloriesLabelLight: { fontSize: 15, color: HOME_COLORS.innerCardBg, fontWeight: '600', opacity: 0.9 },
    totalCaloriesValueLight: { fontSize: 22, fontWeight: '800', color: HOME_COLORS.accent },
    emptyStateContainer: { alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: HOME_COLORS.innerCardBg, borderRadius: 20, marginTop: 5, borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed' },
    emptyStateText: { color: HOME_COLORS.textMedium, fontSize: 15, marginTop: 10, textAlign: 'center', fontWeight: '500' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(38, 50, 56, 0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: HOME_COLORS.innerCardBg, padding: 15, borderRadius: 20, alignItems: 'center', elevation: 10, width: Dimensions.get('window').width * 0.9 },
    closeButton: { marginTop: 20, padding: 12, backgroundColor: HOME_COLORS.fabRed, borderRadius: 12, width: '100%', alignItems: 'center', elevation: 4 },
    closeButtonText: { color: HOME_COLORS.innerCardBg, fontWeight: 'bold', fontSize: 16 },
    overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(38, 50, 56, 0.5)', zIndex: 15 },
    menuDropdown: { position: 'absolute', top: 70, right: 10, width: 230, backgroundColor: HOME_COLORS.menuBg, borderRadius: 18, paddingVertical: 10, elevation: 12, shadowColor: HOME_COLORS.shadowColor, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, zIndex: 25 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
    menuIconContainer: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 14, elevation: 1 },
    menuLabelText: { fontSize: 15, fontWeight: '600', color: HOME_COLORS.textDark },
    menuDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 5, marginHorizontal: 16 },
  });