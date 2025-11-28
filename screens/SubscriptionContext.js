import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"; // Importamos funciones de Firestore
import { auth, db } from "./firebaseConfig"; // Importamos db

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await checkSubscription(user.uid);
      } else {
        setIsSubscribed(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Verificar estado (Leemos primero de Firebase para tener la verdad absoluta)
  const checkSubscription = async (uid) => {
    setLoading(true);
    try {
      // 1. Intentamos leer desde Firestore (La nube manda)
      const userDocRef = doc(db, "usuarios", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().isPremium === true) {
        setIsSubscribed(true);
        // Sincronizamos localmente por si acaso
        await AsyncStorage.setItem(`sub_status_${uid}`, "active");
      } else {
        // Si no es premium en la nube, revisamos local (por si no hay internet)
        const localStatus = await AsyncStorage.getItem(`sub_status_${uid}`);
        setIsSubscribed(localStatus === "active");
      }
    } catch (e) {
      console.warn("Error verificando suscripción:", e);
      // Fallback a local si falla internet
      const localStatus = await AsyncStorage.getItem(`sub_status_${uid}`);
      setIsSubscribed(localStatus === "active");
    } finally {
      setLoading(false);
    }
  };

  // ACTIVAR: Guarda en Local Y en Firebase
  const activateSubscription = async () => {
    if (!currentUser) return;

    setIsSubscribed(true);
    try {
      // 1. Guardar en Local
      await AsyncStorage.setItem(`sub_status_${currentUser.uid}`, "active");

      // 2. Guardar en Firebase (Esto es lo que te faltaba)
      const userDocRef = doc(db, "usuarios", currentUser.uid);
      
      // Usamos setDoc con merge: true por si el documento no existiera
      await setDoc(userDocRef, { 
        isPremium: true,
        fechaSuscripcion: new Date().toISOString() // Opcional: para saber cuándo pagó
      }, { merge: true });

      console.log("Suscripción guardada en Firebase y Local");

    } catch (e) {
      console.error("Error guardando suscripción en nube:", e);
      // Aunque falle la nube, mantenemos el estado local para que el usuario no pierda acceso
    }
  };

  // DESACTIVAR
  const deactivateSubscription = async () => {
    if (!currentUser) return;

    setIsSubscribed(false);
    try {
      await AsyncStorage.removeItem(`sub_status_${currentUser.uid}`);
      
      // Actualizamos Firebase
      const userDocRef = doc(db, "usuarios", currentUser.uid);
      await updateDoc(userDocRef, { isPremium: false });
      
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