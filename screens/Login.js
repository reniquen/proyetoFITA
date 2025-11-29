// screens/Login.js
import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- NUEVA PALETA DE COLORES (Fondo Más Claro, Tarjeta con Borde) ---
const COLORS = {
  mainBg: '#F1F8E9',       // Un verde muy muy claro, casi blanco pero con matiz
  cardBg: '#FFFDE7',       // Crema/Marfil para la tarjeta (cálido, no blanco puro)
  
  primaryGreen: '#2E7D32', // Verde bosque profundo para el botón principal
  accentYellow: '#F9A825', // Amarillo/Naranja vibrante para acentos
  
  cardBorder: '#A5D6A7',   // Color del borde para la TARJETA de login
  
  textDark: '#263238',     // Texto oscuro
  textMedium: '#757575',   // Texto medio
  inputBg: '#FFFFFF',      // Inputs blancos
  inputBorder: '#E0E0E0',  // Borde suave para inputs
};

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
      const correosAdmin = ["reniquen@hotmail.com", "jno@gmail.com", "root@fita.com"];
      if (correosAdmin.includes(correo)) {
        navigation.replace('AdminPanel');
      } else {
        navigation.navigate('Home');
      }
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
    <View style={styles.mainContainer}>
      {/* Barra de estado ajustada al nuevo fondo claro */}
      <StatusBar backgroundColor={COLORS.mainBg} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>

          {/* Vuelve a ser un simple contenedor para el logo, sin borde */}
          <View style={styles.logoContainer}>
             <Image source={require('../assets/ejercicios/logofita.png')} style={styles.fita} />
             <Image source={require('../assets/logofita.png')} style={styles.fita} resizeMode="contain" />
          </View>

          {/* La tarjeta ahora lleva el borde */}
          <View style={styles.card}>
            <Text style={styles.title}>Bienvenido a FITA</Text>

            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={24} color={COLORS.textMedium} style={styles.inputIcon} />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={COLORS.textMedium}
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={24} color={COLORS.textMedium} style={styles.inputIcon} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={COLORS.textMedium}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                value={contrasena}
                onChangeText={setContrasena}
              />
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
                <Icon name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={24} color={COLORS.textMedium} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={iniciarSesion} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.cardBg} />
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
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.mainBg, // Fondo muy claro
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logoContainer: {
    marginTop: 10,
    marginBottom: -30,
    alignItems: 'center',
    zIndex: 1,
    // REVERTIDO: Eliminados los estilos de borde y padding de aquí
  },
  fita: {
    width: 300, // Vuelve al tamaño de 300
    height: 300,
  },
  card: {
    backgroundColor: COLORS.cardBg, // Crema/Marfil
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    // --- NUEVOS ESTILOS PARA EL BORDE DE LA TARJETA ---
    borderWidth: 2,
    borderColor: COLORS.cardBorder, // Borde de color similar al del buscador admin
    // ---------------------------------------------------
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    height: 50,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 12,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  loginButtonText: {
    color: COLORS.cardBg,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.textDark,
    fontSize: 15,
  },
  linkBold: {
    color: COLORS.accentYellow,
    fontWeight: 'bold',
  },
  linkTextSecondary: {
    color: COLORS.textMedium,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});