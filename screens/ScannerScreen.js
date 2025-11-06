// screens/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
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

  // 2. Función que se llama al escanear un código
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true); // Marca como escaneado para evitar múltiples lecturas
    setIsLoading(true); // Muestra el indicador de carga

    console.log(`Código escaneado (${type}): ${data}`);

    try {
      // 3. Llamada a la API de Open Food Facts
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const json = await response.json();
      setIsLoading(false); // Oculta el indicador de carga

      // 4. Revisar si la API encontró el producto
      if (json.status === 1) {
        const product = json.product;
        const productName = product.product_name_es || product.product_name || "Nombre no encontrado";
        const nutriments = product.nutriments || {};
        
        // Obtenemos los datos por 100g. Usamos '|| 0' por si el dato no existe
        const protein = nutriments['proteins_100g'] || 0;
        const carbs = nutriments['carbohydrates_100g'] || 0;
        const fat = nutriments['fat_100g'] || 0;
        const energy = nutriments['energy-kcal_100g'] || 0;

        // 5. Mostrar los resultados en una alerta
        Alert.alert(
          `Producto: ${productName}`,
          `Info Nutricional (por 100g):\n\nKcal: ${energy} kcal\nProteínas: ${protein} g\nCarbohidratos: ${carbs} g\nGrasas: ${fat} g`,
          [
            { text: 'Escanear de Nuevo', onPress: () => setScanned(false) },
            { text: 'Volver', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        // 4b. Producto no encontrado
        Alert.alert(
          'Producto no encontrado',
          'Este código de barras no se encontró en la base de datos de Open Food Facts.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      // 4c. Error de red
      setIsLoading(false);
      console.error(error);
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor. Intenta de nuevo.', [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
    }
  };

  // 6. Mostrar estados de permiso
  if (hasPermission === null) {
    return <Text style={styles.text}>Solicitando permiso de la cámara...</Text>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sin acceso a la cámara</Text>
        <Text style={styles.textSmall}>Debes habilitar el permiso en la configuración de tu teléfono para usar el escáner.</Text>
        <Button title={'Volver'} onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // 7. Mostrar el escáner
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Overlay para guiar al usuario */}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Apunta al código de barras del producto</Text>
        <View style={styles.scanBox} />
      </View>

      {/* Indicador de carga */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Buscando información...</Text>
        </View>
      )}

      {/* Botón para volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Estilos para el Escáner ---
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
    top: '20%',
  },
  scanBox: {
    width: '80%',
    height: '30%',
    borderWidth: 2,
    borderColor: '#4CAF50', // Verde
    borderRadius: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});