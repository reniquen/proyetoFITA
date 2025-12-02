import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';

const StepContext = createContext();

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useStep() {
  return useContext(StepContext);
}

export function StepProvider({ children }) {
  // --- ESTADOS ---
  const [activo, setActivo] = useState(false);
  const [pasos, setPasos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [caloriasExtra, setCaloriasExtra] = useState(0);

  // Referencias
  const pasosRef = useRef(0);
  const sensorListener = useRef(null);

  // Constantes
  const NOTIFICATION_ID = 'fita-tracker';
  const KCAL_POR_PASO = 0.04;
  const METROS_POR_PASO = 0.76;

  // --- 1. LIMPIEZA INICIAL (ESTO ARREGLA LOS DATOS FANTASMA) ---
  useEffect(() => {
    const limpiarTodo = async () => {
      setPasos(0);
      setSegundos(0);
      setActivo(false);
      pasosRef.current = 0;
      // Borramos cualquier notificación que se haya quedado pegada de antes
      await Notifications.dismissAllNotificationsAsync();
    };
    limpiarTodo();
  }, []);

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

  const agregarCaloriasExtra = (kcal) => {
    setCaloriasExtra((prev) => prev + kcal);
  };

  // --- NOTIFICACIONES ---
  const actualizarNotificacion = async (pasosActuales) => {
    const dist = ((pasosActuales * METROS_POR_PASO) / 1000).toFixed(2);
    
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "FITA: Caminata Activa 🏃",
        body: `Pasos: ${pasosActuales}  |  Distancia: ${dist} km`,
        sticky: true, // Pegajosa mientras corre
        autoDismiss: false,
        color: '#27ae60',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: null, 
      },
      trigger: null,
    });
  };

  const borrarNotificacion = async () => {
    try {
      await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
      await Notifications.dismissAllNotificationsAsync(); // Doble seguridad
    } catch (e) {
      console.log("Error borrando notificacion", e);
    }
  };

  // --- CRONÓMETRO ---
  useEffect(() => {
    let intervalo = null;
    if (activo) {
      intervalo = setInterval(() => {
        setSegundos((s) => s + 1);
        // Actualizamos notificación cada segundo
        actualizarNotificacion(pasosRef.current);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [activo]);

  // --- INICIAR ---
  const iniciarConteo = async () => {
    const disponible = await Pedometer.isAvailableAsync();
    if (!disponible) return Alert.alert("Error", "Sensor no disponible.");

    const { status } = await Pedometer.requestPermissionsAsync();
    await Notifications.requestPermissionsAsync();

    if (status !== 'granted') return Alert.alert("Permiso denegado", "Se requiere permiso.");

    // Reinicio forzado
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

  // --- DETENER ---
  const detenerConteo = () => {
    setActivo(false);
    borrarNotificacion(); // <--- AQUÍ SE BORRA LA NOTIFICACIÓN

    if (sensorListener.current) {
      sensorListener.current.remove();
      sensorListener.current = null;
    }

    // Guardar solo si hubo movimiento real
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
      METROS_POR_PASO,
      caloriasExtra,       
      agregarCaloriasExtra 
    }}>
      {children}
    </StepContext.Provider>
  );
}