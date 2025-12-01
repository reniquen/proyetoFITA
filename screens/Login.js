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
  Dimensions
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// --- PALETA DE COLORES PROFESIONAL Y REFINADA (Última versión aprobada) ---
const COLORS = {
  headerGreen: '#00A86B',
  backgroundCream: '#FFF5E1',
  primaryYellow: '#FFC107',
  accentGreen: '#2E7D32', // Verde oscuro para enlaces
  textDark: '#1C1C1C',
  textGray: '#757575',
  buttonText: '#2D2D2D', // Color texto botón amarillo
  white: '#FFFFFF',
  inputBg: '#FFFFFF',
};

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // --- Funciones de lógica ---

  const validarCorreo = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const manejarErrorFirebase = (error) => {
    let mensaje = 'Ocurrió un error inesperado.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        mensaje = 'Credenciales incorrectas. Verifica correo y contraseña.';
        break;
      case 'auth/invalid-email':
        mensaje = 'El formato del correo electrónico no es válido.';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos fallidos. Intenta más tarde.';
        break;
      case 'auth/network-request-failed':
        mensaje = 'Error de conexión. Verifica tu internet.';
        break;
      default:
        mensaje = error.message;
        break;
    }
    Alert.alert('Error de Inicio de Sesión', mensaje);
  };

  // --- LÓGICA DE INICIO DE SESIÓN RESTAURADA ---
  const iniciarSesion = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Campos Incompletos', 'Por favor ingresa correo y contraseña.');
      return;
    }

    if (!validarCorreo(correo)) {
      Alert.alert('Correo Inválido', 'El formato del correo no es correcto.');
      return;
    }

    setLoading(true);
    try {
      // 1. Intentar login con Firebase
      await signInWithEmailAndPassword(auth, correo, contrasena);

      // --- AQUÍ ESTÁ TU LISTA DE ADMINS RESTAURADA ---
      const correosAdmin = ["reniquen@hotmail.com", "jno@gmail.com", "root@fita.com"];

      if (correosAdmin.includes(correo.toLowerCase().trim())) {
        // Si es admin, va al panel
        navigation.replace('AdminPanel');
      } else {
        // Si es usuario normal, va al Home
        navigation.replace('Home');
      }
      // -----------------------------------------------

    } catch (error) {
      console.error('Error login:', error);
      manejarErrorFirebase(error);
    } finally {
      setLoading(false);
    }
  };
  // --------------------------------------------------

  const recuperarContrasena = async () => {
    if (!correo) {
        Alert.alert('Atención', 'Ingresa tu correo electrónico para recibir el enlace de recuperación.');
        return;
    }
    if (!validarCorreo(correo)) {
        Alert.alert('Error', 'Ingresa un correo válido.');
        return;
    }
    setLoading(true);
    try {
        await sendPasswordResetEmail(auth, correo);
        Alert.alert('Correo Enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña.');
    } catch (e) {
        manejarErrorFirebase(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={COLORS.headerGreen} barStyle="light-content" />

      {/* --- CABECERA VERDE CON LOGO GIGANTE --- */}
      <View style={styles.headerContainer}>
         <Image
            source={require('../assets/logofita.png')}
            style={styles.fitaLogo}
            resizeMode="contain"
         />
      </View>

      {/* --- CONTENIDO (Tarjeta Crema) --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.card}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>¡Bienvenido a FITA!</Text>
                <Text style={styles.subtitle}>Ingresa tu correo y contraseña.</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={22} color={COLORS.textGray} style={styles.inputIcon} />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={COLORS.textGray}
                style={styles.input}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={22} color={COLORS.textGray} style={styles.inputIcon} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={COLORS.textGray}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                value={contrasena}
                onChangeText={setContrasena}
              />
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
                <Icon name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.textGray} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={recuperarContrasena} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={iniciarSesion} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.buttonText} />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.linkText}>¿Aún no tienes cuenta? <Text style={styles.linkBold}>Regístrate aquí</Text></Text>
              </TouchableOpacity>
            </View>

            <View style={{height: 30}} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.headerGreen,
  },
  headerContainer: {
      height: height * 0.30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
  },
  fitaLogo: {
    width: 260, // Logo grande (último ajuste visual)
    height: 260,
  },
  keyboardView: {
      flex: 1,
  },
  scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: COLORS.backgroundCream,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 30,
    width: '100%',
    minHeight: height * 0.7,
    alignItems: 'center',
  },
  titleContainer: { marginBottom: 35, alignItems: 'center', width: '100%' },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.textDark, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textGray, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 30, paddingHorizontal: 20, marginBottom: 15, height: 60, width: '100%', borderWidth: 0, elevation: 0 },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, fontSize: 16, color: COLORS.textDark, height: '100%' },
  eyeIcon: { padding: 15 },

  forgotPasswordContainer: { alignSelf: 'flex-end', marginTop: 5, marginBottom: 30, marginRight: 10 },
  forgotPasswordText: { color: COLORS.accentGreen, fontSize: 15, fontWeight: '700' },

  loginButton: {
    backgroundColor: COLORS.primaryYellow,
    borderRadius: 30,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 0,
    shadowColor: COLORS.primaryYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: COLORS.buttonText,
    fontSize: 20,
    fontWeight: 'bold',
  },

  linksContainer: { alignItems: 'center', marginBottom: 20 },
  linkText: { color: COLORS.textDark, fontSize: 15 },
  linkBold: { color: COLORS.accentGreen, fontWeight: 'bold' },
});