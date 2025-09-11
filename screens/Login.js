import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const iniciarSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor ingrese su correo y contraseña.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      Alert.alert('Éxito', 'Inicio de sesión exitoso.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión. Verifique sus credenciales.');
    }
  };

  const recuperarContrasena = async () => {
    if (!correo) {
      Alert.alert('Error', 'Ingrese su correo para recuperar la contraseña.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, correo);
      Alert.alert('Éxito', 'Se ha enviado un correo para restablecer su contraseña.');
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      Alert.alert('Error', 'No se pudo enviar el correo de recuperación.');
    }
  };

  return (
    <View style={styles.padre}>
      <View>
        <Image source={require('../assets/logofita.png')} style={styles.fita} />
      </View>
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
          <TouchableOpacity style={styles.cajaBoton} onPress={iniciarSesion}>
            <Text style={styles.TextoBoton}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.PadreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.TextoBoton}>Registrarse</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.PadreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={recuperarContrasena}>
            <Text style={styles.TextoBoton}>Recuperar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#58d68d',
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
    width: 180, // aumenté un poco para el texto largo
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
