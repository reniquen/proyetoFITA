// screens/UserDataContext.js
// =====================================================
// EL CEREBRO COMPLETO DE LA APP (VERSIÓN FINAL CON DIETAS)
// =====================================================
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'react-native';

// --- IMPORTACIÓN DE CATÁLOGOS (MISMA CARPETA) ---
import { RUTINAS_MAESTRAS } from './RoutineCatalog';
// IMPORTANTE: Ahora importamos DIETAS_MAESTRAS desde 'Comidas.js'
import { DIETAS_MAESTRAS } from './Comidas'; 

const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // --- ESTADOS DE DATOS ---
  const [userData, setUserData] = useState({
    nombre: '', email: '', plan: '', 
    limitacionesFisicas: [], alergiasPreferencias: [], ejerciciosCompletados: {}
  });
  
  // Datos procesados para el Home
  const [rutinasFiltradas, setRutinasFiltradas] = useState({});
  const [dietasFiltradas, setDietasFiltradas] = useState({});

  // Estado para el calendario de recetas
  const [recetasCalendar, setRecetasCalendar] = useState({});


  // =====================================================
  // 1. MOTOR DE FILTRADO DE RUTINAS
  // =====================================================
  const filtrarRutinasPorLimitaciones = (rutinasDelPlan, limitacionesUsuario) => {
    if (!rutinasDelPlan) return {};
    
    if (!limitacionesUsuario || limitacionesUsuario.length === 0 || limitacionesUsuario.includes('Ninguna')) {
        return rutinasDelPlan;
    }

    const rutinasProcesadas = {};
    for (const [dia, rutinaDia] of Object.entries(rutinasDelPlan)) {
        if (rutinaDia && rutinaDia.ejercicios) {
            const ejerciciosSeguros = rutinaDia.ejercicios.filter(ejercicio => {
                if (!ejercicio.involucra || ejercicio.involucra.length === 0) return true;
                const tieneConflicto = ejercicio.involucra.some(parteAfectada => 
                    limitacionesUsuario.includes(parteAfectada)
                );
                return !tieneConflicto; 
            });
            rutinasProcesadas[dia] = { ...rutinaDia, ejercicios: ejerciciosSeguros };
        }
    }
    return rutinasProcesadas;
  };

  // =====================================================
  // 2. FUNCIÓN PRINCIPAL DE CARGA DE DATOS
  // =====================================================
  const recargarDatos = useCallback(async () => {
    if (!auth.currentUser) { setIsLoadingData(false); return; }
    setIsLoadingData(true);
    try {
      const userRef = doc(db, 'usuarios', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setRecetasCalendar(data.calendarRecipes || {});

        // --- PROCESAR RUTINAS Y DIETAS ---
        const userPlan = data.plan || 'Plan 1'; // Red de seguridad
        const userLimitaciones = data.limitacionesFisicas || [];
        
        console.log("Cargando datos para plan:", userPlan);

        // 1. Rutinas
        const rutinasMaestrasDelPlan = RUTINAS_MAESTRAS[userPlan];
        const rutinasPersonalizadas = filtrarRutinasPorLimitaciones(rutinasMaestrasDelPlan, userLimitaciones);
        setRutinasFiltradas(rutinasPersonalizadas);

        // 2. Dietas
        const dietasDelPlan = DIETAS_MAESTRAS[userPlan] || {};
        setDietasFiltradas(dietasDelPlan);

      } else {
        setUserData({}); setRecetasCalendar({});
        setRutinasFiltradas({}); setDietasFiltradas({});
        setIsLoadingData(false);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      Alert.alert("Error", "No se pudieron cargar tus datos.");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // =====================================================
  // 3. DETECTOR DE SESIÓN
  // =====================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        recargarDatos();
      } else {
        setUserData({}); setRecetasCalendar({});
        setRutinasFiltradas({}); setDietasFiltradas({});
        setIsLoadingData(false);
      }
    });
    return () => unsubscribe();
  }, [recargarDatos]);

  // =====================================================
  // 4. FUNCIONES PÚBLICAS
  // =====================================================
  const addRecipeToCalendar = async (date, recipe) => {
    if (!user || !date || !recipe) return;
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      await setDoc(userRef, { calendarRecipes: { [date]: arrayUnion(recipe) } }, { merge: true });
      setRecetasCalendar(prev => ({ ...prev, [date]: [...(prev[date] || []), recipe] }));
    } catch (error) { console.error("Error guardando receta:", error); }
  };

  const marcarEjercicioComoRealizado = async (dia, ejercicioIndex) => { /* ... */ };

  return (
    <UserDataContext.Provider value={{
      user, userData, rutinas: rutinasFiltradas, dietas: dietasFiltradas,
      recetasCalendar, isLoadingData, recargarDatos, marcarEjercicioComoRealizado, addRecipeToCalendar
    }}>
      {children}
    </UserDataContext.Provider>
  );
};