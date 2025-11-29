import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Linking 
} from 'react-native';

export default function AboutUs({ navigation }) {
  
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera con Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Si tienes el logo, úsalo. Si no, usa este texto estilizado */}
             <Image source={require('../assets/ejercicios/logofita.png')} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>FITA</Text>
          <Text style={styles.appTagline}>Fitness Intelligent Training Assistant</Text>
        </View>

        {/* Sección: Nuestra Misión */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🚀 Nuestra Misión</Text>
          <Text style={styles.paragraph}>
            En FITA creemos que la tecnología y la salud deben ir de la mano. 
            Nuestra misión es democratizar el acceso a un entrenamiento personalizado 
            y una nutrición inteligente, utilizando el poder de la Inteligencia Artificial 
            para guiarte hacia tu mejor versión.
          </Text>
        </View>

        {/* Sección: ¿Qué nos hace únicos? */}
        <View style={styles.valuesContainer}>
          <View style={[styles.valueCard, { backgroundColor: '#e8f8f5' }]}>
            <Text style={styles.valueEmoji}>🤖</Text>
            <Text style={styles.valueTitle}>IA Avanzada</Text>
            <Text style={styles.valueText}>Coach inteligente 24/7.</Text>
          </View>
          <View style={[styles.valueCard, { backgroundColor: '#fef5e7' }]}>
            <Text style={styles.valueEmoji}>🥗</Text>
            <Text style={styles.valueTitle}>Nutrición</Text>
            <Text style={styles.valueText}>Planes a tu medida.</Text>
          </View>
          <View style={[styles.valueCard, { backgroundColor: '#f4ecf7' }]}>
            <Text style={styles.valueEmoji}>💪</Text>
            <Text style={styles.valueTitle}>Rutinas</Text>
            <Text style={styles.valueText}>Progresión constante.</Text>
          </View>
        </View>

        {/* Sección: El Equipo (Dev) */}
        <Text style={styles.teamHeader}>El Equipo</Text>
        <View style={styles.devCard}>
          <View style={styles.devHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>D</Text>
            </View>
            <View>
              <Text style={styles.devName}>Equipo FITA</Text>
              <Text style={styles.devRole}>Desarrollo & Innovación</Text>
            </View>
          </View>
          <Text style={styles.devBio}>
            Un equipo apasionado por el código y el deporte. Trabajamos duro para 
            que tú solo tengas que preocuparte por entrenar.
          </Text>
          
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => openLink('https://github.com')}>
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, styles.socialBtnAlt]} onPress={() => openLink('https://linkedin.com')}>
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Versión 1.0.2</Text>
          <Text style={styles.footerText}>Hecho con 💚 en React Native</Text>
          
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#58d68d', // Color principal de fondo
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    marginBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#f4f6f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  logoEmoji: {
    fontSize: 50,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2c3e50',
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'justify',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  valueCard: {
    width: '31%',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  valueEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  valueTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  valueText: {
    fontSize: 10,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 2,
  },
  teamHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  devCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    marginBottom: 30,
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  devName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  devRole: {
    fontSize: 14,
    color: '#95a5a6',
  },
  devBio: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },
  socialRow: {
    flexDirection: 'row',
  },
  socialBtn: {
    backgroundColor: '#24292e', // Github color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  socialBtnAlt: {
    backgroundColor: '#0077b5', // LinkedIn color
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 12,
    marginBottom: 5,
  },
  backButton: {
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});