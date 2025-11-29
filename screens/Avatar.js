import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useAvatar } from './AvatarContext';
import { LOTTIE_ASSETS, avatarOpciones } from './AvatarAssets';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// --- PALETA "VIBRANT FITA" ---
const COLORS = {
  background: '#F2F5ED',
  cardBg: '#FFFFFF',
  primary: '#4CAF50',
  secondary: '#8BC34A',
  accent: '#FFC107',
  textDark: '#263238',
  textMedium: '#546E7A',
  textLight: '#B0BEC5', // Usaremos este gris para el botón desactivado
  shadow: '#263238',
  success: '#4CAF50',
};

export default function Avatar({ navigation }) {
  const { avatar: avatarActual, guardarAvatar, isLoading } = useAvatar();
  const [selection, setSelection] = useState(avatarActual);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!avatarActual && avatarOpciones.length > 0) {
      setSelection(avatarOpciones[0]);
    } else if (!isLoading && avatarActual) {
      setSelection(avatarActual);
    }
  }, [avatarActual, isLoading]);

  // --- LÓGICA PARA DESACTIVAR EL BOTÓN ---
  // El botón está desactivado si:
  // 1. Está cargando datos iniciales.
  // 2. O la selección actual es IGUAL al avatar que ya tiene guardado.
  const isButtonDisabled = isLoading || selection === avatarActual;

  const handleGuardar = async () => {
    // Doble verificación de seguridad
    if (isButtonDisabled) return;

    try {
      await guardarAvatar(selection);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar tu avatar.');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LottieView
          source={LOTTIE_ASSETS[selection] || Object.values(LOTTIE_ASSETS)[0]}
          autoPlay loop style={{ width: 100, height: 100, opacity: 0.5 }}
        />
        <Text style={styles.loadingText}>Cargando tu estilo...</Text>
      </View>
    );
  }

  const renderAvatarOption = ({ item }) => {
    const isSelected = item === selection;
    // Si el avatar actual es el mismo que este item, mostramos que es el "Actual"
    const isCurrentAvatar = item === avatarActual;

    return (
      <TouchableOpacity
        style={styles.optionWrapper}
        onPress={() => setSelection(item)}
        activeOpacity={0.8}
      >
        <View style={[
          styles.optionCircle,
          isSelected && styles.optionCircleSelected,
          isCurrentAvatar && styles.optionCircleCurrent // Estilo extra si es el actual
        ]}>
          <LottieView
            key={item}
            source={LOTTIE_ASSETS[item]}
            autoPlay={true} 
            loop={true}
            style={styles.miniLottie}
            resizeMode="cover"
          />
          {isSelected && (
            <View style={styles.checkMarkContainer}>
              <Icon name="check-circle" size={24} color={COLORS.accent} />
            </View>
          )}
        </View>
        <Text style={[
          styles.optionLabel,
          isSelected && styles.optionLabelSelected
        ]}>
          {item} {isCurrentAvatar && "(Actual)"} 
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.topNavContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={28} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.titulo}>Personaliza tu Coach</Text>
          <Text style={styles.subtituloHeader}>Elige el compañero que te motivará cada día!.</Text>
        </View>

        <View style={styles.previewSection}>
          <View style={styles.pedestalContainer}>
            <View style={styles.pedestalCircleOuter}>
              <View style={styles.pedestalCircleInner}>
                <LottieView
                  key={selection}
                  source={LOTTIE_ASSETS[selection]}
                  autoPlay
                  loop
                  style={styles.mainLottiePreview}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={styles.pedestalShadow} />
          </View>
        </View>

        <View style={styles.selectorContainerCard}>
          <Text style={styles.selectorTitle}>Elige tu estilo</Text>
          <FlatList
            data={avatarOpciones}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={renderAvatarOption}
            contentContainerStyle={styles.listaContent}
          />
        </View>

        <View style={styles.footer}>
          {/* BOTÓN GUARDAR CON LÓGICA DE DESACTIVADO */}
          <TouchableOpacity 
            style={[
              styles.botonGuardar,
              isButtonDisabled && styles.botonGuardarDisabled // Aplica estilo si está desactivado
            ]}
            onPress={handleGuardar}
            activeOpacity={0.9}
            disabled={isButtonDisabled} // Desactiva la interacción táctil
          >
            <Text style={styles.botonTexto}>
              {isButtonDisabled ? "Avatar Actual" : "Confirmar Nuevo Avatar"}
            </Text>
             {/* Solo muestra el icono si el botón está activo */}
            {!isButtonDisabled && (
               <Icon name="arrow-right-circle" size={24} color="#FFF" style={{ marginLeft: 10 }} />
            )}
          </TouchableOpacity>
          
          {guardado && (
            <View style={styles.guardadoContainer}>
              <Icon name="check-decagram" size={28} color={COLORS.success} style={{ marginRight: 8 }} />
              <Text style={styles.guardadoTexto}>¡Estilo guardado con éxito!</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.textMedium,
    fontWeight: '600',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  // --- NAV SUPERIOR ---
  topNavContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: COLORS.cardBg,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // --- HEADERS ---
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtituloHeader: {
    fontSize: 16,
    color: COLORS.textMedium,
    textAlign: 'center',
    maxWidth: '80%',
  },

  // --- PREVISUALIZACIÓN (PEDESTAL) ---
  previewSection: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  pedestalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pedestalCircleOuter: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: COLORS.primary,
    elevation: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    zIndex: 2,
  },
  pedestalCircleInner: {
    width: '92%',
    height: '92%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  mainLottiePreview: {
    width: '110%',
    height: '110%',
  },
  pedestalShadow: {
    position: 'absolute',
    bottom: -20,
    width: width * 0.5,
    height: 30,
    borderRadius: 100,
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    transform: [{ scaleX: 1.5 }],
    zIndex: 1,
  },

  // --- SELECTOR VISUAL (TARJETA) ---
  selectorContainerCard: {
    backgroundColor: COLORS.cardBg,
    width: '100%',
    borderRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listaContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  optionWrapper: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  optionCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  optionCircleSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#FFF',
    elevation: 6,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    transform: [{ scale: 1.05 }],
  },
  // Nuevo estilo sutil para indicar cuál es el actual aunque no esté seleccionado
  optionCircleCurrent: {
     borderColor: COLORS.primary, // Borde verde si es el actual
  },
  miniLottie: {
    width: '90%',
    height: '90%',
  },
  checkMarkContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMedium,
    textTransform: 'capitalize',
  },
  optionLabelSelected: {
    color: COLORS.textDark,
    fontWeight: '800',
  },

  // --- FOOTER ---
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  botonGuardar: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // --- NUEVO ESTILO PARA EL BOTÓN DESACTIVADO ---
  botonGuardarDisabled: {
    backgroundColor: COLORS.textLight, // Color grisáceo
    elevation: 0, // Sin sombra
    shadowOpacity: 0,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  guardadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  guardadoTexto: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '700',
  },
});