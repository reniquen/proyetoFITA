// ./screens/SubscriptionContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Asegúrate de importar auth

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Escuchar cambios de usuario (Login/Logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Si hay usuario, verificamos SU suscripción específica
        await checkSubscription(user.uid);
      } else {
        // Si no hay usuario, reseteamos todo
        setIsSubscribed(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función auxiliar para leer la key única del usuario
  const checkSubscription = async (uid) => {
    setLoading(true);
    try {
      // Usamos el UID en la key para que sea única por cuenta
      const key = `sub_status_${uid}`; 
      const storedValue = await AsyncStorage.getItem(key);
      
      if (storedValue === "active") {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (e) {
      console.warn("Error leyendo suscripción:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Activar suscripción (Botón Dev o Pago)
  const activateSubscription = async () => {
    if (!currentUser) return; // Seguridad: no activar si no hay usuario logueado

    setIsSubscribed(true);
    try {
      const key = `sub_status_${currentUser.uid}`;
      await AsyncStorage.setItem(key, "active");
      console.log(`Suscripción activada localmente para: ${currentUser.email}`);
    } catch (e) {
      console.warn("Error guardando suscripción:", e);
    }
  };

  // 3. Desactivar suscripción
  const deactivateSubscription = async () => {
    if (!currentUser) return;

    setIsSubscribed(false);
    try {
      const key = `sub_status_${currentUser.uid}`;
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn("Error removiendo suscripción:", e);
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      isSubscribed,
      loadingSubscription: loading,
      activateSubscription,
      deactivateSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);