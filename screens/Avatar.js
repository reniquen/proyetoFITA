// screens/Avatar.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAvatar } from '../contexts/AvatarContext'; // 1. Importar el Hook

export default function Avatar() {
  // 2. Usar el contexto
  const { avatar: avatarActual, guardarAvatar, isLoading } = useAvatar(); 
  
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(avatarActual);
  const [guardado, setGuardado] = useState(false);

  const opciones = ['🤖', '🧑‍🏫', '🦾', '🐼', '🔥', '💪', '👑', '🧙'];

  // Sincronizar el seleccionado cuando el actual cambie (al cargar)
  useEffect(() => {
    if (!isLoading) {
      setAvatarSeleccionado(avatarActual);
    }
  }, [avatarActual, isLoading]);

  const handleGuardar = async () => {
    if (avatarSeleccionado === avatarActual) {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 1500);
        return;
    }
    try {
      // 3. Llamar a la función del contexto para guardar
      await guardarAvatar(avatarSeleccionado); 
      setGuardado(true);
      setTimeout(() => setGuardado(false), 1500);
    } catch (e) {
      console.error('Error guardando avatar:', e);
      Alert.alert('Error', 'No se pudo guardar el avatar.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Elige tu Entrenador 🏆</Text>

      <View style={styles.previewCard}>
        <Text style={styles.avatar}>{avatarSeleccionado}</Text>
        <Text style={styles.texto}>Este será tu compañero.</Text>
      </View>

      <Text style={styles.subtitulo}>Opciones</Text>
      
      <FlatList
        data={opciones}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.opcion,
              // Estilo para el que estás seleccionando
              item === avatarSeleccionado ? styles.seleccionado : null,
              // Estilo para el que ya está guardado
              item === avatarActual ? styles.actual : null, 
            ]}
            onPress={() => setAvatarSeleccionado(item)}
          >
            <Text style={styles.opcionTexto}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.lista}
        showsHorizontalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.botonGuardar}
          onPress={handleGuardar}
        >
          <Text style={styles.botonTexto}>Guardar: {avatarSeleccionado}</Text>
        </TouchableOpacity>
        {guardado && <Text style={styles.guardado}>✅ ¡Guardado!</Text>}
      </View>
    </View>
  );
}

// Estilos mejorados
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
  previewCard: { // Tarjeta para la vista previa
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
    fontSize: 80,
    marginBottom: 10,
  },
  texto: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  lista: {
    paddingVertical: 10,
    alignItems: 'center',
    gap: 15, // 'gap' es más moderno que marginHorizontal
  },
  opcion: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  opcionTexto: {
    fontSize: 35,
  },
  seleccionado: { // Borde para la selección *temporal*
    borderColor: '#3498db',
    backgroundColor: '#eaf4fd',
  },
  actual: { // Indicador para el avatar ya guardado (verde)
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