// screens/AvatarCoach.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAvatar } from './AvatarContext';
import { LOTTIE_ASSETS } from './AvatarAssets';
import LottieView from 'lottie-react-native'; // <-- Importar Lottie

export default function AvatarCoach() {
  const { avatar, isLoading } = useAvatar(); // 'avatar' ahora es un string (ej: "normal")
  const [consejo, setConsejo] = useState('');

  const consejos = [
    "¡No olvides hidratarte! 💧",
    "Hoy es un gran día para darlo todo 💪",
    "La constancia es más importante que la perfección 🔑",
    "Recuerda estirar antes de entrenar 🧘",
  ];

  useEffect(() => {
    const randomConsejo = consejos[Math.floor(Math.random() * consejos.length)];
    setConsejo(randomConsejo);
  }, []);

  if (isLoading || !avatar) {
    return null; // No mostrar nada mientras carga
  }

  return (
    <View style={styles.container}>
      {/* --- Vista previa Lottie --- */}
      <View style={styles.avatarPreview}>
        <LottieView
          source={LOTTIE_ASSETS[avatar]} // Carga la animación guardada
          autoPlay
          loop
          style={styles.lottieAvatar}
        />
      </View>
      <Text style={styles.consejo}>{consejo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fad7a0',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarPreview: {
    width: 150, // Tamaño ajustado para Lottie
    height: 150,
    marginBottom: 10,
  },
  lottieAvatar: {
    width: '100%',
    height: '100%',
  },
  consejo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});