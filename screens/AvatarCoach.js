import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAvatar } from './AvatarContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native';

export default function AvatarCoach() {
  // Solo necesitamos el avatar y el estado de carga
  const { avatar, isLoading } = useAvatar();

  // Mostrar un indicador de carga sutil mientras se recupera el avatar
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }

  // Si no hay avatar seleccionado aún, no renderizar nada
  if (!avatar) {
    return null;
  }

  return (
    // Contenedor limpio para la animación
    <View style={styles.avatarContainer}>
      <LottieView
        source={LOTTIE_ASSETS[avatar]}
        autoPlay
        loop
        style={styles.lottieAvatar}
        resizeMode="cover" // Asegura que el lottie llene el contenedor
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor limpio solo para dimensionar la animación
  avatarContainer: {
    // AUMENTADO EL TAMAÑO AQUÍ (de 130 a 170)
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    // Sin backgroundColor, sin shadow, sin padding extra.
  },
  lottieAvatar: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    // También aumentamos el contenedor de carga para que coincida
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  }
});