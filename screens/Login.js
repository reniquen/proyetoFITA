// screens/Login.js
import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View, // Cambiado de LinearGradient a View
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
// No necesitamos getDoc ni db si no verificamos isAdmin en Firestore
import { auth } from './firebaseConfig'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// No necesitamos LinearGradient si usamos fondo sólido
// import { LinearGradient } from 'expo-linear-gradient';

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validarCorreo = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const manejarErrorFirebase = (error) => {
    let mensaje = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        mensaje = 'Correo o contraseña incorrectos.';
        break;
      case 'auth/invalid-email':
        mensaje = 'El formato del correo electrónico no es válido.';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos fallidos. Por favor, intenta más tarde.';
        break;
      case 'auth/network-request-failed':
        mensaje = 'Error de conexión. Verifica tu acceso a internet.';
        break;
      default:
        mensaje = error.message;
        break;
    }
    Alert.alert('Error de Inicio de Sesión', mensaje);
  };

  const iniciarSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Campos Vacíos', 'Por favor ingrese su correo y contraseña.');
      return;
    }

    if (!validarCorreo(correo)) {
      Alert.alert('Correo Inválido', 'Por favor ingrese un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);

      // --- LÓGICA DE ADMINISTRADOR POR LISTA DE CORREOS ---
      const correosAdmin = ["reniquen@hotmail.com", "jno@gmail.com", "root@fita.com"];
      if (correosAdmin.includes(correo)) {
        navigation.replace('AdminPanel'); // Redirección directa sin Alert
      } else {
        navigation.navigate('Home'); // Redirección directa sin Alert para usuarios normales
      }
      // --- FIN LÓGICA DE ADMINISTRADOR ---

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      manejarErrorFirebase(error);
    } finally {
      setLoading(false);
    }
  };

  const recuperarContrasena = async () => {
    if (!correo) {
      Alert.alert('Correo Requerido', 'Ingrese su correo electrónico para enviar el enlace de recuperación.');
      return;
    }
    if (!validarCorreo(correo)) {
      Alert.alert('Correo Inválido', 'Por favor ingrese un correo electrónico válido.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, correo);
      Alert.alert('Correo Enviado', 'Se ha enviado un enlace para restablecer su contraseña a su correo.');
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      manejarErrorFirebase(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Usamos un View con tu estilo de fondo original 'padre'
    <View style={styles.padre}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>

          {/* Tu logo original */}
          <View style={styles.logoContainer}>
             <Image source={require('../assets/ejercicios/logofita.png')} style={styles.fita} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Bienvenido a FITA</Text>

            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#999"
                style={styles.input}
                secureTextEntry={secureTextEntry}
                value={contrasena}
                onChangeText={setContrasena}
              />
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
                <Icon name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={iniciarSesion} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={recuperarContrasena} style={{ marginTop: 15 }}>
                <Text style={styles.linkTextSecondary}>Olvidé mi contraseña</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Tu estilo original para el fondo sólido
  padre: {
    flex: 1,
    backgroundColor: '#58d68d', // Color de fondo original
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  // Tu estilo original para el logo
  fita: {
    width: 260,
    height: 260,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 50,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 15,
  },
  linkBold: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  linkTextSecondary: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});