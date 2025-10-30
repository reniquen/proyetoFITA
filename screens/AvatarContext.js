// contexts/AvatarContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_KEY = 'avatar';
const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState('🤖');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar avatar guardado al iniciar la app
  useEffect(() => {
    const cargarAvatar = async () => {
      try {
        const value = await AsyncStorage.getItem(AVATAR_KEY);
        if (value) {
          setAvatar(value);
        }
      } catch (e) {
        console.error('Error cargando avatar desde context:', e);
      } finally {
        setIsLoading(false);
      }
    };
    cargarAvatar();
  }, []);

  // Función para guardar y actualizar el estado en toda la app
  const guardarAvatar = async (nuevoAvatar) => {
    try {
      await AsyncStorage.setItem(AVATAR_KEY, nuevoAvatar);
      setAvatar(nuevoAvatar); // Actualiza el estado global
    } catch (e) {
      console.error('Error guardando avatar en context:', e);
      throw e; // Propagamos el error por si la pantalla Avatar lo necesita
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