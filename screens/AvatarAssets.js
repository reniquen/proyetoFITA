// screens/AvatarAssets.js

// Mapea los nombres de estado a los archivos Lottie que descargaste
export const LOTTIE_ASSETS = {
  normal: require('../assets/lotties/Happy user.json'),
  musculoso: require('../assets/lotties/person1.json'),
  
  // Agregamos la animación de "hablar" para el chat
  hablando: require('../assets/lotties/Happy user.json'),
  
  // Puedes agregar más aquí: 'feliz', 'triste', etc.
};

// Estas son las opciones que verá el usuario para personalizar
export const avatarOpciones = ['normal', 'musculoso'];