import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native'; // Importar View

// --- 1. IMPORTAR SPLASH SCREEN Y EL CONTEXTO ---
import * as SplashScreen from 'expo-splash-screen';
import { AvatarProvider, useAvatar } from './screens/AvatarContext'; 

// Importa TODAS tus pantallas
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import AvatarScreen from './screens/Avatar';
import ComidasScreen from './screens/Comidas';
import AvatarChatScreen from './screens/AvatarChatScreen';
import AdminPanelScreen from './screens/AdminPanel';
import RegistroScreen from './screens/Registro';
import ScannerScreen from './screens/ScannerScreen';

const Stack = createNativeStackNavigator();

// --- 2. EVITAR QUE EL SPLASH SE OCULTE AUTOMÁTICAMENTE ---
SplashScreen.preventAutoHideAsync();

/**
 * Creamos un componente interno que consume el contexto.
 * No podemos usar 'useAvatar' en 'App' porque está fuera del 'AvatarProvider'.
 */
function AppNavigation() {
  
  // 3. Obtenemos el estado de carga del avatar
  const { isLoading } = useAvatar();

  // 4. Creamos un 'onLayout' para evitar parpadeos
  // Ocultamos el splash SOLO cuando el avatar ha cargado Y el layout está listo
  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    // Si el contexto sigue cargando, no renderizamos nada (el splash sigue activo)
    return null; 
  }

  // 5. Renderizamos la app principal en un View con el onLayout
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* Todas tus pantallas */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Avatar" component={AvatarScreen} />
          <Stack.Screen name="Comidas" component={ComidasScreen} />
          <Stack.Screen 
            name="AvatarChat" 
            component={AvatarChatScreen} 
            options={{ headerShown: true, title: 'Chat con tu Avatar' }}
          />
          <Stack.Screen 
            name="AdminPanel" 
            component={AdminPanelScreen} 
            options={{ headerShown: true, title: 'Panel de Admin' }}
          />
          <Stack.Screen 
            name="Registro" 
            component={RegistroScreen} 
            options={{ headerShown: true, title: 'Crear Cuenta' }}
          />
          <Stack.Screen 
            name="Scanner" 
            component={ScannerScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

// El componente App principal ahora solo se encarga de proveer el contexto
export default function App() {
  return (
    <AvatarProvider>
      <AppNavigation />
    </AvatarProvider>
  );
}