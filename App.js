import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import Registro from './screens/Registro';
import Datos from './screens/Datos';
import Planes from './screens/Planes';
import Home from './screens/Home';
import Comidas from './screens/Comidas';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro' }} />
        <Stack.Screen name="Datos" component={Datos} options={{ title: 'Datos' }} />
        <Stack.Screen name="Planes" component={Planes} options={{ title: 'Planes' }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="Comidas" component={Comidas} options={{ title: 'Comidas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
