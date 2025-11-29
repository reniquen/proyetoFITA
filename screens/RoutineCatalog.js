// ====================================================================
// 1. CATÁLOGO MAESTRO DE EJERCICIOS
// ====================================================================
export const EXERCISES = {
  // --- EJERCICIOS DE GIMNASIO (EXISTENTES) ---
  sentadillas: {
    id: 'sentadillas',
    nombre: "Sentadillas",
    video: "https://www.youtube.com/watch?v=dsCuiccYNGs",
    imagen: require('../assets/ejercicios/sentadillas.gif'), 
    animacion: null, 
  },
  prensa: {
    id: 'prensa',
    nombre: "Prensa de Pierna",
    video: "https://www.youtube.com/watch?v=MTfwemR8QMQ",
    imagen: require('../assets/ejercicios/prensa.gif'),
  },
  press_militar: {
    id: 'press_militar',
    nombre: "Press Militar",
    video: "https://www.youtube.com/watch?v=waeCyaAQRn8",
    imagen: require('../assets/ejercicios/press_militar.gif'),
  },
  dominadas: {
    id: 'dominadas',
    nombre: "Dominadas",
    video: "https://www.youtube.com/watch?v=fJ1Sq208UVA",
    imagen: require('../assets/ejercicios/dominadas.gif'),
  },
  press_banca: {
    id: 'press_banca',
    nombre: "Press de Banca",
    video: "https://www.youtube.com/watch?v=GeLq8cMODLc",
    imagen: require('../assets/ejercicios/press_banca.gif'),
  },

  // --- EJERCICIOS EN CASA (ANTERIORES) ---
  flexiones: {
    id: 'flexiones',
    nombre: "Flexiones de Brazo",
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    imagen: require('../assets/ejercicios/flexiones.gif'),
  },
  zancadas: {
    id: 'zancadas',
    nombre: "Zancadas Alternas",
    video: "https://www.youtube.com/watch?v=uqvt79Uh4o4",
    imagen: require('../assets/ejercicios/zancada.gif'),
  },
  fondos_silla: {
    id: 'fondos_silla',
    nombre: "Fondos de Tríceps en Silla",
    video: "https://www.youtube.com/watch?v=0326dy_-CzM",
    imagen: require('../assets/ejercicios/fondo_silla.gif'),
  },
  plancha: {
    id: 'plancha',
    nombre: "Plancha Abdominal",
    video: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
    imagen: require('../assets/ejercicios/plancha.gif'),
  },
  puente_gluteo: {
    id: 'puente_gluteo',
    nombre: "Puente de Glúteos",
    video: "https://www.youtube.com/watch?v=8bbE64NuDTU",
    imagen: require('../assets/ejercicios/puente_gluteo.gif'),
  },
  jumping_jacks: {
    id: 'jumping_jacks',
    nombre: "Jumping Jacks",
    video: "https://www.youtube.com/watch?v=2W4ZNSwoW_4",
    imagen: require('../assets/ejercicios/jumping_jacks.gif'),
  },
  escaladores: {
    id: 'escaladores',
    nombre: "Escaladores (Mountain Climbers)",
    video: "https://www.youtube.com/watch?v=Ehcq3j7o8HA",
    imagen: require('../assets/ejercicios/escaladores.gif'),
  },
  burpees: {
    id: 'burpees',
    nombre: "Burpees",
    video: "https://www.youtube.com/watch?v=IYusabTdFEo",
    imagen: require('../assets/ejercicios/burpees.gif'),
  },

  // --- 🔥 10 NUEVOS EJERCICIOS EN CASA (ESTRUCTURA UNIFICADA) ---
  sentadilla_bulgara: {
    id: 'sentadilla_bulgara',
    nombre: "Sentadilla Búlgara",
    video: "https://www.youtube.com/watch?v=Xfa3Ql_NwmE",
    imagen: require('../assets/ejercicios/sentadillas_bulgaras.gif'),
  },
  remo_casero: {
    id: 'remo_casero',
    nombre: "Remo Unilateral",
    video: "https://www.youtube.com/watch?v=ue8MXKXdOVw",
    imagen: require('../assets/ejercicios/remo_casero.gif'),
  },
  superman: {
    id: 'superman',
    nombre: "Superman (Lumbares)",
    video: "https://www.youtube.com/watch?v=z6PJMT2y8GQ",
    imagen: require('../assets/ejercicios/superman.gif'),
  },
  plancha_lateral: {
    id: 'plancha_lateral',
    nombre: "Plancha Lateral",
    video: "https://www.youtube.com/watch?v=_rdfjFSFKMY",
    imagen: require('../assets/ejercicios/plancha_lateral.gif'),
  },
  crunch_abdominal: {
    id: 'crunch_abdominal',
    nombre: "Crunch Abdominal",
    video: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
    imagen: require('../assets/ejercicios/crunch_abdominales.gif'),
  },
  sentadilla_isometrica: {
    id: 'sentadilla_isometrica',
    nombre: "Sentadilla Isométrica",
    video: "https://www.youtube.com/watch?v=-cdph8hv0O0",
    imagen: require('../assets/ejercicios/sentadillas_isometricas.gif'),
  },
  elevacion_talones: {
    id: 'elevacion_talones',
    nombre: "Elevación de Talones",
    video: "https://www.youtube.com/watch?v=3UWi44yN-wM",
    imagen: require('../assets/ejercicios/elevacion_talon.gif'),
  },
  curl_biceps_casero: {
    id: 'curl_biceps_casero',
    nombre: "Curl de Bíceps Casero",
    video: "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    imagen: require('../assets/ejercicios/curls_biceps.gif'),
  },
  tijeras: {
    id: 'tijeras',
    nombre: "Tijeras (Flutter Kicks)",
    video: "https://www.youtube.com/watch?v=ANVdMDaYRts",
    imagen: require('../assets/ejercicios/tijeras.gif'),
  },
  rodillas_al_pecho: {
    id: 'rodillas_al_pecho',
    nombre: "Rodillas al Pecho",
    video: "https://www.youtube.com/watch?v=dgCRY7L52mE",
    imagen: require('../assets/ejercicios/rodillas_pecho.gif'),
  },

  // --- OTROS ---
  descanso: {
    id: 'descanso',
    nombre: "Descanso Activo",
    video: null,
    imagen: require('../assets/vidasaludable.png'), 
  },
};

// ====================================================================
// 2. RUTINAS PREDEFINIDAS (PACKS)
// ====================================================================
export const PRESET_ROUTINES = {
  // --- RUTINAS GYM (Las originales) ---
  GYM_PIERNA_BASICO: [
    { ...EXERCISES.sentadillas, repeticiones: "4 series de 12 reps" },
    { ...EXERCISES.prensa, repeticiones: "4 series de 15 reps" },
    { ...EXERCISES.zancadas, repeticiones: "3 series de 20 pasos" },
  ],
  GYM_TORSO: [
    { ...EXERCISES.press_banca, repeticiones: "4 series de 10 reps" },
    { ...EXERCISES.dominadas, repeticiones: "4 series al fallo" },
    { ...EXERCISES.press_militar, repeticiones: "3 series de 12 reps" },
  ],

  // --- RUTINAS EN CASA ---
  CASA_FULLBODY: [
    { ...EXERCISES.sentadillas, repeticiones: "4 series de 15 reps" },
    { ...EXERCISES.flexiones, repeticiones: "4 series de 10-12 reps" },
    { ...EXERCISES.zancadas, repeticiones: "3 series de 12 por pierna" },
    { ...EXERCISES.fondos_silla, repeticiones: "3 series de 10 reps" },
    { ...EXERCISES.plancha, repeticiones: "3 series de 30-60 segundos" },
  ],
  CASA_PIERNA_GLUTEO: [
    { ...EXERCISES.sentadilla_bulgara, repeticiones: "4 series de 10 por pierna" },
    { ...EXERCISES.zancadas, repeticiones: "4 series de 12 por pierna" },
    { ...EXERCISES.puente_gluteo, repeticiones: "4 series de 20 reps (aprieta arriba)" },
    { ...EXERCISES.elevacion_talones, repeticiones: "4 series de 20 reps" },
  ],
  CASA_ABS_CORE: [
    { ...EXERCISES.crunch_abdominal, repeticiones: "4 series de 15 reps" },
    { ...EXERCISES.tijeras, repeticiones: "4 series de 30 segundos" },
    { ...EXERCISES.plancha_lateral, repeticiones: "3 series de 30 seg por lado" },
    { ...EXERCISES.superman, repeticiones: "3 series de 12 reps" },
  ],
  CASA_TOTAL_ADVANCED: [
    { ...EXERCISES.rodillas_al_pecho, repeticiones: "1 minuto (Calentamiento)" },
    { ...EXERCISES.remo_casero, repeticiones: "4 series de 12 por brazo" },
    { ...EXERCISES.sentadilla_bulgara, repeticiones: "4 series de 10 por pierna" },
    { ...EXERCISES.curl_biceps_casero, repeticiones: "3 series de 15 reps" },
    { ...EXERCISES.sentadilla_isometrica, repeticiones: "3 series de 45 segundos" },
    { ...EXERCISES.burpees, repeticiones: "3 series al fallo" },
  ],
  CARDIO_QUEMA: [
    { ...EXERCISES.burpees, repeticiones: "4 rondas de 1 min" },
    { ...EXERCISES.jumping_jacks, repeticiones: "4 rondas de 1 min" },
    { ...EXERCISES.rodillas_al_pecho, repeticiones: "4 rondas de 45 seg" },
    { ...EXERCISES.descanso, repeticiones: "Caminar 30 min" },
  ],
  DESCANSO_TOTAL: [
     { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación o Yoga suave" },
  ]
};

// ====================================================================
// 3. RUTINA INICIAL DEL USUARIO (Mezcla Equilibrada)
// ====================================================================
export const DEFAULT_WEEKLY_ROUTINE = {
  lunes: PRESET_ROUTINES.CASA_TOTAL_ADVANCED,
  martes: PRESET_ROUTINES.CASA_ABS_CORE,
  miércoles: PRESET_ROUTINES.GYM_PIERNA_BASICO,
  jueves: PRESET_ROUTINES.CASA_PIERNA_GLUTEO,
  viernes: PRESET_ROUTINES.GYM_TORSO,
  sábado: PRESET_ROUTINES.CARDIO_QUEMA,
  domingo: PRESET_ROUTINES.DESCANSO_TOTAL,
};