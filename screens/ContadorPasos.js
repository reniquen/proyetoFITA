import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Importamos los iconos

export default function StepCounter() {
  const navigation = useNavigation();
  
  // --- Estados ---
  const [activo, setActivo] = useState(false);
  const [pasos, setPasos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [sensorListener, setSensorListener] = useState(null);

  // --- Constantes y Cálculos ---
  const KCAL_POR_PASO = 0.04;
  const METROS_POR_PASO = 0.76;

  const calorias = (pasos * KCAL_POR_PASO).toFixed(1);
  const distanciaKm = ((pasos * METROS_POR_PASO) / 1000).toFixed(2);

  // --- Formato de Tiempo (MM:SS) ---
  const formatearTiempo = (totalSegundos) => {
    const minutos = Math.floor(totalSegundos / 60);
    const segs = totalSegundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
  };

  // --- Efecto del Cronómetro ---
  useEffect(() => {
    let intervalo = null;
    if (activo) {
      intervalo = setInterval(() => {
        setSegundos((seg) => seg + 1);
      }, 1000);
    } else if (!activo && segundos !== 0) {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [activo, segundos]);

  // --- Lógica de Sensores ---
  const toggleCronometro = () => {
    if (activo) {
      detenerConteo();
    } else {
      iniciarConteo();
    }
  };

  const iniciarConteo = async () => {
    const disponible = await Pedometer.isAvailableAsync();
    if (!disponible) return Alert.alert("Error", "Sensor no disponible.");

    const { status } = await Pedometer.requestPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Permiso denegado", "Se requiere permiso.");

    setPasos(0);
    setSegundos(0);
    setActivo(true);

    try {
      const listener = Pedometer.watchStepCount(result => {
        setPasos(result.steps);
      });
      setSensorListener(listener);
    } catch (error) {
      Alert.alert("Error", "No pudimos iniciar el sensor.");
    }
  };

  const detenerConteo = () => {
    setActivo(false);
    if (sensorListener) {
      sensorListener.remove();
      setSensorListener(null);
    }
  };

  // Limpieza al salir
  useEffect(() => {
    return () => {
      if (sensorListener) sensorListener.remove();
    };
  }, [sensorListener]);

  // ---------------- VISTA ----------------
  return (
    <View style={styles.mainContainer}>
      
      {/* Header estilo TikTok (Flecha limpia) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.screenTitle}>Entrenamiento</Text>
        
        {/* View vacía para equilibrar el espacio y que el título quede centrado */}
        <View style={{ width: 28 }} />
      </View>

      {/* 1. CRONÓMETRO GIGANTE */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatearTiempo(segundos)}</Text>
        <Text style={styles.timerLabel}>TIEMPO TOTAL</Text>
      </View>

      {/* 2. CÍRCULO PRINCIPAL (PASOS) */}
      <View style={styles.stepsCircle}>
        <View style={styles.innerCircle}>
          <Text style={styles.stepNumber}>{pasos}</Text>
          <Text style={styles.stepLabel}>PASOS</Text>
        </View>
      </View>

      {/* 3. DATOS SECUNDARIOS (Calorías y Distancia) */}
      <View style={styles.statsRow}>
        
        {/* Tarjeta Calorías */}
        <View style={[styles.statCard, styles.cardOrange]}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={[styles.statValue, { color: '#e67e22' }]}>{calorias}</Text>
          <Text style={styles.statLabel}>Kcal</Text>
        </View>

        {/* Tarjeta Distancia */}
        <View style={[styles.statCard, styles.cardBlue]}>
          <Text style={styles.statIcon}>📏</Text>
          <Text style={[styles.statValue, { color: '#3498db' }]}>{distanciaKm}</Text>
          <Text style={styles.statLabel}>Km</Text>
        </View>

      </View>

      {/* BOTÓN DE ACCIÓN */}
      <TouchableOpacity 
        style={[styles.button, activo ? styles.stopBtn : styles.startBtn]} 
        onPress={toggleCronometro}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {activo ? "DETENER SESIÓN" : "INICIAR CAMINATA"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 50, // Espacio seguro para la barra de estado
    alignItems: 'center',
  },
  // --- HEADER ESTILO TIKTOK ---
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 5, // Aumenta el área táctil sin poner fondo
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  // --- CRONÓMETRO ---
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#34495e',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  // --- CÍRCULO PASOS ---
  stepsCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  stepNumber: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  stepLabel: {
    fontSize: 14,
    color: '#95a5a6',
    fontWeight: 'bold',
  },
  // --- FILA DE ESTADÍSTICAS ---
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    borderBottomWidth: 4,
  },
  cardOrange: {
    borderBottomColor: '#e67e22',
  },
  cardBlue: {
    borderBottomColor: '#3498db',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  // --- BOTONES ---
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: '#2c3e50',
  },
  stopBtn: {
    backgroundColor: '#c0392b',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});