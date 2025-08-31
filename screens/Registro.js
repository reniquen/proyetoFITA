import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Registro({ navigation, route }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const planSeleccionado = route.params?.plan || '';

  const registrarUsuario = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor, ingresa correo y contraseña.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        email: correo,
        plan: planSeleccionado,
      });

      Alert.alert('Éxito', 'Usuario registrado exitosamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Datos', { userId: user.uid }) },
      ]);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', 'No se pudo registrar el usuario. Intenta nuevamente.');
    }
  };

  return (
    <ScrollView style={styles.contenedorScroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.padre}>
        <Image source={require('../assets/logofita.png')} style={styles.fita} />
        <View style={styles.tarjeta}>
          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="correo@gmail.com"
              style={{ paddingHorizontal: 15 }}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="contraseña"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
              value={contrasena}
              onChangeText={setContrasena}
            />
          </View>
          <View style={styles.PadreBoton}>
            <TouchableOpacity style={styles.cajaBoton} onPress={registrarUsuario}>
              <Text style={styles.TextoBoton}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedorScroll: {
    flex: 1,
    backgroundColor: '#58d68d',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padre: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fita: {
    width: 260,
    height: 260,
  },
  tarjeta: {
    margin: 20,
    backgroundColor: '#f8c471',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 20,
    backgroundColor: '#fad7a0',
    borderRadius: 50,
    marginVertical: 10,
  },
  PadreBoton: {
    alignItems: 'center',
  },
  cajaBoton: {
    backgroundColor: '#82e0aa',
    borderRadius: 50,
    paddingVertical: 20,
    width: 120,
    marginTop: 20,
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  TextoBoton: {
    textAlign: 'center',
    color: 'Black',
  },
});
