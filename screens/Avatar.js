import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AvatarCoach from './AvatarCoach'; // Asegúrate de que este componente exista si lo usas en otro lugar

export default function Avatar() {
  const AVATAR_KEY = 'avatar';
  const opciones = ['🤖', '🧑‍🏫', '🦾', '🐼', '🔥', '💪', '👑', '🧙']; // Más avatares para elegir

  // 1. Estado para el avatar guardado (el que se usa en la app)
  const [avatarActual, setAvatarActual] = useState('🤖'); 
  // 2. Estado para el avatar que el usuario está previsualizando/seleccionando
  const [avatarSeleccionado, setAvatarSeleccionado] = useState('🤖'); 
  const [guardado, setGuardado] = useState(false);

  // Cargar avatar guardado al iniciar
  useEffect(() => {
    const cargarAvatar = async () => {
      try {
        const value = await AsyncStorage.getItem(AVATAR_KEY);
        if (value) {
          setAvatarActual(value);
          setAvatarSeleccionado(value); // El seleccionado es el actual al inicio
        }
      } catch (e) {
        console.error('Error cargando avatar:', e);
        Alert.alert('Error', 'No se pudo cargar tu avatar. Usando el predeterminado.');
      }
    };
    cargarAvatar();
  }, []);

  // Función para guardar *explícitamente* el avatar seleccionado
  const guardarAvatar = async () => {
    if (avatarSeleccionado === avatarActual) {
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000); // Muestra el mensaje "ya está guardado"
      return;
    }
    
    try {
      await AsyncStorage.setItem(AVATAR_KEY, avatarSeleccionado);
      setAvatarActual(avatarSeleccionado); // Actualiza el avatar actual
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000); // mensaje temporal
    } catch (e) {
      console.error('Error guardando avatar:', e);
      Alert.alert('Error', 'No se pudo guardar el avatar. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Elige tu Entrenador 🏆</Text>

      {/* Vista previa (separada de las opciones) */}
      <View style={styles.previewCard}>
        <Text style={styles.avatar}>{avatarSeleccionado}</Text>
        <Text style={styles.texto}>Este será tu compañero de entrenamiento.</Text>
      </View>

      <Text style={styles.subtitulo}>Opciones disponibles</Text>
      
      {/* Opciones de avatar */}
      <FlatList
        data={opciones}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.opcion,
              item === avatarSeleccionado ? styles.seleccionado : null, // Marca el temporalmente seleccionado
              item === avatarActual ? styles.actual : null, // Marca el ya guardado (con un estilo diferente)
            ]}
            onPress={() => setAvatarSeleccionado(item)} // Solo cambia el estado temporal
          >
            <Text style={styles.opcionTexto}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.lista}
        showsHorizontalScrollIndicator={false}
      />
      
      {/* Botón de Guardar y Mensaje */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.botonGuardar}
          onPress={guardarAvatar}
        >
          <Text style={styles.botonTexto}>Guardar Avatar: {avatarSeleccionado}</Text>
        </TouchableOpacity>

        {guardado && <Text style={styles.guardado}>✅ ¡Guardado!</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#ecf0f1', // Fondo más neutro
  },
  titulo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 20,
    marginBottom: 10,
  },
  previewCard: { // Nueva tarjeta para la vista previa
    backgroundColor: '#fff', 
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
  },
  avatar: {
    fontSize: 80, // Avatar más grande
    marginBottom: 10,
  },
  texto: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  lista: {
    paddingVertical: 10,
    alignItems: 'center',
    gap: 15, // Usamos gap para separar las opciones
  },
  opcion: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    // marginHorizontal: 5, // Reemplazado por gap en lista
  },
  opcionTexto: {
    fontSize: 35,
  },
  seleccionado: { // Borde para la selección *temporal*
    borderColor: '#3498db',
    backgroundColor: '#eaf4fd',
  },
  actual: { // Indicador para el avatar ya guardado
    borderWidth: 4,
    borderColor: '#2ecc71', 
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  botonGuardar: {
    backgroundColor: '#f39c12',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guardado: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
  },
});