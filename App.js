import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as SplashScreen from "expo-splash-screen";

import { AvatarProvider } from "./screens/AvatarContext";
import { UserDataProvider, useUserData } from "./screens/UserDataContext";
import { SubscriptionProvider } from "./screens/SubscriptionContext";

import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
import AvatarScreen from "./screens/Avatar";
import ComidasScreen from "./screens/Comidas";
import AvatarChatScreen from "./screens/AvatarChatScreen";
import AdminPanelScreen from "./screens/AdminPanel";
import RegistroScreen from "./screens/Registro";
import ScannerScreen from "./screens/ScannerScreen";
import CalendarRecipesScreen from "./screens/CalendarRecipesScreen";
import SuscripcionScreen from "./screens/SuscripcionScreen";
import AboutUsScreen from "./screens/AboutUs";
import ContadorPasosScreen from "./screens/ContadorPasos";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isLoadingData } = useUserData();

  useEffect(() => {
    if (!isLoadingData) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingData]);

  if (isLoadingData) {
    return null;
  }

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
      <Stack.Screen name="Suscripcion" component={SuscripcionScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ContadorPasos" component={ContadorPasosScreen} /> 
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AvatarProvider>
      <UserDataProvider>
        <SubscriptionProvider>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </SubscriptionProvider>
      </UserDataProvider>
    </AvatarProvider>
  );
}
