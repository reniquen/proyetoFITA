import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_WEEKLY_ROUTINE, PRESET_ROUTINES } from './RoutineCatalog';


const ROUTINES_KEY = 'user_routines_v2'; // Cambié la clave para forzar recarga limpia
const RECIPES_KEY = 'user_recipes_calendar';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [rutinas, setRutinas] = useState(DEFAULT_WEEKLY_ROUTINE);
  const [recetasCalendar, setRecetasCalendar] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoutines = await AsyncStorage.getItem(ROUTINES_KEY);
        const savedRecipes = await AsyncStorage.getItem(RECIPES_KEY);
        if (savedRoutines) {
            // Aquí podrías añadir lógica para "rehidratar" las imágenes si se perdieron al guardar en JSON,
            // pero por simplicidad, usaremos los defaults si falla la carga de imágenes.
            setRutinas(JSON.parse(savedRoutines)); 
        } else {
            setRutinas(DEFAULT_WEEKLY_ROUTINE);
        }
        if (savedRecipes) setRecetasCalendar(JSON.parse(savedRecipes));
      } catch (e) {
        console.error("Error cargando datos:", e);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  // --- HERRAMIENTA PARA LA IA: Cambiar rutina por Preset ---
  const setRoutinePreset = async (dia, presetName) => {
    const diaNormalizado = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Mapeo rápido para asegurar el nombre correcto del día
    const diasValidos = { lunes:'lunes', martes:'martes', miercoles:'miércoles', jueves:'jueves', viernes:'viernes', sabado:'sábado', domingo:'domingo' };
    const diaReal = diasValidos[diaNormalizado];

    if (diaReal && PRESET_ROUTINES[presetName]) {
        const newRoutines = { ...rutinas, [diaReal]: PRESET_ROUTINES[presetName] };
        setRutinas(newRoutines);
        // Nota: Al guardar en AsyncStorage, las imágenes (require) se pueden perder. 
        // Para una app real, guardarías solo los IDs y reconstruirías la rutina al cargar.
        // Por ahora, esto funcionará mientras la app esté abierta.
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
        console.log(`✅ Rutina del ${diaReal} cambiada a ${presetName}`);
        return true;
    }
    return false;
  };

  const addRecipeToCalendar = async (fecha, receta) => {
     const updated = { ...recetasCalendar, [fecha]: [...(recetasCalendar[fecha] || []), receta] };
     setRecetasCalendar(updated);
     await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updated));
  };

  return (
    <UserDataContext.Provider value={{ rutinas, recetasCalendar, setRoutinePreset, addRecipeToCalendar, isLoadingData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);