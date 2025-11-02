// screens/avatarAssets.js
// --- ¡DEBES CREAR ESTAS IMÁGENES EN assets/avatar/! ---
// He usado nombres de ejemplo. Si no tienes las imágenes, la app fallará.
// Te recomiendo empezar creando estas 6 imágenes:

export const AVATAR_ASSETS = {
  cabeza: {
    normal: require('../assets/avatar/cabeza.webp'),
    feliz: require('../assets/avatar/cabeza_feliz.png'),
  },
  torso: {
    normal: require('../assets/avatar/cabeza_feliz.png'),
    musculoso: require('../assets/avatar/cabeza_feliz.png'),
    flaco: require('../assets/avatar/cabeza_feliz.png'),
  },
  piernas: {
    normal: require('../assets/avatar/cabeza_feliz.png'),
    musculosas: require('../assets/avatar/cabeza_feliz.png'),
    flacas: require('../assets/avatar/cabeza_feliz.png'),
  },
};

// Obtenemos las "llaves" de cada categoría para los selectores
export const cabezaOpciones = Object.keys(AVATAR_ASSETS.cabeza);
export const torsoOpciones = Object.keys(AVATAR_ASSETS.torso);
export const piernasOpciones = Object.keys(AVATAR_ASSETS.piernas);