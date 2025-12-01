export const EXERCISES = {
  // --- EJERCICIOS DE GIMNASIO ---
  sentadillas: {
    id: 'sentadillas',
    nombre: "Sentadillas",
    video: "https://www.youtube.com/watch?v=dsCuiccYNGs",
    imagen: require('../assets/ejercicios/sentadilla.png'), 
    calorias_estimadas: 0.5, // kcal por repetición
  },
  prensa: {
    id: 'prensa',
    nombre: "Prensa de Pierna",
    video: "https://www.youtube.com/watch?v=MTfwemR8QMQ",
    imagen: require('../assets/ejercicios/prensa.png'),
    calorias_estimadas: 0.6,
  },
  press_militar: {
    id: 'press_militar',
    nombre: "Press Militar",
    video: "https://www.youtube.com/watch?v=waeCyaAQRn8",
    imagen: require('../assets/ejercicios/pressmilitar.png'),
    calorias_estimadas: 0.4,
  },
  dominadas: {
    id: 'dominadas',
    nombre: "Dominadas",
    video: "https://www.youtube.com/watch?v=fJ1Sq208UVA",
    imagen: require('../assets/ejercicios/dominadas.png'),
    calorias_estimadas: 1.0, // Muy intenso
  },
  press_banca: {
    id: 'press_banca',
    nombre: "Press de Banca",
    video: "https://www.youtube.com/watch?v=GeLq8cMODLc",
    imagen: require('../assets/ejercicios/pressbanca.png'),
    calorias_estimadas: 0.5,
  },

  // --- EJERCICIOS EN CASA ---
  flexiones: {
    id: 'flexiones',
    nombre: "Flexiones de Brazo",
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    imagen: require('../assets/ejercicios/flexiones.png'),
    calorias_estimadas: 0.4,
  },
  zancadas: {
    id: 'zancadas',
    nombre: "Zancadas Alternas",
    video: "https://www.youtube.com/watch?v=uqvt79Uh4o4",
    imagen: require('../assets/ejercicios/zancadas.png'),
    calorias_estimadas: 0.6, // Por pierna
  },
  fondos_silla: {
    id: 'fondos_silla',
    nombre: "Fondos de Tríceps en Silla",
    video: "https://www.youtube.com/watch?v=0326dy_-CzM",
    imagen: require('../assets/ejercicios/fondos_silla.png'),
    calorias_estimadas: 0.3,
  },
  plancha: {
    id: 'plancha',
    nombre: "Plancha Abdominal",
    video: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
    imagen: require('../assets/ejercicios/plancha.png'),
    calorias_estimadas: 4, // kcal por minuto
  },
  puente_gluteo: {
    id: 'puente_gluteo',
    nombre: "Puente de Glúteos",
    video: "https://www.youtube.com/watch?v=8bbE64NuDTU",
    imagen: require('../assets/ejercicios/puente_gluteo.png'),
    calorias_estimadas: 0.3,
  },
  jumping_jacks: {
    id: 'jumping_jacks',
    nombre: "Jumping Jacks",
    video: "https://www.youtube.com/watch?v=2W4ZNSwoW_4",
    imagen: require('../assets/ejercicios/jumping_jacks.png'),
    calorias_estimadas: 10, // kcal por minuto
  },
  escaladores: {
    id: 'escaladores',
    nombre: "Escaladores (Mountain Climbers)",
    video: "https://www.youtube.com/watch?v=Ehcq3j7o8HA",
    imagen: require('../assets/ejercicios/escaladores.png'),
    calorias_estimadas: 9, // kcal por minuto
  },
  burpees: {
    id: 'burpees',
    nombre: "Burpees",
    video: "https://www.youtube.com/watch?v=IYusabTdFEo",
    imagen: require('../assets/ejercicios/burpees.png'),
    calorias_estimadas: 1.2, // kcal por burpee
  },
  sentadilla_bulgara: {
    id: 'sentadilla_bulgara',
    nombre: "Sentadilla Búlgara",
    video: "https://www.youtube.com/watch?v=Xfa3Ql_NwmE",
    imagen: require('../assets/ejercicios/sentadillabulgara.png'),
    calorias_estimadas: 0.7,
  },
  remo_casero: {
    id: 'remo_casero',
    nombre: "Remo Unilateral",
    video: "https://www.youtube.com/watch?v=TiQC32k8qmk",
    imagen: require('../assets/ejercicios/remo.png'),
    calorias_estimadas: 0.4,
  },
  superman: {
    id: 'superman',
    nombre: "Superman (Lumbares)",
    video: "https://www.youtube.com/watch?v=z6PJMT2y8GQ",
    imagen: require('../assets/ejercicios/plancha_lateral.png'),
    calorias_estimadas: 0.3,
  },
  plancha_lateral: {
    id: 'plancha_lateral',
    nombre: "Plancha Lateral",
    video: "https://www.youtube.com/watch?v=_rdfjFSFKMY",
    imagen: require('../assets/ejercicios/plancha_lateral.png'),
    calorias_estimadas: 5, // kcal por minuto
  },
  crunch_abdominal: {
    id: 'crunch_abdominal',
    nombre: "Crunch Abdominal",
    video: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
    imagen: require('../assets/ejercicios/Crunch-abdominal.png'),
    calorias_estimadas: 0.2,
  },
  sentadilla_isometrica: {
    id: 'sentadilla_isometrica',
    nombre: "Sentadilla Isométrica",
    video: "https://www.youtube.com/watch?v=-cdph8hv0O0",
    imagen: require('../assets/ejercicios/sentadillas_isometricas.png'),
    calorias_estimadas: 5, // kcal por minuto
  },
  elevacion_talones: {
    id: 'elevacion_talones',
    nombre: "Elevación de Talones",
    video: "https://www.youtube.com/watch?v=3UWi44yN-wM",
    imagen: require('../assets/ejercicios/elevacion_talones.png'),
    calorias_estimadas: 0.2,
  },
  curl_biceps_casero: {
    id: 'curl_biceps_casero',
    nombre: "Curl de Bíceps Casero",
    video: "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    imagen: require('../assets/ejercicios/curl_biceps.png'),
    calorias_estimadas: 0.3,
  },
  tijeras: {
    id: 'tijeras',
    nombre: "Tijeras (Flutter Kicks)",
    video: "https://www.youtube.com/watch?v=ANVdMDaYRts",
    imagen: require('../assets/ejercicios/tijeras.png'),
    calorias_estimadas: 6, // kcal por minuto
  },
  rodillas_al_pecho: {
    id: 'rodillas_al_pecho',
    nombre: "Rodillas al Pecho",
    video: "https://www.youtube.com/watch?v=dgCRY7L52mE",
    imagen: require('../assets/ejercicios/rodillas_pecho.png'),
    calorias_estimadas: 8, // kcal por minuto
  },
  descanso: {
    id: 'descanso',
    nombre: "Descanso Activo",
    video: null,
    imagen: require('../assets/ejercicios/vidasaludable.png'),
    calorias_estimadas: 3, // kcal por minuto caminando
  },
};

export const RUTINAS_MAESTRAS = {
  'Plan 1': {
    lunes: {
      enfoque: 'Cardio Intenso Full Body',
      ejercicios: [
        // 4 mins total * 10 kcal/min = 40 kcal
        { ...EXERCISES.jumping_jacks, repeticiones: "4 rondas de 1 min", involucra: ['Tobillos', 'Rodillas'], calorias: 40 },
        // ~2.25 mins * 10 kcal/min = ~25 kcal
        { ...EXERCISES.burpees, repeticiones: "3 rondas de 45 seg", involucra: ['Muñecas', 'Hombros', 'Rodillas'], calorias: 25 },
        // 4 * 15 = 60 reps * 0.5 = 30 kcal
        { ...EXERCISES.sentadillas, repeticiones: "4 series de 15 reps", involucra: ['Rodillas'], calorias: 30 },
        // 1.5 mins * 9 kcal/min = ~14 kcal
        { ...EXERCISES.escaladores, repeticiones: "3 series de 30 seg", involucra: ['Hombros', 'Muñecas'], calorias: 15 }
      ]
    },
    martes: {
      enfoque: 'Core y Abdomen',
      ejercicios: [
        // 3 mins * 4 kcal = 12 kcal
        { ...EXERCISES.plancha, repeticiones: "4 series de 45 seg", involucra: ['Hombros', 'Espalda Baja'], calorias: 12 },
        // 80 reps * 0.2 = 16 kcal
        { ...EXERCISES.crunch_abdominal, repeticiones: "4 series de 20 reps", involucra: ['Espalda Baja'], calorias: 16 },
        // 1.5 mins * 6 = 9 kcal
        { ...EXERCISES.tijeras, repeticiones: "3 series de 30 seg", involucra: [], calorias: 10 },
        // 1.5 mins/lado = 3 mins total * 5 = 15 kcal
        { ...EXERCISES.plancha_lateral, repeticiones: "3 series de 30 seg/lado", involucra: ['Hombros'], calorias: 15 }
      ]
    },
    miércoles: {
        enfoque: 'Tren Inferior Dinámico',
        ejercicios: [
            // 3 * 15 * 2 piernas = 90 reps * 0.6 = 54 kcal
            { ...EXERCISES.zancadas, repeticiones: "3 series de 15 por pierna", involucra: ['Rodillas'], calorias: 54 },
            // 3 mins * 8 = 24 kcal
            { ...EXERCISES.rodillas_al_pecho, repeticiones: "4 rondas de 45 seg", involucra: ['Tobillos', 'Rodillas'], calorias: 24 },
            // 80 reps * 0.3 = 24 kcal
            { ...EXERCISES.puente_gluteo, repeticiones: "4 series de 20 reps", involucra: [], calorias: 24 },
            // 100 reps * 0.2 = 20 kcal
            { ...EXERCISES.elevacion_talones, repeticiones: "4 series de 25 reps", involucra: ['Tobillos'], calorias: 20 }
        ]
    },
    jueves: {
        enfoque: 'Descanso Activo',
        ejercicios: [
            // 30 mins * 3 = 90 kcal
            { ...EXERCISES.descanso, repeticiones: "Caminata de 30-45 minutos", involucra: [], calorias: 100 }
        ]
    },
    viernes: {
        enfoque: 'Full Body Circuito',
        ejercicios: [
            // ~40 reps * 0.4 = 16 kcal
            { ...EXERCISES.flexiones, repeticiones: "3 series de 10-15 reps", involucra: ['Hombros', 'Muñecas'], calorias: 16 },
            // 60 reps * 0.7 = 42 kcal
            { ...EXERCISES.sentadilla_bulgara, repeticiones: "3 series de 10/pierna", involucra: ['Rodillas', 'Tobillos'], calorias: 42 },
            // 72 reps * 0.4 = 28 kcal
            { ...EXERCISES.remo_casero, repeticiones: "3 series de 12/brazo", involucra: [], calorias: 28 },
            // 45 reps * 0.3 = 14 kcal
            { ...EXERCISES.superman, repeticiones: "3 series de 15 reps", involucra: [], calorias: 14 }
        ]
    },
    sábado: {
        enfoque: 'Reto de Cardio Fin de Semana',
        ejercicios: [
            // 50 * 1.2 = 60 kcal
            { ...EXERCISES.burpees, repeticiones: "50 repeticiones por tiempo", involucra: ['Muñecas', 'Hombros', 'Rodillas'], calorias: 60 },
            // ~5 mins * 10 = 50 kcal
            { ...EXERCISES.jumping_jacks, repeticiones: "100 repeticiones", involucra: ['Tobillos', 'Rodillas'], calorias: 50 },
            // 3 mins * 9 = 27 kcal
            { ...EXERCISES.escaladores, repeticiones: "3 minutos en total", involucra: ['Hombros', 'Muñecas'], calorias: 27 }
        ]
    },
    domingo: {
        enfoque: 'Descanso Total',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación", involucra: [], calorias: 0 }
        ]
    }
  },

  // ----------------------------------------------------------
  // PLAN 2: TONIFICACIÓN
  // ----------------------------------------------------------
  'Plan 2': {
    lunes: {
      enfoque: 'Pierna y Glúteo Tono',
      ejercicios: [
        { ...EXERCISES.sentadilla_bulgara, repeticiones: "4 series de 10/pierna (lento)", involucra: ['Rodillas', 'Tobillos'], calorias: 56 },
        { ...EXERCISES.puente_gluteo, repeticiones: "4 series de 15 reps (aprieta 2 seg)", involucra: [], calorias: 18 },
        { ...EXERCISES.zancadas, repeticiones: "3 series de 12/pierna", involucra: ['Rodillas'], calorias: 45 },
        { ...EXERCISES.sentadilla_isometrica, repeticiones: "3 series de 45 seg", involucra: ['Rodillas'], calorias: 12 }
      ]
    },
    martes: {
        enfoque: 'Tren Superior Tono',
        ejercicios: [
            { ...EXERCISES.flexiones, repeticiones: "4 series de 8-10 reps", involucra: ['Hombros', 'Muñecas'], calorias: 16 },
            { ...EXERCISES.remo_casero, repeticiones: "4 series de 12/brazo", involucra: [], calorias: 40 },
            { ...EXERCISES.fondos_silla, repeticiones: "3 series de 10-12 reps", involucra: ['Hombros', 'Muñecas'], calorias: 12 },
            { ...EXERCISES.curl_biceps_casero, repeticiones: "3 series de 15 reps", involucra: [], calorias: 14 }
        ]
    },
    miércoles: {
        enfoque: 'Core y Estabilidad',
        ejercicios: [
            { ...EXERCISES.plancha, repeticiones: "4 series de 45-60 seg", involucra: ['Hombros', 'Espalda Baja'], calorias: 16 },
            { ...EXERCISES.superman, repeticiones: "4 series de 15 reps (lento)", involucra: [], calorias: 18 },
            { ...EXERCISES.plancha_lateral, repeticiones: "3 series de 45 seg/lado", involucra: ['Hombros'], calorias: 22 }
        ]
    },
    jueves: {
        enfoque: 'Descanso Activo',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Estiramientos o Yoga suave", involucra: [], calorias: 50 }
        ]
    },
    viernes: {
        enfoque: 'Full Body Tono Mix',
        ejercicios: [
            { ...EXERCISES.sentadillas, repeticiones: "3 series de 20 reps", involucra: ['Rodillas'], calorias: 30 },
            { ...EXERCISES.remo_casero, repeticiones: "3 series de 15/brazo", involucra: [], calorias: 36 },
            { ...EXERCISES.flexiones, repeticiones: "3 series de 10 reps", involucra: ['Hombros', 'Muñecas'], calorias: 12 },
            { ...EXERCISES.elevacion_talones, repeticiones: "3 series de 30 reps", involucra: ['Tobillos'], calorias: 18 }
        ]
    },
    sábado: {
        enfoque: 'Cardio Moderado',
        ejercicios: [
            { ...EXERCISES.jumping_jacks, repeticiones: "3 rondas de 2 min", involucra: ['Tobillos', 'Rodillas'], calorias: 60 },
            { ...EXERCISES.descanso, repeticiones: "Caminata ligera 30 min", involucra: [], calorias: 100 }
        ]
    },
    domingo: {
        enfoque: 'Descanso Total',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación", involucra: [], calorias: 0 }
        ]
    }
  },

  // ----------------------------------------------------------
  // PLAN 3: GANANCIA MUSCULAR
  // ----------------------------------------------------------
  'Plan 3': {
    lunes: {
      enfoque: 'Pecho y Tríceps (Gym)',
      ejercicios: [
        { ...EXERCISES.press_banca, repeticiones: "4 series de 6-8 reps pesadas", involucra: ['Hombros', 'Muñecas', 'Codos'], calorias: 40 },
        { ...EXERCISES.flexiones, repeticiones: "3 series al fallo (con peso extra si puedes)", involucra: ['Hombros', 'Muñecas'], calorias: 25 },
        { ...EXERCISES.fondos_silla, repeticiones: "4 series de 10-12 reps (con peso)", involucra: ['Hombros', 'Muñecas', 'Codos'], calorias: 30 }
      ]
    },
    martes: {
        enfoque: 'Espalda y Bíceps (Gym)',
        ejercicios: [
            { ...EXERCISES.dominadas, repeticiones: "4 series al fallo", involucra: ['Hombros', 'Muñecas', 'Codos'], calorias: 45 },
            { ...EXERCISES.remo_casero, repeticiones: "4 series de 8-10 reps pesadas/brazo", involucra: [], calorias: 35 },
            { ...EXERCISES.curl_biceps_casero, repeticiones: "4 series de 10-12 reps pesadas", involucra: [], calorias: 20 }
        ]
    },
    miércoles: {
        enfoque: 'Pierna Pesada (Gym)',
        ejercicios: [
            { ...EXERCISES.sentadillas, repeticiones: "5 series de 5 reps pesadas", involucra: ['Rodillas', 'Espalda Baja'], calorias: 40 },
            { ...EXERCISES.prensa, repeticiones: "4 series de 10-12 reps", involucra: ['Rodillas'], calorias: 35 },
            { ...EXERCISES.zancadas, repeticiones: "3 series de 10/pierna (con mancuernas)", involucra: ['Rodillas'], calorias: 40 },
            { ...EXERCISES.elevacion_talones, repeticiones: "4 series de 20 reps pesadas", involucra: ['Tobillos'], calorias: 20 }
        ]
    },
    jueves: {
        enfoque: 'Descanso / Movilidad',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Recuperación activa, estiramientos", involucra: [], calorias: 50 }
        ]
    },
    viernes: {
        enfoque: 'Hombro y Core (Gym)',
        ejercicios: [
            { ...EXERCISES.press_militar, repeticiones: "4 series de 8-10 reps", involucra: ['Hombros', 'Muñecas', 'Codos', 'Espalda Baja'], calorias: 35 },
            { ...EXERCISES.plancha, repeticiones: "4 series de 60 seg", involucra: ['Hombros', 'Espalda Baja'], calorias: 16 },
            { ...EXERCISES.crunch_abdominal, repeticiones: "4 series de 15 reps (con peso)", involucra: ['Espalda Baja'], calorias: 20 }
        ]
    },
    sábado: {
        enfoque: 'Full Body Hipertrofia',
        ejercicios: [
            { ...EXERCISES.press_banca, repeticiones: "3 series de 10 reps", involucra: ['Hombros', 'Muñecas', 'Codos'], calorias: 30 },
            { ...EXERCISES.sentadillas, repeticiones: "3 series de 10 reps", involucra: ['Rodillas', 'Espalda Baja'], calorias: 25 },
            { ...EXERCISES.dominadas, repeticiones: "3 series al fallo", involucra: ['Hombros', 'Muñecas', 'Codos'], calorias: 35 }
        ]
    },
    domingo: {
        enfoque: 'Descanso Total',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación", involucra: [], calorias: 0 }
        ]
    }
  }
};