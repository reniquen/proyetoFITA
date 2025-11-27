import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_WEEKLY_ROUTINE, PRESET_ROUTINES } from './RoutineCatalog';

// Claves de almacenamiento
const ROUTINES_KEY = 'user_routines_v2';
const RECIPES_KEY = 'user_recipes_calendar';
const DIET_TEMPLATE_KEY = 'user_diet_template_v1';

// 🔥 NUEVA CLAVE DE SUSCRIPCIÓN
const SUBS_KEY = 'user_subscription_active_v1';

// Dietas iniciales
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

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [rutinas, setRutinas] = useState(DEFAULT_WEEKLY_ROUTINE);
  const [recetasCalendar, setRecetasCalendar] = useState({});
  const [dietas, setDietas] = useState(DIETAS_INICIALES);

  // 🔥 NUEVO ESTADO DE SUSCRIPCIÓN
  const [suscripcionActiva, setSuscripcionActiva] = useState(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoutines = await AsyncStorage.getItem(ROUTINES_KEY);
        const savedRecipes = await AsyncStorage.getItem(RECIPES_KEY);
        const savedDietas = await AsyncStorage.getItem(DIET_TEMPLATE_KEY);

        // 🔥 Cargar suscripción guardada
        const savedSubs = await AsyncStorage.getItem(SUBS_KEY);

        if (savedRoutines) setRutinas(JSON.parse(savedRoutines));
        if (savedRecipes) setRecetasCalendar(JSON.parse(savedRecipes));
        if (savedDietas) setDietas(JSON.parse(savedDietas));

        if (savedSubs !== null) {
          setSuscripcionActiva(JSON.parse(savedSubs));
        } else {
          setSuscripcionActiva(false);
        }

      } catch (e) {
        console.error("Error cargando datos:", e);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Guardar suscripción
  const activarSuscripcion = async (estado) => {
    setSuscripcionActiva(estado);
    await AsyncStorage.setItem(SUBS_KEY, JSON.stringify(estado));
  };

  // Herramientas previas --------------------------------------------------

  const setRoutinePreset = async (dia, presetName) => {
    const diaNormalizado = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const diasValidos = { lunes:'lunes', martes:'martes', miercoles:'miércoles', jueves:'jueves', viernes:'viernes', sabado:'sábado', domingo:'domingo' };
    const diaReal = diasValidos[diaNormalizado];

    if (diaReal && PRESET_ROUTINES[presetName]) {
        const newRoutines = { ...rutinas, [diaReal]: PRESET_ROUTINES[presetName] };
        setRutinas(newRoutines);
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
        return true;
    }
    return false;
  };

  const addRecipeToCalendar = async (fecha, receta) => {
    const updated = { ...recetasCalendar, [fecha]: [...(recetasCalendar[fecha] || []), receta] };
    setRecetasCalendar(updated);
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updated));
  };

  const updateDietTemplate = async (dia, nombreComida, comidaDetalle, calorias) => {
    if (!dia || !nombreComida || !comidaDetalle || calorias === undefined) return;

    const diaLower = dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace("miercoles", "miércoles")
      .replace("sabado", "sábado");

    const prevDietas = dietas; 
    const dietaDelDia = prevDietas[diaLower] || [];
    const nombreComidaLower = nombreComida.toLowerCase();

    const comidaIndex = dietaDelDia.findIndex(c => c.nombre.toLowerCase() === nombreComidaLower);

    const nombreFinal = comidaIndex > -1 ? dietaDelDia[comidaIndex].nombre : nombreComida;

    const nuevaComida = {
      nombre: nombreFinal,
      comida: comidaDetalle,
      calorias: Number(calorias) || 0,
    };

    let nuevaDietaDelDia;
    if (comidaIndex > -1) {
      nuevaDietaDelDia = [
        ...dietaDelDia.slice(0, comidaIndex),
        nuevaComida,
        ...dietaDelDia.slice(comidaIndex + 1),
      ];
    } else {
      nuevaDietaDelDia = [...dietaDelDia, nuevaComida];
    }

    const nuevasDietas = {
      ...prevDietas,
      [diaLower]: nuevaDietaDelDia,
    };

    setDietas(nuevasDietas);
    await AsyncStorage.setItem(DIET_TEMPLATE_KEY, JSON.stringify(nuevasDietas));
  };

  return (
    <UserDataContext.Provider value={{
      rutinas,
      recetasCalendar,
      dietas,
      updateDietTemplate,
      setRoutinePreset,
      addRecipeToCalendar,

      // 🔥 NUEVOS VALORES EXPUESTOS
      suscripcionActiva,
      activarSuscripcion,

      isLoadingData,
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
