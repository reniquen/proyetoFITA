// screens/avatarAssets.js
// --- ¡DEBES CREAR ESTAS IMÁGENES EN assets/avatar/! ---
// He usado nombres de ejemplo. Si no tienes las imágenes, la app fallará.
// Te recomiendo empezar creando estas 6 imágenes:

export const AVATAR_ASSETS = {
    cabeza: {
      normal: require('./imagenes/cabeza.webp'),
      feliz: require('./imagenes/cabeza_feliz.png'),
    },
    torso: {
      normal: require('./imagenes/torso_normal.PNG'),
      musculoso: require('./imagenes/torso_musculoso.PNG'),
      flaco: require('./imagenes/torso_gordo.PNG'),
    },
    piernas: {
      normal: require('./imagenes/piernas_normales.PNG'),
      musculosas: require('./imagenes/piernas_normales.PNG'),
      flacas: require('./imagenes/piernas_gordas.PNG'),
    },
  };
  
  // Obtenemos las "llaves" de cada categoría para los selectores
  export const cabezaOpciones = Object.keys(AVATAR_ASSETS.cabeza);
  export const torsoOpciones = Object.keys(AVATAR_ASSETS.torso);
  export const piernasOpciones = Object.keys(AVATAR_ASSETS.piernas);