export const EXERCISES = {
  // --- EJERCICIOS DE GIMNASIO ---
  sentadillas: {
    id: 'sentadillas',
    nombre: "Sentadillas",
    video: "https://www.youtube.com/watch?v=dsCuiccYNGs",
    imagen: require('../assets/ejercicios/sentadilla.png'), 
  },
  prensa: {
    id: 'prensa',
    nombre: "Prensa de Pierna",
    video: "https://www.youtube.com/watch?v=MTfwemR8QMQ",
    imagen: require('../assets/ejercicios/prensa.png'),
  },
  press_militar: {
    id: 'press_militar',
    nombre: "Press Militar",
    video: "https://www.youtube.com/watch?v=waeCyaAQRn8",
    imagen: require('../assets/ejercicios/pressmilitar.png'),
  },
  dominadas: {
    id: 'dominadas',
    nombre: "Dominadas",
    video: "https://www.youtube.com/watch?v=fJ1Sq208UVA",
    imagen: require('../assets/ejercicios/dominadas.png'),
  },
  press_banca: {
    id: 'press_banca',
    nombre: "Press de Banca",
    video: "https://www.youtube.com/watch?v=GeLq8cMODLc",
    imagen: require('../assets/ejercicios/pressbanca.png'),
  },

  // --- EJERCICIOS EN CASA ---
  flexiones: {
    id: 'flexiones',
    nombre: "Flexiones de Brazo",
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    imagen: require('../assets/ejercicios/flexiones.png'),
  },
  zancadas: {
    id: 'zancadas',
    nombre: "Zancadas Alternas",
    video: "https://www.youtube.com/watch?v=uqvt79Uh4o4",
    imagen: require('../assets/ejercicios/zancadas.png'),
  },
  fondos_silla: {
    id: 'fondos_silla',
    nombre: "Fondos de Tríceps en Silla",
    video: "https://www.youtube.com/watch?v=0326dy_-CzM",
    imagen: require('../assets/ejercicios/fondos_silla.png'),
  },
  plancha: {
    id: 'plancha',
    nombre: "Plancha Abdominal",
    video: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
    imagen: require('../assets/ejercicios/plancha.png'),
  },
  puente_gluteo: {
    id: 'puente_gluteo',
    nombre: "Puente de Glúteos",
    video: "https://www.youtube.com/watch?v=8bbE64NuDTU",
    imagen: require('../assets/ejercicios/puente_gluteo.png'),
  },
  jumping_jacks: {
    id: 'jumping_jacks',
    nombre: "Jumping Jacks",
    video: "https://www.youtube.com/watch?v=2W4ZNSwoW_4",
    imagen: require('../assets/ejercicios/jumping_jacks.png'),
  },
  escaladores: {
    id: 'escaladores',
    nombre: "Escaladores (Mountain Climbers)",
    video: "https://www.youtube.com/watch?v=Ehcq3j7o8HA",
    imagen: require('../assets/ejercicios/escaladores.png'),
  },
  burpees: {
    id: 'burpees',
    nombre: "Burpees",
    video: "https://www.youtube.com/watch?v=IYusabTdFEo",
    imagen: require('../assets/ejercicios/burpees.png'),
  },
  sentadilla_bulgara: {
    id: 'sentadilla_bulgara',
    nombre: "Sentadilla Búlgara",
    video: "https://www.youtube.com/watch?v=Xfa3Ql_NwmE",
    imagen: require('../assets/ejercicios/sentadillabulgara.png'),
  },
  remo_casero: {
    id: 'remo_casero',
    nombre: "Remo Unilateral",
    video: "https://www.youtube.com/watch?v=TiQC32k8qmk",
    imagen: require('../assets/ejercicios/remo.png'),
  },
  superman: {
    id: 'superman',
    nombre: "Superman (Lumbares)",
    video: "https://www.youtube.com/watch?v=z6PJMT2y8GQ",
    imagen: require('../assets/ejercicios/plancha_lateral.png'),
  },
  plancha_lateral: {
    id: 'plancha_lateral',
    nombre: "Plancha Lateral",
    video: "https://www.youtube.com/watch?v=_rdfjFSFKMY",
    imagen: require('../assets/ejercicios/plancha_lateral.png'),
  },
  crunch_abdominal: {
    id: 'crunch_abdominal',
    nombre: "Crunch Abdominal",
    video: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
    imagen: require('../assets/ejercicios/Crunch-abdominal.png'),
  },
  sentadilla_isometrica: {
    id: 'sentadilla_isometrica',
    nombre: "Sentadilla Isométrica",
    video: "https://www.youtube.com/watch?v=-cdph8hv0O0",
    imagen: require('../assets/ejercicios/sentadillas_isometricas.png'),
  },
  elevacion_talones: {
    id: 'elevacion_talones',
    nombre: "Elevación de Talones",
    video: "https://www.youtube.com/watch?v=3UWi44yN-wM",
    imagen: require('../assets/ejercicios/elevacion_talones.png'),
  },
  curl_biceps_casero: {
    id: 'curl_biceps_casero',
    nombre: "Curl de Bíceps Casero",
    video: "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    imagen: require('../assets/ejercicios/curl_biceps.png'),
  },
  tijeras: {
    id: 'tijeras',
    nombre: "Tijeras (Flutter Kicks)",
    video: "https://www.youtube.com/watch?v=ANVdMDaYRts",
    imagen: require('../assets/ejercicios/tijeras.png'),
  },
  rodillas_al_pecho: {
    id: 'rodillas_al_pecho',
    nombre: "Rodillas al Pecho",
    video: "https://www.youtube.com/watch?v=dgCRY7L52mE",
    imagen: require('../assets/ejercicios/rodillas_pecho.png'),
  },
  descanso: {
    id: 'descanso',
    nombre: "Descanso Activo",
    video: null,
    imagen: require('../assets/ejercicios/vidasaludable.png'), 
  },
};



export const RUTINAS_MAESTRAS = {


  'Plan 1': {
    lunes: {
      enfoque: 'Cardio Intenso Full Body',
      ejercicios: [
        { ...EXERCISES.jumping_jacks, repeticiones: "4 rondas de 1 min", involucra: ['Tobillos', 'Rodillas'] },
        { ...EXERCISES.burpees, repeticiones: "3 rondas de 45 seg", involucra: ['Muñecas', 'Hombros', 'Rodillas'] },
        { ...EXERCISES.sentadillas, repeticiones: "4 series de 15 reps", involucra: ['Rodillas'] },
        { ...EXERCISES.escaladores, repeticiones: "3 series de 30 seg", involucra: ['Hombros', 'Muñecas'] }
      ]
    },
    martes: {
      enfoque: 'Core y Abdomen',
      ejercicios: [
        { ...EXERCISES.plancha, repeticiones: "4 series de 45 seg", involucra: ['Hombros', 'Espalda Baja'] },
        { ...EXERCISES.crunch_abdominal, repeticiones: "4 series de 20 reps", involucra: ['Espalda Baja'] },
        { ...EXERCISES.tijeras, repeticiones: "3 series de 30 seg", involucra: [] },
        { ...EXERCISES.plancha_lateral, repeticiones: "3 series de 30 seg/lado", involucra: ['Hombros'] }
      ]
    },
    miércoles: {
        enfoque: 'Tren Inferior Dinámico',
        ejercicios: [
            { ...EXERCISES.zancadas, repeticiones: "3 series de 15 por pierna", involucra: ['Rodillas'] },
            { ...EXERCISES.rodillas_al_pecho, repeticiones: "4 rondas de 45 seg", involucra: ['Tobillos', 'Rodillas'] },
            { ...EXERCISES.puente_gluteo, repeticiones: "4 series de 20 reps", involucra: [] },
            { ...EXERCISES.elevacion_talones, repeticiones: "4 series de 25 reps", involucra: ['Tobillos'] }
        ]
    },
    jueves: {
        enfoque: 'Descanso Activo',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Caminata de 30-45 minutos", involucra: [] }
        ]
    },
    viernes: {
        enfoque: 'Full Body Circuito',
        ejercicios: [
            { ...EXERCISES.flexiones, repeticiones: "3 series de 10-15 reps", involucra: ['Hombros', 'Muñecas'] },
            { ...EXERCISES.sentadilla_bulgara, repeticiones: "3 series de 10/pierna", involucra: ['Rodillas', 'Tobillos'] },
            { ...EXERCISES.remo_casero, repeticiones: "3 series de 12/brazo", involucra: [] },
            { ...EXERCISES.superman, repeticiones: "3 series de 15 reps", involucra: [] }
        ]
    },
    sábado: {
        enfoque: 'Reto de Cardio Fin de Semana',
        ejercicios: [
            { ...EXERCISES.burpees, repeticiones: "50 repeticiones por tiempo", involucra: ['Muñecas', 'Hombros', 'Rodillas'] },
            { ...EXERCISES.jumping_jacks, repeticiones: "100 repeticiones", involucra: ['Tobillos', 'Rodillas'] },
            { ...EXERCISES.escaladores, repeticiones: "3 minutos en total", involucra: ['Hombros', 'Muñecas'] }
        ]
    },
    domingo: {
        enfoque: 'Descanso Total',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación", involucra: [] }
        ]
    }
  },

  // ----------------------------------------------------------
  // PLAN 2: TONIFICACIÓN (Enfoque: Reps medias y control)
  // ----------------------------------------------------------
  'Plan 2': {
    lunes: {
      enfoque: 'Pierna y Glúteo Tono',
      ejercicios: [
        { ...EXERCISES.sentadilla_bulgara, repeticiones: "4 series de 10/pierna (lento)", involucra: ['Rodillas', 'Tobillos'] },
        { ...EXERCISES.puente_gluteo, repeticiones: "4 series de 15 reps (aprieta 2 seg)", involucra: [] },
        { ...EXERCISES.zancadas, repeticiones: "3 series de 12/pierna", involucra: ['Rodillas'] },
        { ...EXERCISES.sentadilla_isometrica, repeticiones: "3 series de 45 seg", involucra: ['Rodillas'] }
      ]
    },
    martes: {
        enfoque: 'Tren Superior Tono',
        ejercicios: [
            { ...EXERCISES.flexiones, repeticiones: "4 series de 8-10 reps", involucra: ['Hombros', 'Muñecas'] },
            { ...EXERCISES.remo_casero, repeticiones: "4 series de 12/brazo", involucra: [] },
            { ...EXERCISES.fondos_silla, repeticiones: "3 series de 10-12 reps", involucra: ['Hombros', 'Muñecas'] },
            { ...EXERCISES.curl_biceps_casero, repeticiones: "3 series de 15 reps", involucra: [] }
        ]
    },
    miércoles: {
        enfoque: 'Core y Estabilidad',
        ejercicios: [
            { ...EXERCISES.plancha, repeticiones: "4 series de 45-60 seg", involucra: ['Hombros', 'Espalda Baja'] },
            { ...EXERCISES.superman, repeticiones: "4 series de 15 reps (lento)", involucra: [] },
            { ...EXERCISES.plancha_lateral, repeticiones: "3 series de 45 seg/lado", involucra: ['Hombros'] }
        ]
    },
    jueves: {
        enfoque: 'Descanso Activo',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Estiramientos o Yoga suave", involucra: [] }
        ]
    },
    viernes: {
        enfoque: 'Full Body Tono Mix',
        ejercicios: [
            { ...EXERCISES.sentadillas, repeticiones: "3 series de 20 reps", involucra: ['Rodillas'] },
            { ...EXERCISES.remo_casero, repeticiones: "3 series de 15/brazo", involucra: [] },
            { ...EXERCISES.flexiones, repeticiones: "3 series de 10 reps", involucra: ['Hombros', 'Muñecas'] },
            { ...EXERCISES.elevacion_talones, repeticiones: "3 series de 30 reps", involucra: ['Tobillos'] }
        ]
    },
    sábado: {
        enfoque: 'Cardio Moderado',
        ejercicios: [
            { ...EXERCISES.jumping_jacks, repeticiones: "3 rondas de 2 min", involucra: ['Tobillos', 'Rodillas'] },
            { ...EXERCISES.descanso, repeticiones: "Caminata ligera 30 min", involucra: [] }
        ]
    },
    domingo: {
        enfoque: 'Descanso Total',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación", involucra: [] }
        ]
    }
  },

  // ----------------------------------------------------------
  // PLAN 3: GANANCIA MUSCULAR (Enfoque: Cargas altas, gym)
  // ----------------------------------------------------------
  'Plan 3': {
    lunes: {
      enfoque: 'Pecho y Tríceps (Gym)',
      ejercicios: [
        { ...EXERCISES.press_banca, repeticiones: "4 series de 6-8 reps pesadas", involucra: ['Hombros', 'Muñecas', 'Codos'] },
        { ...EXERCISES.flexiones, repeticiones: "3 series al fallo (con peso extra si puedes)", involucra: ['Hombros', 'Muñecas'] },
        { ...EXERCISES.fondos_silla, repeticiones: "4 series de 10-12 reps (con peso)", involucra: ['Hombros', 'Muñecas', 'Codos'] }
      ]
    },
    martes: {
        enfoque: 'Espalda y Bíceps (Gym)',
        ejercicios: [
            { ...EXERCISES.dominadas, repeticiones: "4 series al fallo", involucra: ['Hombros', 'Muñecas', 'Codos'] },
            { ...EXERCISES.remo_casero, repeticiones: "4 series de 8-10 reps pesadas/brazo", involucra: [] },
            { ...EXERCISES.curl_biceps_casero, repeticiones: "4 series de 10-12 reps pesadas", involucra: [] }
        ]
    },
    miércoles: {
        enfoque: 'Pierna Pesada (Gym)',
        ejercicios: [
            { ...EXERCISES.sentadillas, repeticiones: "5 series de 5 reps pesadas", involucra: ['Rodillas', 'Espalda Baja'] },
            { ...EXERCISES.prensa, repeticiones: "4 series de 10-12 reps", involucra: ['Rodillas'] },
            { ...EXERCISES.zancadas, repeticiones: "3 series de 10/pierna (con mancuernas)", involucra: ['Rodillas'] },
            { ...EXERCISES.elevacion_talones, repeticiones: "4 series de 20 reps pesadas", involucra: ['Tobillos'] }
        ]
    },
    jueves: {
        enfoque: 'Descanso / Movilidad',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Recuperación activa, estiramientos", involucra: [] }
        ]
    },
    viernes: {
        enfoque: 'Hombro y Core (Gym)',
        ejercicios: [
            { ...EXERCISES.press_militar, repeticiones: "4 series de 8-10 reps", involucra: ['Hombros', 'Muñecas', 'Codos', 'Espalda Baja'] },
            { ...EXERCISES.plancha, repeticiones: "4 series de 60 seg", involucra: ['Hombros', 'Espalda Baja'] },
            { ...EXERCISES.crunch_abdominal, repeticiones: "4 series de 15 reps (con peso)", involucra: ['Espalda Baja'] }
        ]
    },
    sábado: {
        enfoque: 'Full Body Hipertrofia',
        ejercicios: [
            { ...EXERCISES.press_banca, repeticiones: "3 series de 10 reps", involucra: ['Hombros', 'Muñecas', 'Codos'] },
            { ...EXERCISES.sentadillas, repeticiones: "3 series de 10 reps", involucra: ['Rodillas', 'Espalda Baja'] },
            { ...EXERCISES.dominadas, repeticiones: "3 series al fallo", involucra: ['Hombros', 'Muñecas', 'Codos'] }
        ]
    },
    domingo: {
        enfoque: 'Descanso Total',
        ejercicios: [
            { ...EXERCISES.descanso, repeticiones: "Día libre de recuperación", involucra: [] }
        ]
    }
  }
};