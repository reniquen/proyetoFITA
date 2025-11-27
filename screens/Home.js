import {
    Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, Modal,
    SafeAreaView, Alert, Dimensions, ActivityIndicator
  } from 'react-native';
  import React, { useState, useCallback, useEffect } from 'react';
  import YoutubePlayer from 'react-native-youtube-iframe';
  import { auth } from './firebaseConfig';
  import { signOut } from 'firebase/auth';
  import AvatarCoach from './AvatarCoach';
  import LottieView from 'lottie-react-native';
  
  // ✅ Importamos los contextos correctos
  import { useUserData } from './UserDataContext'; 
  import { useSubscription } from './SubscriptionContext'; // <--- AGREGADO
  
  function getYouTubeId(url) {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  }
  
  export default function Home({ navigation }) {
      const [modalVisible, setModalVisible] = useState(false);
      const [selectedVideoId, setSelectedVideoId] = useState(null);
      const [isPlaying, setIsPlaying] = useState(false);
      const [menuOpen, setMenuOpen] = useState(false);
      const [dynamicTip, setDynamicTip] = useState("¡Vamos a entrenar!");
  
      // ✅ Obtenemos datos del usuario (rutinas, dietas)
      const { 
          rutinas, 
          dietas, 
          isLoadingData 
      } = useUserData();
  
      // ✅ Obtenemos la suscripción del contexto correcto (SubscriptionContext)
      const { isSubscribed, activateSubscription } = useSubscription();
  
      useEffect(() => {
          setDynamicTip(getDynamicTip());
      }, []);
  
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
  
      const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
      const diaActual = diasSemana[new Date().getDay()];
      const rutinaHoy = rutinas[diaActual] || [];
  
      const cerrarSesion = () => {
          signOut(auth)
              .then(() => navigation.replace('Login'))
              .catch(() => Alert.alert('Error', 'No se pudo cerrar sesión.'));
      };
  
      const dietaHoy = (dietas && dietas[diaActual]) ? dietas[diaActual] : [];
      const totalCalorias = dietaHoy.reduce((total, comida) => total + (comida.calorias || 0), 0);
  
      const renderAsset = (ejercicio) => {
          if (!ejercicio.imagen) {
              return (
                  <View style={[styles.mediaAsset, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: '#666', fontSize: 12 }}>Sin Media</Text>
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
          <SafeAreaView style={styles.contenedorScroll}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                  <View style={styles.padre}>
                      <View style={styles.avatarContainer}>
                          <AvatarCoach />
                          <Text style={styles.avatarTexto}>{dynamicTip}</Text>
                      </View>
  
                      <Text style={styles.titulo}>Rutina de hoy ({diaActual}):</Text>
  
                      {isLoadingData ? (
                          <ActivityIndicator size="large" color="#3498db" />
                      ) : rutinaHoy.length > 0 ? (
                          rutinaHoy.map((ejercicio, index) => (
                              <View key={index} style={styles.tarjeta}>
                                  <TouchableOpacity onPress={() => openVideo(ejercicio.video)} disabled={!ejercicio.video}>
                                      {renderAsset(ejercicio)}
                                  </TouchableOpacity>
                                  <View style={styles.textoContainer}>
                                      <Text style={styles.nombre}>{ejercicio.nombre}</Text>
                                      <Text style={styles.repeticiones}>{ejercicio.repeticiones}</Text>
                                      {ejercicio.video && <Text style={styles.verVideo}>📺 Ver video</Text>}
                                  </View>
                              </View>
                          ))
                      ) : (
                          <Text style={styles.noRutina}>Hoy es día de descanso 😴</Text>
                      )}
  
                      <View style={styles.dietaContainer}>
                          <Text style={styles.titulo}>Dieta del día ({diaActual}):</Text>
  
                          {isLoadingData ? (
                              <ActivityIndicator size="small" color="#f39c12" />
                          ) : dietaHoy.length > 0 ? (
                              dietaHoy.map((comida, index) => (
                                  <View key={index} style={styles.tarjetaDieta}>
                                      <Text style={styles.nombre}>{comida.nombre}</Text>
                                      <Text style={styles.comida}>{comida.comida}</Text>
                                      <Text style={styles.calorias}>Calorías: {comida.calorias} kcal</Text>
                                  </View>
                              ))
                          ) : (
                              <Text style={styles.noRutina}>Hoy no hay dieta programada 🍎</Text>
                          )}
                          {!isLoadingData && <Text style={styles.totalCalorias}>Total del día: {totalCalorias} kcal</Text>}
                      </View>
  
                      <View style={{height: 100}} />
                  </View>
              </ScrollView>
  
              {menuOpen && (
                  <TouchableOpacity
                      style={styles.overlay}
                      activeOpacity={1}
                      onPress={() => setMenuOpen(false)}
                  />
              )}
  
              {menuOpen && (
                  <View style={styles.fabOptionsContainer}>
                      <View style={styles.fabOptionRow}>
                          <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Cerrar Sesión</Text></View>
                          <TouchableOpacity style={[styles.fabSmall, { backgroundColor: '#e74c3c' }]} onPress={cerrarSesion}>
                              <Text style={styles.fabIcon}>🚪</Text>
                          </TouchableOpacity>
                      </View>
  
                      <View style={styles.fabOptionRow}>
                          <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Recetas</Text></View>
                          <TouchableOpacity style={[styles.fabSmall, { backgroundColor: '#9b59b6' }]} onPress={() => navigation.navigate('CalendarRecipes')}>
                              <Text style={styles.fabIcon}>📅</Text>
                          </TouchableOpacity>
                      </View>
  
                      <View style={styles.fabOptionRow}>
                          <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Scanner</Text></View>
                          <TouchableOpacity style={[styles.fabSmall, { backgroundColor: '#f39c12' }]} onPress={() => navigation.navigate('Scanner')}>
                              <Text style={styles.fabIcon}>📷</Text>
                          </TouchableOpacity>
                      </View>
  
                      <View style={styles.fabOptionRow}>
                          <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Coach IA</Text></View>
                          <TouchableOpacity style={[styles.fabSmall, { backgroundColor: '#3498db' }]} onPress={() => {
                              if (!isSubscribed) {
                                  return Alert.alert(
                                      "Suscripción requerida",
                                      "Necesitas una suscripción activa para acceder al Coach IA.",
                                      [
                                          { text: "Cancelar", style: "cancel" },
                                          { 
                                              text: "Suscribirme", 
                                              onPress: () => navigation.navigate('Suscripcion') // Revisa si el nombre en tu Stack es 'SuscripcionScreen' o 'Subscription'
                                          },
                                          {
                                              // 👇 BOTÓN CORREGIDO PARA DESARROLLADORES
                                              text: "🔓 ACTIVAR YA (DEV)",
                                              onPress: async () => {
                                                  await activateSubscription(); // <--- FUNCIÓN CORRECTA
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
  
                      <View style={styles.fabOptionRow}>
                          <View style={styles.fabLabel}><Text style={styles.fabLabelText}>Avatar</Text></View>
                          <TouchableOpacity style={[styles.fabSmall, { backgroundColor: '#1abc9c' }]} onPress={() => navigation.navigate('Avatar')}>
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
          </SafeAreaView>
      );
  }
  
  const styles = StyleSheet.create({
      contenedorScroll: { flex: 1, backgroundColor: '#58d68d' },
      scrollContent: { padding: 20 },
  
      padre: { alignItems: 'center' },
      avatarContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 20, width: '100%', elevation: 3 },
      avatarTexto: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', paddingHorizontal: 10 },
  
      titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, alignSelf: 'flex-start', color: '#34495e' },
      tarjeta: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 10, width: '100%', elevation: 2, alignItems: 'center' },
      mediaAsset: { width: 80, height: 80, borderRadius: 10, marginRight: 15, backgroundColor: '#eee' },
      textoContainer: { flex: 1, justifyContent: 'center' },
      nombre: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
      repeticiones: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
      verVideo: { fontSize: 12, color: '#3498db', marginTop: 5, fontWeight: 'bold' },
      noRutina: { fontSize: 18, color: '#95a5a6', fontStyle: 'italic', marginVertical: 20 },
      dietaContainer: { backgroundColor: '#fff9e6', borderRadius: 15, padding: 15, marginTop: 25, width: '100%', elevation: 3 },
      tarjetaDieta: { backgroundColor: '#fad7a0', borderRadius: 10, padding: 10, marginVertical: 8 },
      comida: { fontSize: 15, color: '#333' },
      calorias: { fontSize: 14, color: '#666', marginTop: 5 },
      totalCalorias: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginTop: 10, textAlign: 'center' },
  
      modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
      modalContent: { backgroundColor: '#fff', padding: 10, borderRadius: 15, alignItems: 'center' },
      closeButton: { marginTop: 15, padding: 10, backgroundColor: '#e74c3c', borderRadius: 8, width: '100%', alignItems: 'center' },
      closeButtonText: { color: 'white', fontWeight: 'bold' },
  
      overlay: {
          position: 'absolute',
          top: 0, bottom: 0, left: 0, right: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1,
      },
      fabMain: {
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#2c3e50',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
          zIndex: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
      },
      fabMainText: {
          color: 'white',
          fontSize: 30,
          fontWeight: 'bold',
          marginTop: -2
      },
      fabOptionsContainer: {
          position: 'absolute',
          bottom: 100,
          right: 30,
          alignItems: 'flex-end',
          zIndex: 5,
      },
      fabOptionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
      },
      fabSmall: {
          width: 45,
          height: 45,
          borderRadius: 22.5,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 4,
          marginLeft: 10,
      },
      fabIcon: {
          fontSize: 20,
      },
      fabLabel: {
          backgroundColor: 'white',
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
          elevation: 3,
      },
      fabLabelText: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2c3e50',
      }
  });