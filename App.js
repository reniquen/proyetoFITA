import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

// --- 1. IMPORTAR LIBRERÍAS DE GESTIÓN ---
import * as SplashScreen from 'expo-splash-screen';
import { AvatarProvider, useAvatar } from './screens/AvatarContext';
import { UserDataProvider, useUserData } from './screens/UserDataContext'; // Contexto de Rutinas/Recetas

// --- 2. IMPORTAR TODAS LAS PANTALLAS ---
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import AvatarScreen from './screens/Avatar';
import ComidasScreen from './screens/Comidas'; 
import AvatarChatScreen from './screens/AvatarChatScreen';
import AdminPanelScreen from './screens/AdminPanel';
import RegistroScreen from './screens/Registro';
import ScannerScreen from './screens/ScannerScreen';
import CalendarRecipesScreen from './screens/CalendarRecipesScreen'; // Pantalla de Calendario

const Stack = createNativeStackNavigator();

// Evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

/**
 * Componente interno para gestionar la navegación y la pantalla de carga.
 */
function AppNavigation() {
  const { isLoading: isLoadingAvatar } = useAvatar();
  const { isLoadingData } = useUserData(); 

  const isLoading = isLoadingAvatar || isLoadingData; // Espera a que ambos carguen

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // Muestra el Splash Screen mientras carga
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* Tus pantallas esenciales */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Avatar" component={AvatarScreen} />
          <Stack.Screen name="Comidas" component={ComidasScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ headerShown: true, title: 'Panel de Admin' }} />
          <Stack.Screen name="Registro" component={RegistroScreen} options={{ headerShown: true, title: 'Crear Cuenta' }} />

          {/* Funciones de IA y Utilidades */}
          <Stack.Screen name="AvatarChat" component={AvatarChatScreen} options={{ headerShown: true, title: 'Chat con tu Avatar' }} />
          <Stack.Screen name="Scanner" component={ScannerScreen} options={{ headerShown: false }} />
          
          {/* --- PANTALLA DEL CALENDARIO --- */}
          <Stack.Screen 
            name="CalendarRecipes" 
            component={CalendarRecipesScreen} 
            options={{ 
              headerShown: true, 
              title: 'Calendario de Recetas' 
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

// El componente App principal ahora envuelve con AMBOS providers
export default function App() {
  return (
    <AvatarProvider>
      <UserDataProvider>
        <AppNavigation />
      </UserDataProvider>
    </AvatarProvider>
  );
}