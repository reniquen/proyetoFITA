// ====================================================================
// CATÁLOGO DE EJERCICIOS CON LOTTIE
// ====================================================================
// NOTA: Asegúrate de que 'assets/ejercicios/sentadillas.json' exista.

export const EXERCISE_CATALOG = {
    // PIERNAS
    sentadillas: {
        nombre: "Sentadillas con Barra",
        video: "https://www.youtube.com/watch?v=dsCuiccYNGs",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    prensa: {
        nombre: "Prensa de Pierna",
        video: "https://www.youtube.com/watch?v=MTfwemR8QMQ",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    hack_squat: {
        nombre: "Hack Squat",
        video: "https://www.youtube.com/watch?v=0tn5K9NlCfo",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    bulgara: {
        nombre: "Sentadilla Búlgara",
        video: "https://www.youtube.com/watch?v=7zBnXPL5cck",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    abductores: {
        nombre: "Máquina de Abductores",
        video: "https://www.youtube.com/watch?v=fItDiXXZyZo",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },

    // PECHO/ESPALDA
    press_banca: {
        nombre: "Press de Banca",
        video: "https://www.youtube.com/watch?v=GeLq8cMODLc",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    remo: {
        nombre: "Remo con Barra",
        video: "https://www.youtube.com/watch?v=3uiWjik2yEQ",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    dominadas: {
        nombre: "Dominadas",
        video: "https://www.youtube.com/watch?v=fJ1Sq208UVA",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    pullover: {
        nombre: "Pull Over en Polea",
        video: "https://www.youtube.com/watch?v=9YQ1YXKko8s",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    cruce_poleas: {
        nombre: "Cruce de Poleas",
        video: "https://www.youtube.com/watch?v=gFoMzh-5H-8",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },

    // HOMBROS/BRAZOS/CARDIO
    press_militar: {
        nombre: "Press Militar",
        video: "https://www.youtube.com/watch?v=waeCyaAQRn8",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    laterales_polea: {
        nombre: "Elevaciones Laterales",
        video: "https://www.youtube.com/watch?v=gjUrYfNU1-M",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    burpees: {
        nombre: "Burpees",
        video: "https://www.youtube.com/watch?v=IYusabTdFEo",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    mountain_climbers: {
        nombre: "Mountain Climbers",
        video: "https://www.youtube.com/watch?v=cnyTQDSE884",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },
    cuerda: {
        nombre: "Saltar la Cuerda",
        video: "https://www.youtube.com/watch?v=rpS3MQgxdA0",
        animacion: require('../assets/ejercicios/sentadillas.json')
    },

    // OTROS
    descanso: {
        nombre: "Descanso Total",
        repeticiones: "Día libre",
        animacion: null,
        video: null
    },
};

// ====================================================================
// RUTINAS POR DEFECTO
// ====================================================================

export const DEFAULT_USER_ROUTINES = {
    lunes: [
        { ...EXERCISE_CATALOG.sentadillas, repeticiones: "4 series de 10 reps" },
        { ...EXERCISE_CATALOG.prensa, repeticiones: "4 series de 12 reps" },
        { ...EXERCISE_CATALOG.hack_squat, repeticiones: "3 series de 12 reps" },
    ],
    martes: [
        { ...EXERCISE_CATALOG.press_militar, repeticiones: "4 series de 8 reps" },
        { ...EXERCISE_CATALOG.laterales_polea, repeticiones: "3 series de 15 reps" },
        // { ...EXERCISE_CATALOG.posterior, repeticiones: "3 series de 15 reps" }, // Falta en catálogo
    ],
    miércoles: [
        { ...EXERCISE_CATALOG.dominadas, repeticiones: "4 series al fallo" },
        { ...EXERCISE_CATALOG.remo, repeticiones: "4 series de 10 reps" },
        { ...EXERCISE_CATALOG.pullover, repeticiones: "3 series de 12 reps" },
    ],
    jueves: [
        { ...EXERCISE_CATALOG.bulgara, repeticiones: "4 series de 12 reps" },
        // { ...EXERCISE_CATALOG.pesom, repeticiones: "4 series de 10 reps" }, // Falta en catálogo
        { ...EXERCISE_CATALOG.abductores, repeticiones: "4 series de 10 reps" },
    ],
    viernes: [
        { ...EXERCISE_CATALOG.press_banca, repeticiones: "4 series de 8 reps" },
        { ...EXERCISE_CATALOG.cruce_poleas, repeticiones: "4 series de 12 reps" },
        { ...EXERCISE_CATALOG.laterales_polea, repeticiones: "3 series de 15 reps" },
    ],
    sábado: [
        { ...EXERCISE_CATALOG.burpees, repeticiones: "3 series de 10 reps" },
        { ...EXERCISE_CATALOG.mountain_climbers, repeticiones: "4 series de 12 reps" },
        { ...EXERCISE_CATALOG.cuerda, repeticiones: "1 serie de 15 minutos" },
    ],
    domingo: [
        { nombre: "Descanso Activo", repeticiones: "Yoga o caminata 30min", animacion: null },
    ],
};

export const AI_SUGGESTED_ROUTINES = {
    PIERNAS_LIGERO: [
        { ...EXERCISE_CATALOG.bulgara, repeticiones: "3 series de 10 reps" },
        { ...EXERCISE_CATALOG.abductores, repeticiones: "3 series de 10 reps" },
        { nombre: "Extensiones de Cuádriceps", repeticiones: "3 series de 15 reps", animacion: null, video: null },
    ],
    PECHO_ESPALDA_FUERTE: [
        { ...EXERCISE_CATALOG.press_banca, repeticiones: "5 series de 5 reps (Pesado)" },
        { ...EXERCISE_CATALOG.dominadas, repeticiones: "4 series al fallo (Máximo)" },
        { ...EXERCISE_CATALOG.remo, repeticiones: "4 series de 8 reps (Pesado)" },
    ],
    CARDIO_HIIT: [
        { ...EXERCISE_CATALOG.burpees, repeticiones: "3 series de 1 min" },
        { ...EXERCISE_CATALOG.mountain_climbers, repeticiones: "4 series de 1 min" },
        { ...EXERCISE_CATALOG.cuerda, repeticiones: "2 series de 10 minutos" },
    ],
};

export const { sentadillas, prensa, hack_squat, bulgara, abductores, press_banca, remo, dominadas, pullover, cruce_poleas, press_militar, laterales_polea, burpees, mountain_climbers, cuerda, descanso } = EXERCISE_CATALOG;

export default DEFAULT_USER_ROUTINES;