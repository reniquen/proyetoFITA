import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AvatarCoach from './AvatarCoach';


export default function Datos({ navigation, route }) {
  const [nombre, setNombre] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');

  const [avatarExpandido, setAvatarExpandido] = useState(false);
  const [mensajeChat, setMensajeChat] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

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

  // Función para enviar mensaje a OpenAI
  const enviarMensaje = async () => {
    if (mensajeChat.trim() === '') return;

    // Agregar mensaje del usuario al chat
    setChatHistory(prev => [...prev, { from: 'user', text: mensajeChat }]);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Eres un entrenador virtual que da consejos de salud y ejercicio.' },
            ...chatHistory.map(msg => ({
              role: msg.from === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: mensajeChat }
          ],
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const respuesta = data.choices[0].message.content;

      // Agregar respuesta del avatar
      setChatHistory(prev => [...prev, { from: 'avatar', text: respuesta }]);
      setMensajeChat('');
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { from: 'avatar', text: 'Lo siento, no puedo responder en este momento.' }]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.padre}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 50 }}>
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

        {/* Avatar interactivo */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAvatarExpandido(!avatarExpandido)}
          style={[styles.avatarContainer, avatarExpandido && styles.avatarExpandido]}
        >
          <AvatarCoach />
          <Text style={styles.avatarTexto}>
            {avatarExpandido
              ? '¡Hola! Soy tu coach virtual. Escríbeme para recibir consejos.'
              : '¡Tócame para más consejos! 💪'}
          </Text>
        </TouchableOpacity>

        {/* Chatbot interactivo */}
        {avatarExpandido && (
          <View style={styles.chatContainer}>
            {chatHistory.map((msg, index) => (
              <Text key={index} style={msg.from === 'avatar' ? styles.avatarMsg : styles.userMsg}>
                {msg.text}
              </Text>
            ))}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Escribe un mensaje..."
                style={styles.chatInput}
                value={mensajeChat}
                onChangeText={setMensajeChat}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={enviarMensaje}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#58d68d',
    paddingTop: 20,
  },
  cajaTitulo: {
    paddingVertical: 20,
    backgroundColor: '#fad7a0',
    borderRadius: 10,
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  tarjeta: {
    margin: 20,
    backgroundColor: '#f8c471',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  avatarContainer: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '90%',
  },
  avatarExpandido: {
    padding: 25,
    width: '95%',
  },
  avatarTexto: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  chatContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    maxHeight: 300,
  },
  avatarMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8c471',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#82e0aa',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#58d68d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
});


