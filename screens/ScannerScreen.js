import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Pedir permiso para la cámara al cargar la pantalla
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  
  const analizarCalorias = (kcal) => {
    
    if (kcal === 0) return "No disponible";
    if (kcal < 150) return "🟢 Buena (Baja densidad)";
    if (kcal < 350) return "🟡 Media (Moderada)";
    if (kcal < 550) return "🟠 Mala (Alta densidad)";
    return "🔴 Horrible (Muy alta densidad)";
  };

  // 2. Función que se llama al escanear un código
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true); 
    setIsLoading(true); 

    console.log(`Código escaneado (${type}): ${data}`);

    try {
      // 3. Llamada a la API de Open Food Facts
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const json = await response.json();
      setIsLoading(false); 

      
      if (json.status === 1) {
        const product = json.product;
        const productName = product.product_name_es || product.product_name || "Nombre no encontrado";
        const nutriments = product.nutriments || {};
        
        
        const protein = nutriments['proteins_100g'] || 0;
        const carbs = nutriments['carbohydrates_100g'] || 0;
        const fat = nutriments['fat_100g'] || 0;
        const energy = nutriments['energy-kcal_100g'] || 0;

      
        const calificacionCalorias = analizarCalorias(energy);

        
        Alert.alert(
          `🔍 ${productName}`,
          `\n📊 RESUMEN NUTRICIONAL (100g):\n` +
          `-----------------------------------\n` +
          `🔥 Calorías: ${energy} kcal\n` +
          `   ➤ Clasificación: ${calificacionCalorias}\n\n` +
          `🥩 Proteínas: ${protein} g\n` +
          `🍞 Carbohidratos: ${carbs} g\n` +
          `🥑 Grasas: ${fat} g\n` +
          `-----------------------------------`,
          [
            { text: 'Escanear de Nuevo', onPress: () => setScanned(false) },
            { text: 'Volver', onPress: () => navigation.goBack() }
          ]
        );
      } else {
       
        Alert.alert(
          'Producto no encontrado',
          'Este código no está en la base de datos.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      
      setIsLoading(false);
      console.error(error);
      Alert.alert('Error de Red', 'Verifica tu conexión a internet.', [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
    }
  };

  
  if (hasPermission === null) {
    return <Text style={styles.text}>Solicitando permiso de la cámara...</Text>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sin acceso a la cámara</Text>
        <Text style={styles.textSmall}>Debes habilitar el permiso en la configuración de tu teléfono.</Text>
        <Button title={'Volver'} onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
    
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Apunta al código de barras</Text>
        <View style={styles.scanBox} />
      </View>

     
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Analizando producto...</Text>
        </View>
      )}

    
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
  textSmall: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: '15%',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4CAF50', 
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    marginTop: 15,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(231, 76, 60, 0.9)', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});