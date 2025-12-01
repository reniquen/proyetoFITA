import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useAvatar } from './AvatarContext';
// Asegúrate de que esta importación sea correcta según tu estructura de archivos
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';

export default function AvatarCoach() {
  const { avatar, isLoading } = useAvatar();

  // 1. Estado de carga
  if (isLoading) {
    return (
      <View style={[styles.avatarContainer, styles.loadingState]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // 2. Si no ha cargado y no hay avatar, no mostramos nada para evitar errores
  // (Aunque el hook useAvatar debería manejar el estado inicial)
  if (!avatar && !isLoading) {
      // Opcional: Podrías retornar un contenedor vacío con el estilo para que ocupe el espacio
      // return <View style={styles.avatarContainer} />;
      return null;
  }

  // --- CORRECCIÓN CRÍTICA "SALVAVIDAS" ---

  // Intentamos obtener la fuente usando el avatar del usuario
  let animationSource = LOTTIE_ASSETS[avatar];

  // Verificamos: ¿Existe esta fuente?
  // Si animationSource es 'undefined' (porque el nombre del avatar no está en LOTTIE_ASSETS),
  // LottieView provocará el error "cannot read property 'uri' of undefined".
  if (!animationSource) {
    console.warn(`AvatarCoach: El avatar "${avatar}" no se encontró en LOTTIE_ASSETS. Usando fallback.`);

    // SALVAVIDAS: Tomamos el primer avatar disponible en tu lista de assets como default.
    // Esto asegura que SIEMPRE haya una animación válida.
    const defaultKey = Object.keys(LOTTIE_ASSETS)[0];

    if (defaultKey) {
        animationSource = LOTTIE_ASSETS[defaultKey];
    } else {
        // Caso extremo: LOTTIE_ASSETS está vacío o no se importó bien.
        // Mostramos un error visual en lugar de romper la app.
        return (
             <View style={[styles.avatarContainer, {backgroundColor: '#FFEBEE', borderColor: COLORS.error}]}>
                 <Text style={{color: 'red', fontSize: 10, textAlign: 'center'}}>Error Asset</Text>
             </View>
        );
    }
  }
  // ---------------------------------------

  return (
    <View style={styles.avatarContainer}>
      <LottieView
        // Usamos la fuente segura que calculamos arriba
        source={animationSource}
        autoPlay
        loop
        style={styles.lottieAvatar}
        resizeMode="contain"
      />
    </View>
  );
}

// (Asegúrate de tener definidos los colores si usas COLORS.error,
// si no, usa un hexadecimal directo como '#E53935')
const COLORS = {
    primary: '#4CAF50',
    error: '#E53935',
    shadow: '#263238'
};


const styles = StyleSheet.create({
  avatarContainer: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 85,
    borderWidth: 5,
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  lottieAvatar: {
    width: '90%',
    height: '90%',
  },
  loadingState: {
      backgroundColor: '#E8F5E9',
      borderColor: '#C8E6C9',
  }
});