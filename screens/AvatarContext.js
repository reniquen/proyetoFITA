// screens/AvatarContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_KEY = 'avatar_animacion'; // Nueva clave
const defaultAvatar = 'normal'; // Ahora es un string

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
          setAvatar(value); // Guardamos el string
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

  // Función para guardar el string del avatar
  const guardarAvatar = async (nuevoAvatarString) => {
    try {
      await AsyncStorage.setItem(AVATAR_KEY, nuevoAvatarString);
      setAvatar(nuevoAvatarString);
    } catch (e) {
      console.error('Error guardando avatar en context:', e);
      throw e; 
    }
  };

  return (
    <AvatarContext.Provider value={{ avatar, guardarAvatar, isLoading }}>
      {children}
    </AvatarContext.Provider>
  );
};

// Hook personalizado
export const useAvatar = () => useContext(AvatarContext);