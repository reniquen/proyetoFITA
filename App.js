import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

// Importa tus pantallas
import LoginScreen from './screens/Login'; // Asumo que tienes un Login
import Home from './screens/Home';
import AvatarChatScreen from './screens/AvatarChatScreen';
import SuscripcionScreen from './screens/SuscripcionScreen';
import TerminosCondicionesScreen from './screens/TerminosCondicionesScreen';
import CalendarRecipesScreen from './screens/CalendarRecipesScreen'; // Si la tienes
import ScannerScreen from './screens/ScannerScreen'; // Si la tienes
import ContadorPasosScreen from './screens/ContadorPasos'; // Si la tienes
import AboutUsScreen from './screens/AboutUs'; // Si la tienes
import AvatarScreen from './screens/Avatar'; // Si la tienes

// Contextos
import { UserDataProvider } from './screens/UserDataContext';
import { AvatarProvider } from './screens/AvatarContext';
import { SubscriptionProvider } from './screens/SubscriptionContext';

const Stack = createStackNavigator();

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

