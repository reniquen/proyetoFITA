import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_KEY = 'avatar_animacion';

// --- CORRECCIÓN AQUÍ ---
// Cambiamos 'normal' por 'avatar1' (o cualquiera que exista en AvatarAssets.js)
const defaultAvatar = 'avatar1'; 
// -----------------------

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isLoading, setIsLoading] = useState(true);

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

  const guardarAvatar = async (nuevoAvatarString) => {
    try {
      await AsyncStorage.setItem(AVATAR_KEY, nuevoAvatarString);
      setAvatar(nuevoAvatarString);
    } catch (e) {
      console.error('Error guardando avatar en context:', e);
      throw e;
    }
  };

  // NOTA: He simplificado un poco el loading para que sea solo el indicador,
  // ya que el texto "Cargando avatar..." a veces se ve raro si es muy rápido.
  if (isLoading) {
    // Si prefieres puedes devolver null para que no se vea nada mientras carga
    // return null; 
    
    // O mantener el indicador centrado:
    return (
       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <ActivityIndicator size="large" color="#4CAF50" />
       </View>
    );
  }

  return (
    <AvatarContext.Provider value={{ avatar, guardarAvatar, isLoading }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);