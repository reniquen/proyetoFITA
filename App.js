import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as SplashScreen from "expo-splash-screen";

// Providers globales
import { AvatarProvider } from "./screens/AvatarContext";
import { UserDataProvider, useUserData } from "./screens/UserDataContext";

// Pantallas
import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
import AvatarScreen from "./screens/Avatar";
import ComidasScreen from "./screens/Comidas";
import AvatarChatScreen from "./screens/AvatarChatScreen";
import AdminPanelScreen from "./screens/AdminPanel";
import RegistroScreen from "./screens/Registro";
import ScannerScreen from "./screens/ScannerScreen";
import CalendarRecipesScreen from "./screens/CalendarRecipesScreen";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isLoadingData } = useUserData();

  useEffect(() => {
    // Oculta el Splash Screen solo cuando los datos hayan cargado
    if (!isLoadingData) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingData]);

  // No renderiza nada hasta que los datos estén listos
  if (isLoadingData) {
    return null;
  }

  // ✅ CORRECCIÓN:
  // Se eliminó el <NavigationContainer> que estaba aquí.
  // Ahora solo retorna el Stack.Navigator, que es lo correcto.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Avatar" component={AvatarScreen} />
      <Stack.Screen name="Comidas" component={ComidasScreen} />
      <Stack.Screen name="AvatarChat" component={AvatarChatScreen} />
      <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="CalendarRecipes" component={CalendarRecipesScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AvatarProvider>
      <UserDataProvider>
        {/* ✅ CORRECCIÓN:
            El <NavigationContainer> debe ir aquí, en el componente raíz,
            envolviendo a toda tu navegación.
        */}
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </UserDataProvider>
    </AvatarProvider>
  );
}