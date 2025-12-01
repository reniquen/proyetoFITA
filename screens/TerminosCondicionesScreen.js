import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const COLORS = {
  headerBg: '#4CAF50',
  background: '#FFFFFF',
  textDark: '#263238',
  textMedium: '#546E7A',
  accent: '#FFC107',
};

export default function TerminosCondicionesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.headerBg} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdate}>Última actualización: 30 de Noviembre, 2025</Text>

        <Text style={styles.sectionTitle}>1. Introducción</Text>
        <Text style={styles.paragraph}>
          Bienvenido a FITA. Al acceder y utilizar nuestra aplicación móvil, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no deberás utilizar nuestros servicios.
        </Text>

        <Text style={styles.sectionTitle}>2. Servicios de Suscripción</Text>
        <Text style={styles.paragraph}>
          FITA ofrece planes de suscripción (Mensual, Trimestral y Anual) que otorgan acceso a funcionalidades premium como el Coach IA y planes dietéticos personalizados.
          {"\n\n"}
          • El pago se cargará a través de la plataforma de Mercado Pago.
          {"\n"}
          • Las suscripciones no son reembolsables por periodos parciales no utilizados.
        </Text>

        <Text style={styles.sectionTitle}>3. Responsabilidad Médica</Text>
        <Text style={styles.paragraph}>
          FITA y su Coach IA proporcionan sugerencias basadas en algoritmos generales. No somos médicos ni nutricionistas clínicos.
          {"\n\n"}
          <Text style={{fontWeight: 'bold'}}>IMPORTANTE:</Text> Consulta siempre a un profesional de la salud antes de comenzar cualquier dieta o régimen de ejercicio. El uso de la información proporcionada por FITA es bajo tu propio riesgo.
        </Text>

        <Text style={styles.sectionTitle}>4. Privacidad de Datos</Text>
        <Text style={styles.paragraph}>
          Respetamos tu privacidad. Tus datos de salud, edad, peso y conversaciones con el Coach IA se almacenan de forma segura y no se comparten con terceros sin tu consentimiento explícito, salvo requerimiento legal.
        </Text>

        <Text style={styles.sectionTitle}>5. Cancelaciones</Text>
        <Text style={styles.paragraph}>
          Puedes cancelar tu suscripción en cualquier momento. La cancelación se hará efectiva al finalizar el periodo de facturación actual.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>FITA App - Chile 🇨🇱</Text>
        </View>
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.headerBg,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
  
  content: { padding: 25 },
  lastUpdate: { fontSize: 12, color: COLORS.textMedium, marginBottom: 20, fontStyle: 'italic' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginTop: 15, marginBottom: 10 },
  paragraph: { fontSize: 15, color: COLORS.textMedium, lineHeight: 22, textAlign: 'justify' },
  
  footer: { marginTop: 40, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEEEEE', paddingTop: 20 },
  footerText: { color: '#B0BEC5', fontWeight: 'bold' }
});