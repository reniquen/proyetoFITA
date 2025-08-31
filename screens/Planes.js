import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function Planes({ navigation, route }) {
  const userId = route.params?.userId;

  const seleccionarPlan = async (plan) => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el usuario.');
      return;
    }
    try {
      await updateDoc(doc(db, 'usuarios', userId), {
        plan: plan,
      });
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el plan.');
    }
  };

  return (
    <ScrollView style={styles.contenedorScroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.padre}>
        <View style={styles.cajaTitulo}>
          <Text style={styles.titulo}>Plan 1: Perder Peso</Text>
        </View>
        <View style={styles.tarjeta}>
          <View style={styles.row}>
            <Image source={require('../assets/cardio.png')} style={styles.imagen} />
            <Text style={styles.descripcion}>
              Enfocado en ejercicios de cardio y dietas que se complementen, para así tener una perdida de grasa más rápida.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => seleccionarPlan('plan1')}
          >
            <Text style={styles.botonTexto}>Escoger</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cajaTitulo}>
          <Text style={styles.titulo}>Plan 2: Vida Saludable</Text>
        </View>
        <View style={styles.tarjeta}>
          <View style={styles.row}>
            <Image source={require('../assets/vidasaludable.png')} style={styles.imagen} />
            <Text style={styles.descripcion}>
              Una mezcla entre ejercicios de fuerza y cardio, además de dietas saludables, para una vida saludable.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => seleccionarPlan('plan2')}
          >
            <Text style={styles.botonTexto}>Escoger</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cajaTitulo}>
          <Text style={styles.titulo}>Plan 3: Aumento de masa muscular</Text>
        </View>
        <View style={styles.tarjeta}>
          <View style={styles.row}>
            <Image source={require('../assets/masamuscular.png')} style={styles.imagen} />
            <Text style={styles.descripcion}>
              Enfocado en ganar músculo combinando ejercicios de fuerza, dietas adecuadas y cargas progresivas para mejorar continuamente.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => seleccionarPlan('plan3')}
          >
            <Text style={styles.botonTexto}>Escoger</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  padre:{
      flex:1,
      justifyContent:'flex-start',
      alignItems: 'center',
      backgroundColor: '#58d68d',
  },
  cajaTitulo:{
      paddingVertical: 20,
      backgroundColor: '#fad7a0',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: 3
    },
    tarjeta:{
      margin:20,
      backgroundColor:'#f8c471',
      borderRadius:20,
      width:'90%',
      padding:20,
      shadowColor:'#000',
      shadowOffset:{
          width:0,
          height:2,
      },
      shadowOpacity:0.25,
      shadowRadius:4,
      elevation:5
    },
    imagen: {
      width: 100,
      height: 100,
      marginRight: 10,
  },
  descripcion: {
    flex: 1,
    fontSize: 16,
},
row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
titulo: {
  fontSize: 15,
  paddingHorizontal: 15,
},
boton:{
  backgroundColor:'#82e0aa',
  borderRadius:50,
  paddingVertical:20,
  width:'100%',
  marginTop:20,
  shadowOpacity:1,
  shadowRadius:5,
  elevation:5,
  alignContent:'center'
},
botonTexto:{
  textAlign:'center',
  color:'Black',
  fontWeight:'bold'
}
})

