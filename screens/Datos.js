import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AvatarCoach from './AvatarCoach';

export default function Datos({ navigation, route }) {
  const [nombre, setNombre] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');

  const userId = route.params?.userId;

  const calcularIMC = async () => {
    const alturaEnMetros = parseFloat(altura);
    const pesoEnKg = parseFloat(peso);

    if (isNaN(alturaEnMetros) || isNaN(pesoEnKg) || alturaEnMetros <= 0 || pesoEnKg <= 0) {
      Alert.alert('Error', 'Por favor, complete los datos solicitados.');
      return;
    }

    const imc = pesoEnKg / (alturaEnMetros * alturaEnMetros);
    let estado = '';

    if (imc < 18.5) {
      estado = 'bajo de peso';
    } else if (imc >= 18.5 && imc < 24.9) {
      estado = 'en un peso saludable';
    } else if (imc >= 25 && imc < 29.9) {
      estado = 'con sobrepeso';
    } else {
      estado = 'en obesidad';
    }

    try {
      await updateDoc(doc(db, 'usuarios', userId), {
        altura: alturaEnMetros,
        peso: pesoEnKg,
        imc: imc,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar los datos.');
      return;
    }

    Alert.alert(
      `Hola, ${nombre || 'Usuario'}`,
      `Su IMC es de: ${imc.toFixed(1)}. Por ende usted está ${estado}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Planes', { userId }),
        },
      ]
    );
  };

  return (
    <View style={styles.padre}>
      <View style={styles.cajaTitulo}>
        <Text style={{ paddingHorizontal: 15, fontSize: 20 }}>Ingrese los datos solicitados</Text>
      </View>
      <View style={styles.tarjeta}>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Ingrese su nombre"
            style={{ paddingHorizontal: 15 }}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Ingrese su altura en metros (ej: 1.75)"
            style={{ paddingHorizontal: 15 }}
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Ingrese su peso en kg"
            style={{ paddingHorizontal: 15 }}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.padreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={calcularIMC}>
            <Text style={styles.textoBoton}>Guardar Datos</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <AvatarCoach />
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#58d68d',
  },
  cajaTitulo: {
    paddingVertical: 20,
    backgroundColor: '#fad7a0',
    borderRadius: 10,
    alignContent: 'center',
    marginTop: 5,
    alignSelf: 'center',
  },
  tarjeta: {
    margin: 20,
    backgroundColor: '#f8c471',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 20,
    backgroundColor: '#fad7a0',
    borderRadius: 50,
    marginVertical: 10,
  },
  cajaBoton: {
    backgroundColor: '#82e0aa',
    borderRadius: 50,
    paddingVertical: 20,
    width: 120,
    marginTop: 20,
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  textoBoton: {
    textAlign: 'center',
    color: 'Black',
  },
  padreBoton: {
    alignItems: 'center',
  },
});
