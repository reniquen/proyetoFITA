// ./screens/SuscripcionScreen.js
import React, { useState, useRef } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useSubscription } from "./SubscriptionContext";
import { auth } from "./firebaseConfig";

// Cambia esta URL por la de tu backend (ver backend más abajo)
const BACKEND_PREF_URL = "https://mpago.la/1JEuUNy";

export default function SuscripcionScreen({ navigation }) {
  const { activateSubscription } = useSubscription();
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef(null);

  // opcional: pasar uid para que el backend actualice Firestore
  const uid = auth.currentUser?.uid || "";

  const paymentUrl = `${BACKEND_PREF_URL}?uid=${uid}&amount=2990&desc=Suscripcion+Chatbot`;

  const onNavigationStateChange = (navState) => {
    const { url } = navState;

    // Tu backend redirige a /pago_exitoso o /pago_cancelado en PUBLIC_BASE_URL
    if (url.includes("/pago_exitoso")) {
      activateSubscription();
      Alert.alert("¡Pago confirmado!", "Tu suscripción está activa.");
      navigation.replace("AvatarChat");
    }

    if (url.includes("/pago_cancelado")) {
      Alert.alert("Pago cancelado", "No se completó el pago.");
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      <WebView
        ref={webviewRef}
        source={{ uri: paymentUrl }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={onNavigationStateChange}
        startInLoadingState
      />
    </View>
  );
}
