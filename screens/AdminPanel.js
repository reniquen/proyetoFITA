import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function AdminPanel({ navigation }) {
  const [contador, setContador] = useState(0);

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
        <Text style={styles.texto}>Contador de pruebas: {contador}</Text>
        <TouchableOpacity style={styles.boton} onPress={() => setContador(contador + 1)}>
          <Text style={styles.botonTexto}>Incrementar</Text>
        </TouchableOpacity>
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
