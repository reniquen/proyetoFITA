import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarCoach from './AvatarCoach';

export default function Avatar() {
  const [avatar, setAvatar] = useState('🤖'); // valor inicial
  const [guardado, setGuardado] = useState(false);

  const opciones = ['🤖', '🧑‍🏫', '🦾', '🐼', '🔥', '💪']; // avatares disponibles

  // Cargar avatar guardado al entrar
  useEffect(() => {
    const cargarAvatar = async () => {
      try {
        const value = await AsyncStorage.getItem('avatar');
        if (value) setAvatar(value);
      } catch (e) {
        console.error('Error cargando avatar:', e);
      }
    };
    cargarAvatar();
  }, []);

  // Guardar avatar en memoria local
  const guardarAvatar = async (nuevoAvatar) => {
    try {
      await AsyncStorage.setItem('avatar', nuevoAvatar);
      setAvatar(nuevoAvatar);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000); // mensaje temporal
    } catch (e) {
      console.error('Error guardando avatar:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Elige tu Avatar</Text>

      {/* Vista previa */}
      <View style={styles.preview}>
        <Text style={styles.avatar}>{avatar}</Text>
        <Text style={styles.texto}>Vista previa de tu entrenador</Text>
      </View>

      {/* Opciones de avatar */}
      <FlatList
        data={opciones}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.opcion,
              item === avatar ? styles.seleccionado : null,
            ]}
            onPress={() => guardarAvatar(item)}
          >
            <Text style={styles.opcionTexto}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.lista}
      />

      {guardado && <Text style={styles.guardado}>✅ Avatar guardado</Text>}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#58d68d',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preview: {
    backgroundColor: '#fad7a0',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    fontSize: 60,
  },
  texto: {
    marginTop: 10,
    fontSize: 16,
  },
  lista: {
    justifyContent: 'center',
    marginVertical: 10,
  },
  opcion: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 15,
  },
  opcionTexto: {
    fontSize: 40,
  },
  seleccionado: {
    borderWidth: 3,
    borderColor: '#f39c12',
  },
  guardado: {
    marginTop: 15,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
});

