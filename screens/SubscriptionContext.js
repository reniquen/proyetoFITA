// ./screens/SubscriptionContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const SUB_KEY = "fita_subscription_active_v1";
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem(SUB_KEY);
        setIsSubscribed(s === "active");
      } catch (e) {
        console.warn("Error cargando subs:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activateSubscription = async () => {
    setIsSubscribed(true);
    try {
      await AsyncStorage.setItem(SUB_KEY, "active");
    } catch (e) {
      console.warn("Error guardando subs:", e);
    }
  };

  const deactivateSubscription = async () => {
    setIsSubscribed(false);
    try {
      await AsyncStorage.removeItem(SUB_KEY);
    } catch (e) {
      console.warn("Error removiendo subs:", e);
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
