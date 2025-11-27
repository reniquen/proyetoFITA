// screens/AvatarContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_KEY = 'avatar_animacion';
const defaultAvatar = 'normal';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar avatar guardado
  useEffect(() => {
    const cargarAvatar = async () => {
      try {
        const value = await AsyncStorage.getItem(AVATAR_KEY);
        if (value) {
          setAvatar(value);
        } else {
          setAvatar(defaultAvatar);
        }
      } catch (e) {
        console.error('Error cargando avatar desde context:', e);
        setAvatar(defaultAvatar);
      } finally {
        setIsLoading(false);
      }
    };
    cargarAvatar();
  }, []);

  // Guardar avatar
  const guardarAvatar = async (nuevoAvatarString) => {
    try {
      await AsyncStorage.setItem(AVATAR_KEY, nuevoAvatarString);
      setAvatar(nuevoAvatarString);
    } catch (e) {
      console.error('Error guardando avatar en context:', e);
      throw e;
    }
  };

  // Mientras carga, muestra un pequeño indicador visual
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: '#333' }}>Cargando avatar...</Text>
      </View>
    );
  }

  return (
    <AvatarContext.Provider value={{ avatar, guardarAvatar, isLoading }}>
      {children}
    </AvatarContext.Provider>
  );
};

// Hook personalizado
export const useAvatar = () => useContext(AvatarContext);
