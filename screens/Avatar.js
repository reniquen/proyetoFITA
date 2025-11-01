// screens/Avatar.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useAvatar } from './AvatarContext';
import { AVATAR_ASSETS, cabezaOpciones, torsoOpciones, piernasOpciones } from './AvatarAssets'; // Importamos las imágenes

// Componente para la Vista Previa del Avatar
const AvatarPreview = ({ parts, style }) => {
  return (
    <View style={[styles.previewContainer, style]}>
      {/* Las imágenes se apilan usando 'position: absolute' */}
      <Image
        source={AVATAR_ASSETS.piernas[parts.piernas]}
        style={[styles.avatarPart, styles.piernas]}
        resizeMode="contain"
      />
      <Image
        source={AVATAR_ASSETS.torso[parts.torso]}
        style={[styles.avatarPart, styles.torso]}
        resizeMode="contain"
      />
      <Image
        source={AVATAR_ASSETS.cabeza[parts.cabeza]}
        style={[styles.avatarPart, styles.cabeza]}
        resizeMode="contain"
      />
    </View>
  );
};

// Componente para un selector de partes (Cabeza, Torso, Piernas)
const PartSelector = ({ title, partKey, options, selectedValue, onSelect }) => {
  return (
    <View style={styles.selectorSection}>
      <Text style={styles.subtitulo}>{title}</Text>
      <FlatList
        data={options}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.opcion,
              item === selectedValue ? styles.seleccionado : null,
            ]}
            onPress={() => onSelect(partKey, item)}
          >
            {/* Opcional: podrías mostrar una mini-imagen de la parte aquí */}
            <Text style={styles.opcionTexto}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
};

// Componente principal de Avatar
export default function Avatar() {
  const { avatar: avatarActual, guardarAvatar, isLoading } = useAvatar();
  
  // Estado temporal para la vista previa de los cambios
  const [selection, setSelection] = useState(avatarActual);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setSelection(avatarActual);
    }
  }, [avatarActual, isLoading]);

  // Handler para actualizar la selección temporal
  const handleSelectPart = (partKey, value) => {
    setSelection(prev => ({ ...prev, [partKey]: value }));
  };

  // Handler para guardar en el Context y AsyncStorage
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

      {/* Vista previa */}
      <AvatarPreview parts={selection} />

      {/* Selectores */}
      <PartSelector
        title="Cabeza"
        partKey="cabeza"
        options={cabezaOpciones}
        selectedValue={selection.cabeza}
        onSelect={handleSelectPart}
      />

      <PartSelector
        title="Torso y Brazos"
        partKey="torso"
        options={torsoOpciones}
        selectedValue={selection.torso}
        onSelect={handleSelectPart}
      />

      <PartSelector
        title="Piernas"
        partKey="piernas"
        options={piernasOpciones}
        selectedValue={selection.piernas}
        onSelect={handleSelectPart}
      />

      {/* Botón de Guardar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
          <Text style={styles.botonTexto}>Guardar Cambios</Text>
        </TouchableOpacity>
        {guardado && <Text style={styles.guardado}>✅ ¡Guardado!</Text>}
      </View>
    </ScrollView>
  );
}

// --- Nuevos Estilos para el Personalizador ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
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
  // --- Estilos de la Vista Previa ---
  previewContainer: {
    width: 200,
    height: 350, // Ajusta esta altura
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#bdc3c7',
    position: 'relative', // Contenedor para las imágenes absolutas
  },
  avatarPart: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Clave para apilar
    top: 0,
    left: 0,
  },
  // Ajusta estos estilos para que tus imágenes encajen
  cabeza: { zIndex: 3, height: '30%' },
  torso: { zIndex: 2, height: '60%', top: '25%' }, // Ejemplo: empieza al 25%
  piernas: { zIndex: 1, height: '50%', top: '50%' }, // Ejemplo: empieza al 50%

  // --- Estilos de los Selectores ---
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
  // --- Footer ---
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