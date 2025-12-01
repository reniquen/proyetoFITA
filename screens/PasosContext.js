import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';

const StepContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // Muestra la alerta visual
    shouldPlaySound: false, // Sin sonido para no molestar
    shouldSetBadge: false,
  }),
});

export function useStep() {
  return useContext(StepContext);
}

export function StepProvider({ children }) {
  // --- ESTADOS GLOBALES ---
  const [activo, setActivo] = useState(false);
  const [pasos, setPasos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [historial, setHistorial] = useState([]);

  // Referencias internas
  const pasosRef = useRef(0);
  const sensorListener = useRef(null);

  // --- CONFIGURACIÓN ---
  const NOTIFICATION_ID = 'fita-tracker';
  const KCAL_POR_PASO = 0.04;
  const METROS_POR_PASO = 0.76;

  // --- HELPERS ---
  const formatearTiempo = (totalSegundos) => {
    const minutos = Math.floor(totalSegundos / 60);
    const segs = totalSegundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
  };

  const obtenerHoraActual = () => {
    const fecha = new Date();
    return `${fecha.getHours()}:${fecha.getMinutes() < 10 ? '0' : ''}${fecha.getMinutes()}`;
  };

  // --- NOTIFICACIONES ---
  const actualizarNotificacion = async (pasosActuales) => {
    const dist = ((pasosActuales * METROS_POR_PASO) / 1000).toFixed(2);
    
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "FITA: Caminata Activa 🏃",
        body: `Pasos: ${pasosActuales}  |  Distancia: ${dist} km`,
        sticky: true,
        autoDismiss: false,
        color: '#27ae60',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: null, 
      },
      trigger: null,
    });
  };

  const borrarNotificacion = async () => {
    await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
  };

  // --- CRONÓMETRO GLOBAL ---
  useEffect(() => {
    let intervalo = null;
    if (activo) {
      intervalo = setInterval(() => {
        setSegundos((s) => s + 1);
        // Actualizamos la notificación con el valor ACTUALIZADO
        actualizarNotificacion(pasosRef.current);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [activo]);

  // --- FUNCIONES DE CONTROL ---
  const iniciarConteo = async () => {
    const disponible = await Pedometer.isAvailableAsync();
    if (!disponible) return Alert.alert("Error", "Sensor no disponible.");

    // Pedimos permisos de nuevo por seguridad
    const { status } = await Pedometer.requestPermissionsAsync();
    const notifStatus = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') return Alert.alert("Permiso denegado", "Se requiere permiso.");

    setPasos(0);
    setSegundos(0);
    pasosRef.current = 0;
    setActivo(true);
    
    actualizarNotificacion(0);

    try {
      sensorListener.current = Pedometer.watchStepCount(result => {
        setPasos(result.steps);
        pasosRef.current = result.steps;
      });
    } catch (error) {
      Alert.alert("Error", "No pudimos iniciar el sensor.");
    }
  };

  const detenerConteo = () => {
    setActivo(false);
    borrarNotificacion(); 

    if (sensorListener.current) {
      sensorListener.current.remove();
      sensorListener.current = null;
    }

    if (pasos > 0 || segundos > 0) {
      const nuevaSesion = {
        id: Date.now().toString(),
        hora: obtenerHoraActual(),
        tiempo: formatearTiempo(segundos),
        pasos: pasos,
        kcal: (pasos * KCAL_POR_PASO).toFixed(1),
        km: ((pasos * METROS_POR_PASO) / 1000).toFixed(2)
      };
      setHistorial([nuevaSesion, ...historial]);
    }
  };

  const toggleCronometro = () => {
    if (activo) detenerConteo();
    else iniciarConteo();
  };

  return (
    <StepContext.Provider value={{
      activo,
      pasos,
      segundos,
      historial,
      toggleCronometro,
      formatearTiempo,
      KCAL_POR_PASO,
      METROS_POR_PASO
    }}>
      {children}
    </StepContext.Provider>
  );
}