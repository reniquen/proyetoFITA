import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

// Rutinas iniciales (las movimos desde Home.js)
const defaultRoutines = {
  lunes: [{ nombre: "Sentadillas", repeticiones: "4x10" }, { nombre: "Prensa", repeticiones: "4x12" }],
  martes: [{ nombre: "Press Militar", repeticiones: "4x8" }, { nombre: "Elevaciones Laterales", repeticiones: "3x15" }],
  miércoles: [{ nombre: "Descanso Activo", repeticiones: "Caminar 30min" }],
  jueves: [{ nombre: "Peso Muerto", repeticiones: "4x8" }, { nombre: "Curl Femoral", repeticiones: "4x12" }],
  viernes: [{ nombre: "Press Banca", repeticiones: "4x8" }, { nombre: "Remo con Barra", repeticiones: "4x10" }],
  sábado: [{ nombre: "Cardio HIIT", repeticiones: "20 min" }],
  domingo: [{ nombre: "Descanso Total", repeticiones: "-" }],
};

export const UserDataProvider = ({ children }) => {
  const [rutinas, setRutinas] = useState(defaultRoutines);
  const [recetasCalendar, setRecetasCalendar] = useState({}); // Formato: { "2025-11-05": ["Ensalada César", "Pollo al horno"] }
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Cargar datos al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoutines = await AsyncStorage.getItem('user_routines');
        const savedRecipes = await AsyncStorage.getItem('user_recipes_calendar');
        if (savedRoutines) setRutinas(JSON.parse(savedRoutines));
        if (savedRecipes) setRecetasCalendar(JSON.parse(savedRecipes));
      } catch (e) {
        console.error("Error cargando datos de usuario:", e);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  // --- HERRAMIENTA 1: Actualizar Rutina (La IA usará esto) ---
  const updateRoutine = async (dia, nuevosEjercicios) => {
    const diaNormalizado = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // ej: "miércoles" -> "miercoles"
    // Mapeo simple para asegurar que coincida con las claves
    const clavesDias = { lunes: 'lunes', martes: 'martes', miercoles: 'miércoles', jueves: 'jueves', viernes: 'viernes', sabado: 'sábado', domingo: 'domingo' };
    const claveReal = clavesDias[diaNormalizado] || diaNormalizado;

    const newRoutines = { ...rutinas, [claveReal]: nuevosEjercicios };
    setRutinas(newRoutines);
    await AsyncStorage.setItem('user_routines', JSON.stringify(newRoutines));
    console.log(`✅ Rutina de ${claveReal} actualizada por la IA/Usuario`);
  };

  // --- HERRAMIENTA 2: Agendar Receta (La IA usará esto) ---
  const addRecipeToCalendar = async (fecha, receta) => {
    // fecha debe ser YYYY-MM-DD
    const currentRecipes = recetasCalendar[fecha] || [];
    const updatedRecipes = { ...recetasCalendar, [fecha]: [...currentRecipes, receta] };
    setRecetasCalendar(updatedRecipes);
    await AsyncStorage.setItem('user_recipes_calendar', JSON.stringify(updatedRecipes));
    console.log(`✅ Receta añadida al ${fecha}: ${receta}`);
  };

  return (
    <UserDataContext.Provider value={{ rutinas, recetasCalendar, updateRoutine, addRecipeToCalendar, isLoadingData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);