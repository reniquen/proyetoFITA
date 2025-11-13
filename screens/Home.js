import {
        Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, Modal,
        SafeAreaView, Alert, Dimensions, ActivityIndicator
    } from 'react-native';
    // --- INICIO DE LA MODIFICACIÓN ---
    // 1. Importamos useState y useEffect
    import React, { useState, useCallback, useEffect } from 'react';
    // --- FIN DE LA MODIFICACIÓN ---
    import YoutubePlayer from 'react-native-youtube-iframe';
    import { auth } from './firebaseConfig';
    import { signOut } from 'firebase/auth';
    import AvatarCoach from './AvatarCoach';
    import { useUserData } from './UserDataContext'; // 👈 Contexto
    import LottieView from 'lottie-react-native';
    
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
    
      // --- INICIO DE LA MODIFICACIÓN ---
      // 2. Creamos un estado para el consejo dinámico
      const [dynamicTip, setDynamicTip] = useState("¡Vamos a entrenar!");
      // --- FIN DE LA MODIFICACIÓN ---
    
      const { rutinas, dietas, isLoadingData } = useUserData();
    
      // --- INICIO DE LA MODIFICACIÓN ---
      // 3. Hook para setear el consejo dinámico UNA SOLA VEZ al cargar
      useEffect(() => {
        setDynamicTip(getDynamicTip());
      }, []); // El array vacío [] asegura que solo se ejecute 1 vez
    
      // 4. Función que genera el consejo dinámico
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
        if (hour < 12) { // Antes de las 12 PM
          tipsList = morningTips;
        } else if (hour < 19) { // Antes de las 7 PM
          tipsList = afternoonTips;
        } else { // Noche
          tipsList = eveningTips;
        }
    
        // Elige uno al azar de la lista correspondiente
        return tipsList[Math.floor(Math.random() * tipsList.length)];
      };
      // --- FIN DE LA MODIFICACIÓN ---
    
      const openVideo = (videoUrl) => {
        // ... (código sin cambios)
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
        // ... (código sin cambios)
          setIsPlaying(false);
          setModalVisible(false);
          setSelectedVideoId(null);
      };
      
      const onStateChange = useCallback((state) => {
        // ... (código sin cambios)
          if (state === "ended") closeVideo();
      }, []);
      
      const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
      const diaActual = diasSemana[new Date().getDay()];
      const rutinaHoy = rutinas[diaActual] || [];
      
      const cerrarSesion = () => {
        // ... (código sin cambios)
          signOut(auth)
            .then(() => navigation.replace('Login'))
            .catch(() => Alert.alert('Error', 'No se pudo cerrar sesión.'));
      };
      
      // (El objeto 'dietas' ya fue removido en el paso anterior, eso está bien)
      
      const dietaHoy = (dietas && dietas[diaActual]) ? dietas[diaActual] : [];
      const totalCalorias = dietaHoy.reduce((total, comida) => total + comida.calorias, 0);
      
      const renderAsset = (ejercicio) => {
        // ... (código sin cambios)
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
      
      return (
        <SafeAreaView style={styles.contenedorScroll}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.padre}>
      
              <View style={styles.avatarContainer}>
                <AvatarCoach />
                
                {/* --- INICIO DE LA MODIFICACIÓN --- */}
                {/* 5. Usamos el estado dinámico en lugar del texto fijo */}
                <Text style={styles.avatarTexto}>{dynamicTip}</Text>
                {/* --- FIN DE LA MODIFICACIÓN --- */}
    
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
      
              {/* 🍎 Dieta */}
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
      
              {/* ... (Botones y Modal sin cambios) ... */}
    
              <View style={styles.menuContainer}>
                <TouchableOpacity style={[styles.boton, { backgroundColor: '#1abc9c' }]} onPress={() => navigation.navigate('Avatar')}>
                  <Text style={[styles.botonTexto, { color: 'white' }]}>👤 Personalizar Avatar</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={[styles.boton, { backgroundColor: '#3498db', marginTop: 15 }]} onPress={() => navigation.navigate('AvatarChat')}>
                  <Text style={[styles.botonTexto, { color: 'white' }]}>💬 Coach IA</Text>
                </TouchableOpacity>              
      
                <TouchableOpacity style={[styles.boton, { backgroundColor: '#f39c12', marginTop: 15 }]} onPress={() => navigation.navigate('Scanner')}>
                  <Text style={[styles.botonTexto, { color: 'white' }]}>📷 Scanner</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={[styles.boton, { backgroundColor: '#9b59b6', marginTop: 15 }]} onPress={() => navigation.navigate('CalendarRecipes')}>
                  <Text style={[styles.botonTexto, { color: 'white' }]}>📅 Calendario Recetas</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={[styles.boton, { backgroundColor: '#e74c3c', marginTop: 20 }]} onPress={cerrarSesion}>
                  <Text style={[styles.botonTexto, { color: 'white' }]}>🚪 Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
      
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
            _       />
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
    
    // 🎨 ESTILOS (Quedan idénticos)
    const styles = StyleSheet.create({
      // ... (todos tus estilos van aquí, sin cambios) ...
      contenedorScroll: { flex: 1, backgroundColor: '#58d68d' },
      scrollContent: { padding: 20 },
    
      padre: { alignItems: 'center' },
      avatarContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 20, width: '100%', elevation: 3 },
      avatarTexto: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', paddingHorizontal: 10 }, // 👈 Añadí textAlign y padding por si el texto es largo
    
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
      menuContainer: { width: '100%', marginTop: 25, alignItems: 'center' },
      boton: { width: '85%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', elevation: 3 },
      botonTexto: { fontSize: 16, fontWeight: 'bold' },
      modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
      modalContent: { backgroundColor: '#fff', padding: 10, borderRadius: 15, alignItems: 'center' },
      closeButton: { marginTop: 15, padding: 10, backgroundColor: '#e74c3c', borderRadius: 8, width: '100%', alignItems: 'center' },
      closeButtonText: { color: 'white', fontWeight: 'bold' },
    });