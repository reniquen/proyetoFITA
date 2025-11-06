import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator, // Para la carga
} from 'react-native';
import React, { useState, useCallback } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import AvatarCoach from './AvatarCoach';
import { useUserData } from './UserDataContext'; // <-- 1. IMPORTAR DATOS DE USUARIO

// Función para extraer el ID del video (sin cambios)
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function Home({ navigation }) {
  // --- Estados del Modal (sin cambios) ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- 2. LEER RUTINAS DESDE EL CONTEXTO ---
  const { rutinas, isLoadingData } = useUserData();

  // --- Funciones del Modal (sin cambios) ---
  const openVideo = (videoUrl) => {
    const videoId = getYouTubeId(videoUrl);
    if (videoId) {
      setSelectedVideoId(videoId);
      setIsPlaying(true);
      setModalVisible(true);
    } else {
      Alert.alert("Video no válido", "No se pudo encontrar el ID del video de YouTube.");
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

  // --- Datos de Rutinas (DINÁMICOS) ---
  const diasSemana = [ "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado" ];
  const diaActual = diasSemana[new Date().getDay()];
  const rutinaHoy = rutinas[diaActual] || []; // Obtiene la rutina del contexto

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch(() => Alert.alert('Error', 'No se pudo cerrar sesión.'));
  };

  return (
    <SafeAreaView style={styles.contenedorScroll}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.padre}>
          <View style={styles.avatarContainer}>
            <AvatarCoach />
            <Text style={styles.avatarTexto}>¡Hola! Hoy te motivaré en tu rutina 💪</Text>
          </View>

          <Text style={styles.titulo}>Hoy {diaActual}, ¡CON TODO!:</Text>
          
          {/* Muestra un "cargando" mientras se leen las rutinas */}
          {isLoadingData ? (
            <ActivityIndicator size="large" color="#fad7a0" style={{ marginVertical: 20 }} />
          ) : rutinaHoy.length > 0 ? (
            rutinaHoy.map((ejercicio, index) => (
              <View key={index} style={styles.tarjeta}>
                {/* Nota: Se eliminó el <Image> y video. Si tu app los necesita, debes restaurarlos aquí */}
                <View style={styles.textoContainer}>
                  <Text style={styles.nombre}>{ejercicio.nombre}</Text>
                  <Text style={styles.repeticiones}>{ejercicio.repeticiones}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noRutina}>Hoy te toca descanso.</Text>
          )}

          {/* --- BOTONES DE NAVEGACIÓN --- */}
          
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate('Comidas')}
          >
            <Text style={styles.botonTexto}>Ver Dieta (Planes)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate('Avatar')}
          >
            <Text style={styles.botonTexto}>Personalizar Avatar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate('AvatarChat')}
          >
            <Text style={styles.botonTexto}>Chatear con Coach IA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.boton, {backgroundColor: '#3498db'}]} 
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={[styles.botonTexto, {color: 'white'}]}>Escanear Producto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, {backgroundColor: '#f39c12'}]} 
            onPress={() => navigation.navigate('Comparador')}
          >
            <Text style={[styles.botonTexto, {color: 'white'}]}>Comparador Nutricional</Text>
          </TouchableOpacity>

          {/* --- NUEVO BOTÓN CALENDARIO --- */}
          <TouchableOpacity
            style={[styles.boton, {backgroundColor: '#9b59b6'}]} // Morado
            onPress={() => navigation.navigate('CalendarRecipes')}
          >
            <Text style={[styles.botonTexto, {color: 'white'}]}>Calendario de Recetas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.boton, { backgroundColor: '#e74c3c', marginTop: 15 }]} // Rojo
            onPress={cerrarSesion}
          >
            <Text style={[styles.botonTexto, { color: 'white' }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- Modal para Video (Sin cambios) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeVideo}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={closeVideo}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1}>
              {selectedVideoId && (
                <YoutubePlayer
                  height={(Dimensions.get('window').width * 0.9) * (9 / 16)} 
                  width={Dimensions.get('window').width * 0.9} 
                  play={isPlaying}
                  videoId={selectedVideoId}
                  onChangeState={onStateChange}
                  onError={e => {
                    console.error("Error del reproductor de YouTube:", e);
                    Alert.alert("Error", "El propietario de este video ha restringido su reproducción.");
                    closeVideo();
                  }}
                />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={closeVideo}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// --- ESTILOS (Ajustados) ---
const styles = StyleSheet.create({
  contenedorScroll: { flex: 1, backgroundColor: '#58d68d' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  padre: { alignItems: 'center' },
  avatarContainer: {
    backgroundColor: '#fff3e0',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '100%',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  tarjeta: {
    backgroundColor: '#fad7a0',
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textoContainer: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  repeticiones: { fontSize: 16, color: '#333' },
  noRutina: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 15,
    borderRadius: 10,
  },
  boton: {
    borderRadius: 50,
    paddingVertical: 18,
    width: '100%',
    marginTop: 15,
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#82e0aa', // Color base
  },
  botonTexto: { textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: 16 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10, alignItems: 'center' },
  closeButton: { backgroundColor: '#82e0aa', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, marginTop: 15 },
  closeButtonText: { color: 'black', fontSize: 16, fontWeight: 'bold' },
});