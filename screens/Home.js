import {
        Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, Modal,
        SafeAreaView, Alert, Dimensions, ActivityIndicator
      } from 'react-native';
      import React, { useState, useCallback } from 'react';
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
        // 1. Traemos 'dietas' del contexto, junto con las rutinas
        const { rutinas, dietas, isLoadingData } = useUserData();
        // --- FIN DE LA MODIFICACIÓN ---
      
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
      
        // --- INICIO DE LA MODIFICACIÓN ---
        // 2. ¡BORRAMOS el objeto 'dietas' de aquí! (Ya no es necesario)
        // --- FIN DE LA MODIFICACIÓN ---
      
        // 3. 'dietaHoy' ahora usa el objeto 'dietas' que viene del contexto.
        const dietaHoy = (dietas && dietas[diaActual]) ? dietas[diaActual] : [];
        const totalCalorias = dietaHoy.reduce((total, comida) => total + comida.calorias, 0);
      
        const renderAsset = (ejercicio) => {
          // ... (esta función queda igual) ...
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
                {/* ... (Avatar y Rutina quedan igual) ... */}
      
                <View style={styles.avatarContainer}>
                  <AvatarCoach />
                  <Text style={styles.avatarTexto}>¡Vamos a entrenar!</Text>
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
    
                  {/* 4. Agregamos un chequeo por si 'isLoadingData' o 'dietas' no están listos */}
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
      
                {/* ... (Botones y Modal quedan igual) ... */}
    
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
        _         </TouchableOpacity>
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
                    />
                  )}
                  <TouchableOpacity style={styles.closeButton} onPress={closeVideo}>
                    <Text style={styles.closeButtonText}>Cerrar Video</Text>
      _           </TouchableOpacity>
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
        avatarTexto: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
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