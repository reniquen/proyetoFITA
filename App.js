import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

// --- PANTALLAS ---
import LoginScreen from './screens/Login'; 
import Home from './screens/Home';
import AvatarChatScreen from './screens/AvatarChatScreen';
import SuscripcionScreen from './screens/SuscripcionScreen';
import TerminosCondicionesScreen from './screens/TerminosCondicionesScreen';
import CalendarRecipesScreen from './screens/CalendarRecipesScreen'; 
import ScannerScreen from './screens/ScannerScreen'; 
import ContadorPasosScreen from './screens/ContadorPasos'; 
import AboutUsScreen from './screens/AboutUs'; 
import AvatarScreen from './screens/Avatar'; 
import AdminPanelScreen from './screens/AdminPanel'; 


// =========================================================
// ✅ CORRECCIÓN 1: Importar el componente de Datos
import DatosScreen from './screens/Datos'; 
// =========================================================

// Contextos
import { UserDataProvider } from './screens/UserDataContext';
import { AvatarProvider } from './screens/AvatarContext';
import { SubscriptionProvider } from './screens/SubscriptionContext';
import { StepProvider } from './screens/PasosContext';
import Registro from './screens/Registro';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SubscriptionProvider>
      <AvatarProvider>
        <UserDataProvider>
          <StepProvider>
            
            <NavigationContainer>
              <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
              <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                  headerShown: false, 
                  cardStyle: { backgroundColor: '#F2F5ED' }
                }}
              >
                {/* ========================================================= */}
                {/* ✅ REGISTRO DE PANTALLAS */}
                {/* ========================================================= */}
                
                <Stack.Screen name="Login" component={LoginScreen} />
                
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Registro" component={Registro} />
                
                {/* Pantallas del Chat y Avatar */}
                <Stack.Screen name="AvatarChat" component={AvatarChatScreen} />
                <Stack.Screen name="Avatar" component={AvatarScreen} />

                {/* === PANTALLAS DE FUNCIONALIDAD === */}
                <Stack.Screen name="Suscripcion" component={SuscripcionScreen} />
                <Stack.Screen name="TerminosCondiciones" component={TerminosCondicionesScreen} />
                
                {/* Otras funcionalidades */}
                <Stack.Screen name="CalendarRecipes" component={CalendarRecipesScreen} />
                <Stack.Screen name="Scanner" component={ScannerScreen} />
                <Stack.Screen name="ContadorPasos" component={ContadorPasosScreen} />
                <Stack.Screen name="AboutUs" component={AboutUsScreen} />
                
                <Stack.Screen name="AdminPanel" component={AdminPanelScreen} /> 
                
                {/* ========================================================= */}
                {/* ✅ CORRECCIÓN 2: Registrar la pantalla Datos */}
                <Stack.Screen name="Datos" component={DatosScreen} />
                {/* ========================================================= */}
                
              </Stack.Navigator>
            </NavigationContainer>

          </StepProvider>
        </UserDataProvider>
      </AvatarProvider>
    </SubscriptionProvider>
  );
}