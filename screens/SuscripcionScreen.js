import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from "react-native";
import { WebView } from "react-native-webview";
import { useSubscription } from "./SubscriptionContext";
import { auth } from "./firebaseConfig";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const PLAN_LINKS = {
  mensual: "https://mpago.la/2natAfL",   // $5.000
  trimestral: "https://mpago.la/2natAfL", // $12.000
  anual: "https://mpago.la/1JEuUNy"        // $29.000
};


const COLORS = {
  background: '#F2F5ED',
  primary: '#4CAF50',
  secondary: '#8BC34A',
  accent: '#FFC107',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#FFFFFF',
  cardBg: '#FFFFFF',
  danger: '#E53935'
};

export default function SuscripcionScreen({ navigation }) {
  const { activateSubscription } = useSubscription();
  const [selectedPlanUrl, setSelectedPlanUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef(null);

  const uid = auth.currentUser?.uid || "anonimo";

 
  const getPaymentUrl = (baseUrl) => {
    
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}external_reference=${uid}`; 
  };

  const onNavigationStateChange = (navState) => {
    const { url } = navState;

    if (url.includes("/pago_exitoso") || url.includes("approved")) {
      activateSubscription();
      Alert.alert("¡Bienvenido a Premium!", "Tu suscripción se ha activado correctamente.");
      navigation.replace("AvatarChat");
    }

    if (url.includes("/pago_cancelado") || url.includes("failure")) {
      Alert.alert("Pago cancelado", "No se completó el proceso.");
      setSelectedPlanUrl(null); 
    }
  };

  const handleSelectPlan = (planType) => {
    const baseUrl = PLAN_LINKS[planType];
    const finalUrl = getPaymentUrl(baseUrl);
    setSelectedPlanUrl(finalUrl);
    setLoading(true);
  };

  
  if (selectedPlanUrl) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={styles.headerSimple}>
          <TouchableOpacity onPress={() => setSelectedPlanUrl(null)} style={styles.backButtonSimple}>
            <Icon name="arrow-left" size={24} color={COLORS.textLight} />
            <Text style={styles.backTextSimple}>Volver a planes</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitleSimple}>Procesando Pago</Text>
        </View>
        
        {loading && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />}
        
        <WebView
          ref={webviewRef}
          source={{ uri: selectedPlanUrl }}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={onNavigationStateChange}
          startInLoadingState={true}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  // --- RENDERIZADO DE LA PANTALLA DE SELECCIÓN (LANDING) ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      
     
      <TouchableOpacity 
        style={styles.floatingBackButton} 
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={24} color={COLORS.textDark} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroSection}>
          <Icon name="crown" size={60} color={COLORS.accent} />
          <Text style={styles.heroTitle}>FITA Premium</Text>
          <Text style={styles.heroSubtitle}>Desbloquea tu Coach IA, dietas personalizadas y rutinas ilimitadas.</Text>
        </View>

        <View style={styles.plansContainer}>
          
         
          <TouchableOpacity style={styles.planCard} activeOpacity={0.9} onPress={() => handleSelectPlan('mensual')}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Mensual</Text>
              <Text style={styles.planPrice}>$5.000 <Text style={styles.currency}>CLP/mes</Text></Text>
            </View>
            <View style={styles.planFeatures}>
              <Text style={styles.featureText}>• Acceso total al Coach IA</Text>
              <Text style={styles.featureText}>• Cancelación en cualquier momento</Text>
            </View>
            <View style={styles.buttonAction}>
              <Text style={styles.buttonText}>Elegir Mensual</Text>
            </View>
          </TouchableOpacity>

         
          <TouchableOpacity style={[styles.planCard, styles.planCardPopular]} activeOpacity={0.9} onPress={() => handleSelectPlan('trimestral')}>
            <View style={styles.badgePopular}>
              <Text style={styles.badgeText}>MÁS POPULAR</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>3 Meses</Text>
              <View style={styles.priceRow}>
                <Text style={styles.oldPrice}>$15.000</Text>
                <Text style={styles.planPrice}>$12.000 <Text style={styles.currency}>CLP</Text></Text>
              </View>
              <Text style={styles.savingsText}>Ahorras $3.000</Text>
            </View>
            <View style={styles.planFeatures}>
              <Text style={styles.featureText}>• Todo lo incluido en Mensual</Text>
              <Text style={styles.featureText}>• Compromiso trimestral</Text>
            </View>
            <View style={[styles.buttonAction, styles.buttonActionPopular]}>
              <Text style={[styles.buttonText, {color: COLORS.textDark}]}>Elegir Trimestral</Text>
            </View>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.planCard} activeOpacity={0.9} onPress={() => handleSelectPlan('anual')}>
            <View style={styles.badgeBestValue}>
              <Text style={styles.badgeText}>MEJOR PRECIO</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>1 Año</Text>
              <View style={styles.priceRow}>
                <Text style={styles.oldPrice}>$60.000</Text>
                <Text style={styles.planPrice}>$29.000 <Text style={styles.currency}>CLP</Text></Text>
              </View>
              <Text style={styles.savingsText}>¡Más de 50% OFF!</Text>
            </View>
            <View style={styles.planFeatures}>
              <Text style={styles.featureText}>• Pago único anual</Text>
              <Text style={styles.featureText}>• Ideal para transformar tu vida</Text>
            </View>
            <View style={styles.buttonAction}>
              <Text style={styles.buttonText}>Elegir Anual</Text>
            </View>
          </TouchableOpacity>

        </View>

        <TouchableOpacity 
          style={styles.termsButton}
          onPress={() => navigation.navigate('TerminosCondiciones')}
        >
          <Text style={styles.termsButtonText}>Ver Términos y Condiciones</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Al suscribirte, aceptas nuestros términos de servicio. La suscripción se renueva automáticamente a menos que se cancele.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  headerSimple: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, padding: 15 },
  backButtonSimple: { flexDirection: 'row', alignItems: 'center' },
  backTextSimple: { color: COLORS.textLight, marginLeft: 5, fontSize: 16 },
  headerTitleSimple: { color: COLORS.textLight, fontSize: 18, fontWeight: 'bold', marginLeft: 20 },
  loader: { marginTop: 20 },

  
  floatingBackButton: { position: 'absolute', top: 15, left: 15, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.05)', padding: 8, borderRadius: 20 },
  
  heroSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.textDark, marginTop: 10 },
  heroSubtitle: { fontSize: 16, color: COLORS.textMedium, textAlign: 'center', marginTop: 5, paddingHorizontal: 20 },

  plansContainer: { gap: 20 },
  
  planCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative'
  },
  planCardPopular: {
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: '#FFFDF5',
  },
  
  badgePopular: {
    position: 'absolute', top: -12, right: 20, backgroundColor: COLORS.accent, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10
  },
  badgeBestValue: {
    position: 'absolute', top: -12, right: 20, backgroundColor: COLORS.primary, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: COLORS.textDark },

  planHeader: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15 },
  planTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 5 },
  oldPrice: { textDecorationLine: 'line-through', color: COLORS.textMedium, fontSize: 14, marginRight: 8 },
  planPrice: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  currency: { fontSize: 14, color: COLORS.textMedium, fontWeight: 'normal' },
  savingsText: { color: COLORS.danger, fontSize: 12, fontWeight: 'bold', marginTop: 2 },

  planFeatures: { marginBottom: 20 },
  featureText: { fontSize: 14, color: COLORS.textMedium, marginBottom: 5 },

  buttonAction: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonActionPopular: {
    backgroundColor: COLORS.accent,
  },
  buttonText: { color: COLORS.textLight, fontWeight: 'bold', fontSize: 16 },

  termsButton: { marginTop: 30, alignSelf: 'center', padding: 10 },
  termsButtonText: { color: COLORS.primary, textDecorationLine: 'underline', fontSize: 14 },
  
  disclaimer: { marginTop: 10, textAlign: 'center', color: COLORS.textMedium, fontSize: 11, paddingHorizontal: 20 }
});