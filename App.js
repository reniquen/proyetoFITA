import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. IMPORTA EL AVATAR PROVIDER
// (Asumiendo que AvatarContext.js está dentro de la carpeta 'screens')
import { AvatarProvider } from './screens/AvatarContext';

// 2. Importa tus pantallas
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import AvatarScreen from './screens/Avatar';
import ComidasScreen from './screens/Comidas';
import AvatarChatScreen from './screens/AvatarChatScreen';
import AdminPanelScreen from './screens/AdminPanel';
import RegistroScreen from './screens/Registro'; // Asegúrate que este archivo exista

const Stack = createNativeStackNavigator();

function App() {
  return (
    // 3. ENVUELVE TU APP CON EL PROVIDER
    <AvatarProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* Todas tus pantallas van aquí dentro */}
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
        </Stack.Navigator>
      </NavigationContainer>
    </AvatarProvider> // 3. (Cierre de la etiqueta)
  );
}

export default App;