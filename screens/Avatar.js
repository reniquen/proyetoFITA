// screens/Avatar.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { useAvatar } from './AvatarContext';
import { LOTTIE_ASSETS, avatarOpciones } from './AvatarAssets';
import LottieView from 'lottie-react-native'; 


export default function Avatar() {
  const { avatar: avatarActual, guardarAvatar, isLoading } = useAvatar();
  
  
  const [selection, setSelection] = useState(avatarActual);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setSelection(avatarActual);
    }
  }, [avatarActual, isLoading]);

  
  const handleGuardar = async () => {
    try {
      await guardarAvatar(selection); 
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar tu avatar.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Personaliza tu Avatar</Text>

      {}
      <View style={styles.previewContainer}>
        <LottieView
          key={selection} 
          source={LOTTIE_ASSETS[selection]} 
          autoPlay
          loop
          style={styles.lottiePreview}
        />
      </View>

      {}
      <View style={styles.selectorSection}>
        <Text style={styles.subtitulo}>Elige tu estilo</Text>
        <FlatList
          data={avatarOpciones}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.opcion,
                item === selection ? styles.seleccionado : null,
              ]}
              onPress={() => setSelection(item)} 
            >
              <Text style={styles.opcionTexto}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.lista}
        />
      </View>

      {}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
          <Text style={styles.botonTexto}>Guardar Cambios</Text>
        </TouchableOpacity>
        {guardado && <Text style={styles.guardado}>✅ ¡Guardado!</Text>}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#58d68d',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  previewContainer: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bdc3c7',
  },
  lottiePreview: {
    width: '100%',
    height: '100%',
  },
  selectorSection: {
    marginBottom: 20,
  },
  lista: {
    paddingVertical: 10,
  },
  opcion: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginRight: 10,
  },
  opcionTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textTransform: 'capitalize',
  },
  seleccionado: {
    borderColor: '#3498db',
    backgroundColor: '#eaf4fd',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  botonGuardar: {
    backgroundColor: '#f39c12',
    paddingVertical: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guardado: {
    marginTop: 15,
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
  },
});