// screens/AvatarCoach.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAvatar } from '../screens/AvatarContext';
import { AVATAR_ASSETS } from '../screens/AvatarAssets'; // Importamos las imágenes

export default function AvatarCoach() {
  const { avatar, isLoading } = useAvatar(); // 'avatar' ahora es un objeto
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
      {/* Vista previa pequeña del avatar compuesto */}
      <View style={styles.avatarPreview}>
        <Image
          source={AVATAR_ASSETS.piernas[avatar.piernas]}
          style={[styles.avatarPart, styles.piernas]}
          resizeMode="contain"
        />
        <Image
          source={AVATAR_ASSETS.torso[avatar.torso]}
          style={[styles.avatarPart, styles.torso]}
          resizeMode="contain"
        />
        <Image
          source={AVATAR_ASSETS.cabeza[avatar.cabeza]}
          style={[styles.avatarPart, styles.cabeza]}
          resizeMode="contain"
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
  // --- Estilos para la vista previa pequeña ---
  avatarPreview: {
    width: 80, // Tamaño más pequeño
    height: 140, // Ajusta esta altura
    position: 'relative',
    marginBottom: 10,
  },
  avatarPart: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  // Ajusta estos para la versión pequeña
  cabeza: { zIndex: 3, height: '30%' },
  torso: { zIndex: 2, height: '60%', top: '25%' },
  piernas: { zIndex: 1, height: '50%', top: '50%' },

  consejo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});