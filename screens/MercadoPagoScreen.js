import React from "react";
import { View, Text, Button } from "react-native";
import { useSubscription } from "./SubscriptionContext";

const PUBLIC_KEY = "TU_PUBLIC_KEY_MERCADO_PAGO";

export default function MercadoPagoScreen({ navigation }) {
    const { activateSubscription } = useSubscription();

    const startPayment = async () => {
        try {
            const result = await MercadoPagoCheckout.startCheckout({
                publicKey: PUBLIC_KEY,
                preferenceId: "TU_PREFERENCE_ID_GENERADA_DESDE_BACKEND"
            });

            if (result.status === "approved") {
                activateSubscription();
                navigation.goBack();
            } else {
                alert("Pago no completado");
            }
        } catch (err) {
            console.log("Error Mercado Pago:", err);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
                Suscripción Premium FITA
            </Text>

            <Text style={{ marginBottom: 20 }}>
                Accede al chatbot ilimitado por solo $2.990 CLP al mes.
            </Text>

            <Button title="Pagar con Mercado Pago" onPress={startPayment} />
        </View>
    );
}
