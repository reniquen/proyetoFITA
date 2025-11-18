import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_WEEKLY_ROUTINE, PRESET_ROUTINES } from './RoutineCatalog';

// --- INICIO DE LA MODIFICACIÓN ---

// 1. Definimos la clave de guardado para la plantilla de dietas
const ROUTINES_KEY = 'user_routines_v2';
const RECIPES_KEY = 'user_recipes_calendar';
const DIET_TEMPLATE_KEY = 'user_diet_template_v1'; // 👈 Nueva clave

// 2. Traemos las dietas iniciales (que estaban en Home.js)
const DIETAS_INICIALES = {
      lunes: [
        { nombre: "Desayuno", comida: "Avena proteica, frutas y almendras", calorias: 400 },
        { nombre: "Almuerzo", comida: "Pollo a la plancha con arroz integral y brócoli", calorias: 600 },
        { nombre: "Cena", comida: "Salmón a la plancha con ensalada de palta y quinoa", calorias: 500 },
      ],
      martes: [
        { nombre: "Desayuno", comida: "Tortilla de claras con espinaca y pan integral", calorias: 350 },
        { nombre: "Almuerzo", comida: "Pavo con papas al horno y espárragos", calorias: 550 },
        { nombre: "Cena", comida: "Ensalada de pollo con palta y nueces", calorias: 450 },
      ],
      miércoles: [
        { nombre: "Desayuno", comida: "Batido de proteína con avena y plátano", calorias: 400 },
        { nombre: "Almuerzo", comida: "Pechuga de pollo con arroz integral y verduras", calorias: 500 },
        { nombre: "Cena", comida: "Filete de res con espinaca y quinoa", calorias: 600 },
      ],
      jueves: [
        { nombre: "Desayuno", comida: "Yogur griego con nueces y miel", calorias: 350 },
        { nombre: "Almuerzo", comida: "Salmón con papas al horno y espárragos", calorias: 600 },
        { nombre: "Cena", comida: "Pollo con ensalada de palta y tomate", calorias: 500 },
      ],
      viernes: [
        { nombre: "Desayuno", comida: "Avena con yogur griego y frutos rojos", calorias: 400 },
        { nombre: "Almuerzo", comida: "Pechuga de pavo con arroz integral y ensalada", calorias: 550 },
        { nombre: "Cena", comida: "Atún con espárragos y quinoa", calorias: 500 },
      ],
      sábado: [
        { nombre: "Desayuno", comida: "Batido de proteína con avena y mantequilla de maní", calorias: 450 },
        { nombre: "Almuerzo", comida: "Arroz integral con salmón y brócoli", calorias: 600 },
        { nombre: "Cena", comida: "Pollo a la plancha con ensalada de palta", calorias: 500 },
      ],
      domingo: [
        { nombre: "Desayuno", comida: "Tostadas integrales con palta y huevo", calorias: 400 },
        { nombre: "Almuerzo", comida: "Pechuga de pollo a la plancha con arroz integral", calorias: 550 },
        { nombre: "Cena", comida: "Ensalada de atún con palta y tomate", calorias: 450 },
      ],
  };
// --- FIN DE LA MODIFICACIÓN ---


const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [rutinas, setRutinas] = useState(DEFAULT_WEEKLY_ROUTINE);
  const [recetasCalendar, setRecetasCalendar] = useState({});

  // --- INICIO DE LA MODIFICACIÓN ---
  // 3. Añadimos el estado para 'dietas'
  const [dietas, setDietas] = useState(DIETAS_INICIALES);
  // --- FIN DE LA MODIFICACIÓN ---

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoutines = await AsyncStorage.getItem(ROUTINES_KEY);
        const savedRecipes = await AsyncStorage.getItem(RECIPES_KEY);

        // --- INICIO DE LA MODIFICACIÓN ---
        // 4. Cargamos las dietas guardadas
        const savedDietas = await AsyncStorage.getItem(DIET_TEMPLATE_KEY);
        // --- FIN DE LA MODIFICACIÓN ---

        if (savedRoutines) {
            setRutinas(JSON.parse(savedRoutines)); 
        } else {
            setRutinas(DEFAULT_WEEKLY_ROUTINE);
        }
        if (savedRecipes) setRecetasCalendar(JSON.parse(savedRecipes));

        // --- INICIO DE LA MODIFICACIÓN ---
        // 5. Seteamos las dietas (guardadas o iniciales)
        if (savedDietas) {
          setDietas(JSON.parse(savedDietas));
        } else {
          setDietas(DIETAS_INICIALES);
        }
        // --- FIN DE LA MODIFICACIÓN ---

      } catch (e) {
        console.error("Error cargando datos:", e);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  // --- HERRAMIENTA 1: Cambiar rutina por Preset ---
  const setRoutinePreset = async (dia, presetName) => {
    const diaNormalizado = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const diasValidos = { lunes:'lunes', martes:'martes', miercoles:'miércoles', jueves:'jueves', viernes:'viernes', sabado:'sábado', domingo:'domingo' };
    const diaReal = diasValidos[diaNormalizado];

    if (diaReal && PRESET_ROUTINES[presetName]) {
        const newRoutines = { ...rutinas, [diaReal]: PRESET_ROUTINES[presetName] };
        setRutinas(newRoutines);
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
        console.log(`✅ Rutina del ${diaReal} cambiada a ${presetName}`);
        return true;
    }
    return false;
  };

  // --- HERRAMIENTA 2: Añadir a Calendario de Recetas ---
  const addRecipeToCalendar = async (fecha, receta) => {
     const updated = { ...recetasCalendar, [fecha]: [...(recetasCalendar[fecha] || []), receta] };
     setRecetasCalendar(updated);
     await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updated));
  };

  // --- INICIO DE LA MODIFICACIÓN ---
  // --- HERRAMIENTA 3: Modificar Plantilla de Dieta (Home) ---
  const updateDietTemplate = async (dia, nombreComida, comidaDetalle, calorias) => {
    if (!dia || !nombreComida || !comidaDetalle || calorias === undefined) {
      console.error("Faltan datos para actualizar la dieta");
      return;
    }

    // Normalizamos el día (ej: "miércoles")
    const diaLower = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace("miercoles", "miércoles")
      .replace("sabado", "sábado");

    // Obtenemos el estado actual
    const prevDietas = dietas; 
    
    const dietaDelDia = prevDietas[diaLower] || [];
    const nombreComidaLower = nombreComida.toLowerCase();

    // Buscamos la comida
    const comidaIndex = dietaDelDia.findIndex(c => c.nombre.toLowerCase() === nombreComidaLower);
    
    // Mantenemos el nombre original (ej. "Desayuno") si existe
    const nombreFinal = (comidaIndex > -1) ? dietaDelDia[comidaIndex].nombre : nombreComida;
    
    const nuevaComida = {
      nombre: nombreFinal,
      comida: comidaDetalle,
      calorias: Number(calorias) || 0,
    };

    let nuevaDietaDelDia;
    if (comidaIndex > -1) {
      // Si existe, la reemplazamos
      nuevaDietaDelDia = [
        ...dietaDelDia.slice(0, comidaIndex),
        nuevaComida,
        ...dietaDelDia.slice(comidaIndex + 1),
      ];
    } else {
      // Si no existe (ej. "Snack"), la añadimos
      nuevaDietaDelDia = [...dietaDelDia, nuevaComida];
    }
    
    // Este es el objeto de dietas completo y actualizado
    const nuevasDietas = {
      ...prevDietas,
      [diaLower]: nuevaDietaDelDia,
    };

    // Actualizamos el estado Y el AsyncStorage
    setDietas(nuevasDietas);
    await AsyncStorage.setItem(DIET_TEMPLATE_KEY, JSON.stringify(nuevasDietas));
    console.log(`✅ Plantilla de dieta del ${diaLower} actualizada.`);
  };
  // --- FIN DE LA MODIFICACIÓN ---


  // --- INICIO DE LA MODIFICACIÓN ---
  // 6. Exponemos los nuevos datos ('dietas' y 'updateDietTemplate')
  return (
    <UserDataContext.Provider value={{ 
      rutinas, 
      recetasCalendar, 
      setRoutinePreset, 
      addRecipeToCalendar, 
      isLoadingData,
      dietas, 
      updateDietTemplate 
    }}>
      {children}
    </UserDataContext.Provider>
  );
  // --- FIN DE LA MODIFICACIÓN ---
};

export const useUserData = () => useContext(UserDataContext);