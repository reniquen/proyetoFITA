import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDzEtjcSM4tjZldSQFcGrMFKR9QzDGhYfI',
  authDomain: 'fiitaa.firebaseapp.com',
  databaseURL: 'https://fiitaa-default-rtdb.firebaseio.com',
  projectId: 'fiitaa',
  storageBucket: 'fiitaa.appspot.com',
  messagingSenderId: '1079954200207',
  appId: '1:1079954200207:web:27fe9f11378653f63ac2fa',
  measurementId: 'G-6CT8SVG55W',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { db, rtdb, auth };
