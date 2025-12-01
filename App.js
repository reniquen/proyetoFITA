// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { registerRootComponent } from 'expo';

// Providers
import { AvatarProvider } from "./screens/AvatarContext";
import { UserDataProvider, useUserData } from "./screens/UserDataContext";
import { SubscriptionProvider } from "./screens/SubscriptionContext";

// Screens
import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
import AvatarScreen from "./screens/Avatar";
import AvatarChatScreen from "./screens/AvatarChatScreen";
import AdminPanelScreen from "./screens/AdminPanel";
import RegistroScreen from "./screens/Registro";
import ScannerScreen from "./screens/ScannerScreen";
import CalendarRecipesScreen from "./screens/CalendarRecipesScreen";
import SuscripcionScreen from "./screens/SuscripcionScreen";
import AboutUsScreen from "./screens/AboutUs";
import ContadorPasosScreen from "./screens/ContadorPasos";
import DatosScreen from "./screens/Datos";

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

  // AQUÍ ESTÁ LA CORRECCIÓN: El Stack.Navigator limpio sin espacios entre pantallas
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Avatar" component={AvatarScreen} />
      <Stack.Screen name="AvatarChat" component={AvatarChatScreen} />
      <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="Datos" component={DatosScreen} />
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
    <SubscriptionProvider>
      <AvatarProvider>
        <UserDataProvider>
          <NavigationContainer>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
            <Stack.Navigator 
              initialRouteName="Login"
              screenOptions={{
                headerShown: false, // Ocultamos el header por defecto para usar los personalizados
                cardStyle: { backgroundColor: '#F2F5ED' }
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={Home} />
              
              {/* Pantallas del Chat y Avatar */}
              <Stack.Screen name="AvatarChat" component={AvatarChatScreen} />
              <Stack.Screen name="Avatar" component={AvatarScreen} />

              {/* === NUEVAS PANTALLAS REGISTRADAS AQUÍ === */}
              <Stack.Screen name="Suscripcion" component={SuscripcionScreen} />
              <Stack.Screen name="TerminosCondiciones" component={TerminosCondicionesScreen} />
              
              {/* Otras funcionalidades */}
              <Stack.Screen name="CalendarRecipes" component={CalendarRecipesScreen} />
              <Stack.Screen name="Scanner" component={ScannerScreen} />
              <Stack.Screen name="ContadorPasos" component={ContadorPasosScreen} />
              <Stack.Screen name="AboutUs" component={AboutUsScreen} />

            </Stack.Navigator>
          </NavigationContainer>
        </UserDataProvider>
      </AvatarProvider>
    </SubscriptionProvider>
  );
}

registerRootComponent(App);
