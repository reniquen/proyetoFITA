import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminPanel({ navigation }) {
  const [usuariosCount, setUsuariosCount] = useState(0);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        setUsuariosCount(querySnapshot.size);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        Alert.alert('Error', 'No se pudo obtener la cantidad de usuarios.');
      }
    };

    obtenerUsuarios();
  }, []);

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch(() => Alert.alert('Error', 'No se pudo cerrar sesión.'));
  };

  return (
    <View style={styles.padre}>
      <Text style={styles.titulo}>Panel de Administración</Text>
      <Text style={styles.subtitulo}>Bienvenido, administrador</Text>

      <View style={styles.card}>
        <Text style={styles.texto}>Usuarios registrados: {usuariosCount}</Text>
      </View>

      <TouchableOpacity style={[styles.boton, { backgroundColor: '#f27474' }]} onPress={cerrarSesion}>
        <Text style={[styles.botonTexto, { color: 'white' }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#58d68d',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fad7a0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  texto: {
    fontSize: 18,
    marginBottom: 10,
  },
  boton: {
    backgroundColor: '#82e0aa',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  botonTexto: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

