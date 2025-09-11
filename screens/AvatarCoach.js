import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AvatarCoach() {
  const [avatar, setAvatar] = useState('🤖');
  const [consejo, setConsejo] = useState('');

  const consejos = [
    "¡No olvides hidratarte! 💧",
    "Hoy es un gran día para darlo todo 💪",
    "La constancia es más importante que la perfección 🔑",
    "Recuerda estirar antes de entrenar 🧘",
  ];

  useEffect(() => {
    // cargar avatar guardado
    AsyncStorage.getItem('avatar').then((value) => {
      if (value) setAvatar(value);
    });

    // consejo aleatorio
    const randomConsejo = consejos[Math.floor(Math.random() * consejos.length)];
    setConsejo(randomConsejo);
  }, []);

  return (
    <View style={styles.container}>
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

