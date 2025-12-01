// screens/Registro.js
import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

// --- Paleta de Colores ---
const COLORS = {
  brandGreenDark: '#005b4f', 
  brandGreen: '#00A86B',
  brandYellow: '#FFD54F', 
  mainBg: '#F7F9F2',     
  cardBg: '#FFFFFF',     
  textDark: '#2D3748',   
  textMedium: '#718096', 
  inputBg: '#EDF2F7',    
};

export default function Registro({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const registrarUsuario = async () => {
    if (!correo || !contrasena || !confirmarContrasena) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }
    if (contrasena !== confirmarContrasena) {
        Alert.alert('Error de contraseña', 'Las contraseñas no coinciden. Por favor, verifícalas.');
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;
      
      // 1. Crear documento en Firestore (datosCompletos: false es CRUCIAL)
      await setDoc(doc(db, 'usuarios', user.uid), {
        email: correo.toLowerCase(),
        fechaRegistro: new Date().toISOString(),
        isPremium: false,
        datosCompletos: false, // <-- Esto fuerza la redirección a Datos en App.js
      });

      // 2. ¡NO NAVEGAMOS MANUALMENTE! 
      // El onAuthStateChanged en App.js detectará el nuevo usuario y redirigirá a Datos.
      // Solo mostramos una alerta simple de éxito sin navegación.

      Alert.alert('¡Cuenta Creada!', 'Serás redirigido para completar tu perfil.');

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Este correo ya está registrado.';
      if (error.code === 'auth/weak-password') errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      Alert.alert('Error de Registro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandGreenDark} />
      <SafeAreaView style={styles.safeAreaTop} />

      {/* --- CABECERA VERDE --- */}
      <View style={styles.headerBackground}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={28} color={COLORS.brandYellow} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logofita.png')} 
            style={styles.fitaLogo} 
            resizeMode="contain" 
          />
        </View>
      </View>

      {/* --- TARJETA DE REGISTRO --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          centerContent={true}
        >
          <View style={styles.tarjetaRegistro}>
            <Text style={styles.tituloTarjeta}>Crear Nueva Cuenta</Text>
            <Text style={styles.subtituloTarjeta}>Comienza tu transformación hoy.</Text>

            {/* INPUT CORREO */}
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={20} color={COLORS.brandYellow} style={styles.inputIcon} />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={COLORS.textMedium}
                style={styles.inputInput}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* INPUT CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color={COLORS.brandYellow} style={styles.inputIcon} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={COLORS.textMedium}
                style={styles.inputInput}
                secureTextEntry={!isPasswordVisible} 
                value={contrasena}
                onChangeText={setContrasena}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer}>
                  <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.brandYellow} />
              </TouchableOpacity>
            </View>

            {/* INPUT CONFIRMAR CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <Icon name="lock-check-outline" size={20} color={COLORS.brandYellow} style={styles.inputIcon} />
              <TextInput
                placeholder="Confirmar contraseña"
                placeholderTextColor={COLORS.textMedium}
                style={styles.inputInput}
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmarContrasena}
                onChangeText={setConfirmarContrasena}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIconContainer}>
                  <Icon name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.brandYellow} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.botonPrincipal, loading && styles.botonDeshabilitado]}
              onPress={registrarUsuario}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                 <Text style={styles.textoBotonPrincipal}>SIGUIENTE PASO</Text>
                 <Icon name="chevron-right" size={24} color={COLORS.brandYellow} style={{marginLeft: 8}}/>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={{height: 30}} />
        </ScrollView>
      </KeyboardAvoidingView>
       <SafeAreaView style={styles.safeAreaBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.mainBg },
  safeAreaTop: { flex: 0, backgroundColor: COLORS.brandGreenDark },
  safeAreaBottom: { flex: 0, backgroundColor: COLORS.mainBg },
  keyboardView: { flex: 1 },
  
  headerBackground: {
    backgroundColor: COLORS.brandGreenDark,
    height: height * 0.30, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 10 : 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
  backButton: { position: 'absolute', top: Platform.OS === 'android' ? 20 : 10, left: 20, padding: 8, zIndex: 10 },
  logoContainer: { alignItems: 'center', justifyContent: 'center' },
  fitaLogo: { width: 200, height: 200 },

  scrollView: { flex: 1, backgroundColor: 'transparent', zIndex: 2 }, 
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 15, 
    paddingBottom: 20, 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  tarjetaRegistro: {
    backgroundColor: COLORS.cardBg,
    width: '100%',
    borderRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tituloTarjeta: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark, textAlign: 'center', marginBottom: 5 },
  subtituloTarjeta: { fontSize: 14, color: COLORS.textMedium, textAlign: 'center', marginBottom: 20 },
  
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg,
    borderRadius: 16, marginBottom: 15, paddingHorizontal: 15, height: 55,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  inputIcon: { marginRight: 12 },
  inputInput: { flex: 1, color: COLORS.textDark, fontSize: 16, height: '100%' },
  eyeIconContainer: { padding: 8 },

  botonPrincipal: {
    backgroundColor: COLORS.brandGreenDark, flexDirection: 'row', borderRadius: 16,
    paddingVertical: 16, marginTop: 20, justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.brandGreen, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  botonDeshabilitado: { opacity: 0.7 },
  textoBotonPrincipal: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.8 },
});