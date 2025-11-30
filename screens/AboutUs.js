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
import { Ionicons } from '@expo/vector-icons';

export default function AboutUs({ navigation }) {
  
  const openLink = (url) => {
    if(url) {
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- HEADER ESTILO TIKTOK --- */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHeader}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Quiénes Somos</Text>
        <View style={{ width: 28 }} />
      </View>
      {/* ----------------------------- */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabecera con Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
             {/* Asegúrate de que esta ruta a tu logo sea correcta */}
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
              <Image source={require('../assets/asistente-de-ai.png')} style={styles.valueIcon} />
              <Text style={styles.valueTitle}>IA Avanzada</Text>
              <Text style={styles.valueText}>Coach inteligente 24/7.</Text>
            </View>

            <View style={[styles.valueCard, { backgroundColor: '#fef5e7' }]}>
              <Image source={require('../assets/plan-de-nutricion.png')} style={styles.valueIcon} />
              <Text style={styles.valueTitle}>Nutrición</Text>
              <Text style={styles.valueText}>Planes a tu medida.</Text>
            </View>

            <View style={[styles.valueCard, { backgroundColor: '#f4ecf7' }]}>
              <Image source={require('../assets/rutina-diaria.png')} style={styles.valueIcon} />
              <Text style={styles.valueTitle}>Rutinas</Text>
              <Text style={styles.valueText}>Progresión constante.</Text>
            </View>
        </View>

</View>





        {/* Sección: El Equipo */}
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
          
          {/* --- GRID DE BOTONES SOCIALES (Sin librerías extra) --- */}
          <View style={styles.socialGridContainer}>
            
            {/* Fila Superior */}
            <View style={styles.socialRowGroup}>
              {/* Botón 1: Instagram (Forma: Gota superior izquierda) */}
              <TouchableOpacity style={[styles.socialCard, styles.cardInstagram]}
              onPress={() => openLink('https://www.linkedin.com/in/fita-company-051161398/')}
              activeOpacity={0.7}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png' }}
                  style={[styles.socialIcon, { tintColor: '#cc39a4' }]} 
                />
              </TouchableOpacity>

              {/* Botón 2: LinkedIn (Forma: Gota superior derecha) */}
              <TouchableOpacity 
                style={[styles.socialCard, styles.cardLinkedIn]} 
                onPress={() => openLink('https://www.linkedin.com/in/fita-company-051161398/')}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/linkedin.png' }}
                  style={[styles.socialIcon, { tintColor: '#0077b5' }]} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Fila Inferior */}
            <View style={styles.socialRowGroup}>
              {/* Botón 3: GitHub (Forma: Gota inferior izquierda) */}
              <TouchableOpacity 
                style={[styles.socialCard, styles.cardGithub]} 
                onPress={() => openLink('https://github.com/reniquen')}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/github.png' }}
                  style={[styles.socialIcon, { tintColor: '#333' }]} 
                />
              </TouchableOpacity>

              {/* Botón 4: Discord (Forma: Gota inferior derecha) */}
              <TouchableOpacity style={[styles.socialCard, styles.cardDiscord]} 
              onPress={() => openLink('https://discord.gg/kWHqmTdY')}
              activeOpacity={0.7}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/discord-logo.png' }}
                  style={[styles.socialIcon, { tintColor: '#8c9eff' }]} 
                />
              </TouchableOpacity>
            </View>

          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Versión 1.0.2</Text>
          <Text style={styles.footerText}>Hecho con 💚 en React Native</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fondo blanco para cubrir la barra de estado
  },
  // --- HEADER ESTILO TIKTOK ---
  headerBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 50, // Espacio superior para bajar la barra blanca
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    zIndex: 10,
  },
  backButtonHeader: {
    padding: 5,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  // ----------------------------
  
  scrollContent: {
    backgroundColor: '#58d68d', // El verde va en el contenido
    paddingBottom: 40,
    paddingTop: 20,
    minHeight: '100%',
  },
  logoSection: {
    alignItems: 'center',
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
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  appTagline: {
    fontSize: 14,
    color: '#e8f8f5',
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
  valueTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 5,
  },
  valueText: {
    fontSize: 10,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 2,
  },
  valueIcon: {
    width: 55,
    height: 55,
    marginBottom: 8,
    resizeMode: 'contain',
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
  
  // --- ESTILOS DEL GRID SOCIAL ---
  socialGridContainer: {
    flexDirection: 'column',
    gap: 8, 
    alignItems: 'center',
    marginTop: 10,
  },
  socialRowGroup: {
    flexDirection: 'row',
    gap: 8, 
  },
  socialCard: {
    width: 80,
    height: 80,
    backgroundColor: '#FF9C59',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    // Sombra para iOS
    shadowColor: '#32325d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Radio base para todas las esquinas
    borderRadius: 6,
  },
  socialIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain'
  },
  // Formas personalizadas usando border radius nativo
  cardInstagram: {
    borderTopLeftRadius: 40,
  },
  cardLinkedIn: {
    borderTopRightRadius: 40,
  },
  cardGithub: {
    borderBottomLeftRadius: 40,
  },
  cardDiscord: {
    borderBottomRightRadius: 40,
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