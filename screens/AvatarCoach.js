// screens/AvatarCoach.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAvatar } from './AvatarContext'; // 1. Importar el Hook

export default function AvatarCoach() {
  const { avatar, isLoading } = useAvatar(); // 2. Usar el contexto
  const [consejo, setConsejo] = useState('');

  const consejos = [
    "¡No olvides hidratarte! 💧",
    "Hoy es un gran día para darlo todo 💪",
    "La constancia es más importante que la perfección 🔑",
    "Recuerda estirar antes de entrenar 🧘",
  ];

  useEffect(() => {
    // Consejo aleatorio al montar
    const randomConsejo = consejos[Math.floor(Math.random() * consejos.length)];
    setConsejo(randomConsejo);
  }, []);

  // 3. Ya NO necesitamos AsyncStorage.getItem aquí. El contexto lo maneja.

  if (isLoading) {
    return null; // No mostrar nada mientras carga
  }

  return (
    <View style={styles.container}>
      {/* 4. El avatar viene del contexto y siempre estará actualizado */}
      <Text style={styles.avatar}>{avatar}</Text>
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
  avatar: {
    fontSize: 50,
  },
  consejo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});