import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_USER_ROUTINES, EXERCISE_CATALOG } from './RoutineCatalog'; // <-- IMPORTAR CATÁLOGO

const ROUTINES_KEY = 'user_routines';
const RECIPES_KEY = 'user_recipes_calendar';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  // Inicializa con las rutinas del catálogo
  const [rutinas, setRutinas] = useState(DEFAULT_USER_ROUTINES);
  const [recetasCalendar, setRecetasCalendar] = useState({}); 
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Cargar datos guardados al iniciar la app
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoutines = await AsyncStorage.getItem(ROUTINES_KEY);
        const savedRecipes = await AsyncStorage.getItem(RECIPES_KEY);
        
        if (savedRoutines) {
          setRutinas(JSON.parse(savedRoutines));
        } else {
          // Si no hay nada guardado, usa las por defecto y guárdalas
          setRutinas(DEFAULT_USER_ROUTINES);
          await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(DEFAULT_USER_ROUTINES));
        }
        
        if (savedRecipes) {
          setRecetasCalendar(JSON.parse(savedRecipes));
        }
      } catch (e) {
        console.error("Error cargando datos de usuario:", e);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  // --- HERRAMIENTA 1: Actualizar Rutina (Para la IA) ---
  const updateRoutine = async (dia, nuevosEjercicios) => {
    const diaClave = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('é', 'e'); 
    
    const diaMap = {
      "lunes": "lunes", "martes": "martes", "miercoles": "miércoles",
      "jueves": "jueves", "viernes": "viernes", "sabado": "sábado", "domingo": "domingo"
    };

    const claveReal = diaMap[diaClave];
    if (!claveReal) {
        console.error('Día no válido: ${dia}');
      return;
    }

    const newRoutines = { ...rutinas, [claveReal]: nuevosEjercicios };
    setRutinas(newRoutines);
    await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
    console.log('✅ Rutina de ${claveReal} actualizada por la IA/Usuario');
    
  };

  // --- HERRAMIENTA 2: Agendar Receta (Para la IA) ---
  const addRecipeToCalendar = async (fecha, receta) => {
    const currentRecipes = recetasCalendar[fecha] || [];
    const updatedRecipes = { ...recetasCalendar, [fecha]: [...currentRecipes, receta] };
    setRecetasCalendar(updatedRecipes);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    console.log('✅ Receta añadida al ${fecha}: ${receta}');
  };

  return (
    <UserDataContext.Provider 
      value={{ 
        rutinas, 
        recetasCalendar, 
        updateRoutine, 
        addRecipeToCalendar, 
        isLoadingData,
        EXERCISE_CATALOG // Exportamos el catálogo para que la IA pueda referenciar los ejercicios
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);