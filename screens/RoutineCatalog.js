// ====================================================================
// 1. CATÁLOGO MAESTRO DE EJERCICIOS
// Define aquí cada ejercicio una sola vez con todos sus assets.
// ====================================================================
export const EXERCISES = {
    sentadillas: {
      id: 'sentadillas',
      nombre: "Sentadillas",
      video: "https://www.youtube.com/watch?v=dsCuiccYNGs",
      // Usamos tus imágenes PNG existentes como fallback si no hay Lottie
      imagen: require('../assets/sentadilla.png'), 
      // Si tienes Lotties específicos, úsalos aquí. Si no, usa null o la imagen.
      animacion: null, 
    },
    prensa: {
      id: 'prensa',
      nombre: "Prensa de Pierna",
      video: "https://www.youtube.com/watch?v=MTfwemR8QMQ",
      imagen: require('../assets/prensa.png'),
    },
    press_militar: {
      id: 'press_militar',
      nombre: "Press Militar",
      video: "https://www.youtube.com/watch?v=waeCyaAQRn8",
      imagen: require('../assets/pressmilitar.png'),
    },
    dominadas: {
      id: 'dominadas',
      nombre: "Dominadas",
      video: "https://www.youtube.com/watch?v=fJ1Sq208UVA",
      imagen: require('../assets/dominadas.png'),
    },
    press_banca: {
      id: 'press_banca',
      nombre: "Press de Banca",
      video: "https://www.youtube.com/watch?v=GeLq8cMODLc",
      imagen: require('../assets/pressbanca.png'),
    },
    burpees: {
      id: 'burpees',
      nombre: "Burpees",
      video: "https://www.youtube.com/watch?v=IYusabTdFEo",
      imagen: require('../assets/burpees.png'),
    },
    descanso: {
      id: 'descanso',
      nombre: "Descanso Activo",
      video: null,
      imagen: require('../assets/vidasaludable.png'), // Asegúrate de tener una imagen genérica
    },
    // ... AGREGA AQUÍ TODOS TUS OTROS EJERCICIOS ...
  };
  
  // ====================================================================
  // 2. RUTINAS PREDEFINIDAS (PACKS)
  // La IA usará estos nombres (ej: "FULL_BODY_LIGERO") para cambiar rutinas completas.
  // ====================================================================
  export const PRESET_ROUTINES = {
    PIERNA_BASICO: [
      { ...EXERCISES.sentadillas, repeticiones: "4 series de 12 reps" },
      { ...EXERCISES.prensa, repeticiones: "4 series de 15 reps" },
    ],
    PIERNA_FUERTE: [
      { ...EXERCISES.sentadillas, repeticiones: "5 series de 5 reps (Pesado)" },
      { ...EXERCISES.prensa, repeticiones: "4 series de 10 reps" },
      { ...EXERCISES.burpees, repeticiones: "3 series al fallo" },
    ],
    TORSO_SUPERIOR: [
      { ...EXERCISES.press_banca, repeticiones: "4 series de 10 reps" },
      { ...EXERCISES.dominadas, repeticiones: "4 series al fallo" },
      { ...EXERCISES.press_militar, repeticiones: "3 series de 12 reps" },
    ],
    CARDIO_QUEMA: [
      { ...EXERCISES.burpees, repeticiones: "4 rondas de 1 min" },
      // Puedes reusar ejercicios o añadir nuevos al catálogo
      { ...EXERCISES.descanso, repeticiones: "Caminar 30 min" },
    ],
    DESCANSO_TOTAL: [
       { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación" },
    ]
  };
  
  // ====================================================================
  // 3. RUTINA INICIAL DEL USUARIO (Lunes a Domingo)
  // ====================================================================
  export const DEFAULT_WEEKLY_ROUTINE = {
    lunes: PRESET_ROUTINES.PIERNA_BASICO,
    martes: PRESET_ROUTINES.TORSO_SUPERIOR,
    miércoles: PRESET_ROUTINES.CARDIO_QUEMA,
    jueves: PRESET_ROUTINES.PIERNA_FUERTE,
    viernes: PRESET_ROUTINES.TORSO_SUPERIOR,
    sábado: PRESET_ROUTINES.CARDIO_QUEMA,
    domingo: PRESET_ROUTINES.DESCANSO_TOTAL,
  };