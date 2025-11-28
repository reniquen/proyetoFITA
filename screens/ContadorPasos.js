import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function StepCounter() {
  // ---------------- ESTADOS ----------------
  const [activo, setActivo] = useState(false); // ¿Está contando?
  const [pasos, setPasos] = useState(0);       // Número de pasos
  const [sensorListener, setSensorListener] = useState(null); // Conexión con el sensor

  // ---------------- LÓGICA DEL BOTÓN ----------------
  const toggleCronometro = () => {
    if (activo) {
      detenerConteo();
    } else {
      iniciarConteo();
    }
  };

  // ---------------- FUNCIÓN 1: INICIAR ----------------
  const iniciarConteo = async () => {
    // 1. Verificar si hay sensor
    const disponible = await Pedometer.isAvailableAsync();
    if (!disponible) {
      Alert.alert("Error", "Tu celular no tiene sensor de pasos.");
      return;
    }

    // 2. Pedir permiso
    const { status } = await Pedometer.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso denegado", "Se requiere permiso para contar pasos.");
      return;
    }

    // 3. Reiniciar contador y cambiar estado visual
    setPasos(0);
    setActivo(true);

    // 4. Conectar sensor
    try {
      const listener = Pedometer.watchStepCount(result => {
        setPasos(result.steps);
      });
      setSensorListener(listener);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No pudimos iniciar el sensor.");
    }
  }; // <--- AQUÍ TERMINA INICIAR CONTEO. Si borras esta llave, todo falla.

  // ---------------- FUNCIÓN 2: DETENER ----------------
  const detenerConteo = () => {
    setActivo(false);
    if (sensorListener) {
      sensorListener.remove();
      setSensorListener(null);
    }
  };

  // ---------------- LIMPIEZA AUTOMÁTICA ----------------
  useEffect(() => {
    // Esto se ejecuta cuando sales de la pantalla para apagar el sensor
    return () => {
      if (sensorListener) {
        sensorListener.remove();
      }
    };
  }, [sensorListener]);

  // ---------------- VISTA (DISEÑO) ----------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cronómetro de Pasos</Text>
      
      {/* Círculo de Pasos */}
      <View style={styles.counterContainer}>
        <Text style={styles.stepNumber}>{pasos}</Text>
        <Text style={styles.stepLabel}>PASOS</Text>
      </View>

      {/* Botón */}
      <TouchableOpacity 
        style={[styles.button, activo ? styles.stopBtn : styles.startBtn]} 
        onPress={toggleCronometro}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {activo ? "DETENER" : "INICIAR CAMINATA"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------------- ESTILOS ----------------
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginVertical: 10,
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495e',
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f3f4',
    borderWidth: 4,
    borderColor: '#dfe6e9',
  },
  stepNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: '#2c3e50',
  },
  stepLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: 'bold',
    marginTop: -5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: '#27ae60', // Verde
  },
  stopBtn: {
    backgroundColor: '#e74c3c', // Rojo
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});