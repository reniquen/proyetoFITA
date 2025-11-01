// contexts/AvatarContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// El avatar por defecto ahora es un objeto
const AVATAR_KEY = 'avatar_objeto';
const defaultAvatar = {
  cabeza: 'normal',
  torso: 'normal',
  piernas: 'normal',
};

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar avatar guardado al iniciar la app
  useEffect(() => {
    const cargarAvatar = async () => {
      try {
        const value = await AsyncStorage.getItem(AVATAR_KEY);
        if (value) {
          setAvatar(JSON.parse(value)); // Parseamos el objeto JSON
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

  // Función para guardar y actualizar el estado en toda la app
  const guardarAvatar = async (nuevoAvatar) => {
    try {
      await AsyncStorage.setItem(AVATAR_KEY, JSON.stringify(nuevoAvatar)); // Guardamos como string
      setAvatar(nuevoAvatar); // Actualiza el estado global
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

// Hook personalizado para consumir el contexto fácilmente
export const useAvatar = () => useContext(AvatarContext);