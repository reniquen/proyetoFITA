// screens/CalendarRecipesScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useUserData } from './UserDataContext';
// 👇 1. IMPORTAMOS NAVEGACIÓN E ICONOS
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Configuración de idioma (Español)
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['D','L','M','M','J','V','S'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// Colores del tema (Mezcla: Estilo Foodie con botones sólidos)
const THEME = {
  background: '#E6E4DC',    // Beige grisáceo de fondo general
  cardBg: '#FFFFFF',        // Blanco puro para la tarjeta
  accent: '#8DC63F',        // Verde Lima (Color principal de selección)
  dayButtonBg: '#F2F0EB',   // Color "Hueso/Beige" para los botones (para que se vean remarcados)
  textPrimary: '#4A4A4A',   
  textSecondary: '#8D6E63', 
};

export default function CalendarRecipesScreen() {
  // 👇 2. INICIALIZAMOS NAVEGACIÓN
  const navigation = useNavigation();
  
  // 1. Obtenemos también el estado de carga del contexto
  const { recetasCalendar, addRecipeToCalendar, isLoadingData } = useUserData();
  const [selectedDate, setSelectedDate] = useState('');
  const [newRecipe, setNewRecipe] = useState('');

  // --- 2. BLOQUE DE SEGURIDAD (Igual que en Home.js) ---
  if (isLoadingData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.background }}>
        <ActivityIndicator size="large" color={THEME.accent} />
        <Text style={{ marginTop: 15, color: THEME.textPrimary, fontSize: 16, fontWeight: '600' }}>
            Cargando tu calendario de recetas...
        </Text>
      </View>
    );
  }
  // ----------------------------------------------------

  // Lógica de marcadores (puntos).
  const markedDates = Object.keys(recetasCalendar || {}).reduce((acc, date) => {
    acc[date] = { marked: true };
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true };
  }

  const handleAdd = () => {
    if (newRecipe.trim()) {
      addRecipeToCalendar(selectedDate, newRecipe);
      setNewRecipe('');
      Alert.alert("Guardado", "Receta añadida correctamente.");
    }
  };

  // --- COMPONENTE PERSONALIZADO PARA EL DÍA (ESTILO OTOÑAL/BOTÓN) ---
  const renderCustomDay = ({ date, state, marking }) => {
    const isSelected = date.dateString === selectedDate;
    const isToday = state === 'today';
    const isDisabled = state === 'disabled';

    if (isDisabled) return <View style={styles.dayContainerEmpty} />;

    return (
      <TouchableOpacity 
        onPress={() => setSelectedDate(date.dateString)}
        activeOpacity={0.7}
        style={[
          styles.dayContainer, 
          isSelected 
            ? { backgroundColor: THEME.accent, elevation: 4 } 
            : { backgroundColor: THEME.dayButtonBg }
        ]}
      >
        <Text style={[
          styles.dayText, 
          isSelected ? { color: 'white', fontWeight: 'bold' } : { color: THEME.textPrimary },
          isToday && !isSelected && { color: THEME.accent, fontWeight: 'bold' } 
        ]}>
          {date.day}
        </Text>
        
        {marking?.marked && (
          <View style={[
            styles.dot, 
            { backgroundColor: isSelected ? 'white' : THEME.accent }
          ]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: 30 }}>
      
      {/* 1. Cabecera con Imagen */}
      <View style={styles.headerImageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
          style={styles.headerImage} 
        />
        
        {/* 👇 3. BOTÓN DE VOLVER (FLOTANTE SOBRE LA IMAGEN) */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.textPrimary} />
        </TouchableOpacity>

        <View style={styles.overlayTitle}>
          <Text style={styles.yearText}>2025</Text>
          <Text style={styles.subtitleText}>PLANIFICADOR DE COMIDAS</Text>
        </View>
      </View>

      {/* 2. Tarjeta del Calendario (Ahora con botones personalizados) */}
      <View style={styles.calendarCard}>
        <Calendar
          dayComponent={renderCustomDay}
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: '#b6c1cd',
            arrowColor: THEME.accent,
            monthTextColor: THEME.textPrimary,
            textMonthFontWeight: 'bold',
            textMonthFontSize: 20,
            textDayHeaderFontWeight: '600',
            textDayHeaderFontSize: 13,
          }}
          markedDates={markedDates}
        />
      </View>

      {/* 3. Sección de Detalles */}
      <View style={styles.detailsContainer}>
        <View style={styles.dateHeaderBox}>
            <Text style={styles.dateTitle}>
            {selectedDate ? `MENÚ DEL DÍA: ${selectedDate}` : 'SELECCIONA UNA FECHA'}
            </Text>
        </View>

        {selectedDate && (
          <>
            <FlatList
              data={(recetasCalendar && recetasCalendar[selectedDate]) || []}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.recipeItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.recipeText}>{item}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay comidas planificadas.</Text>
              }
            />

            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Escribe tu receta aquí..."
                placeholderTextColor="#999"
                value={newRecipe}
                onChangeText={setNewRecipe}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>AGREGAR</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: THEME.background },
  
  // --- Cabecera ---
  headerImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  // 👇 ESTILO DEL BOTÓN VOLVER
  backButton: {
    position: 'absolute',
    top: 45, // Ajuste para que no choque con la barra de estado
    left: 20,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 6,
    zIndex: 10, // Para que quede encima de la imagen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  overlayTitle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderRadius: 4
  },
  yearText: { fontSize: 28, fontWeight: 'bold', color: THEME.accent },
  subtitleText: { fontSize: 10, letterSpacing: 2, color: THEME.textSecondary, fontWeight: '700', marginTop: 2 },

  // --- Calendario ---
  calendarCard: {
    backgroundColor: THEME.cardBg,
    marginHorizontal: 15,
    marginTop: -30,
    borderRadius: 8,
    padding: 10,
    paddingBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  dayContainer: {
    width: 42, 
    height: 42, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, 
    margin: 2,
  },
  dayContainerEmpty: {
    width: 42, height: 42, margin: 2 
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 3,
  },

  // --- Detalles ---
  detailsContainer: { paddingHorizontal: 20, marginTop: 20 },
  dateHeaderBox: { borderLeftWidth: 4, borderLeftColor: THEME.accent, paddingLeft: 10, marginBottom: 15 },
  dateTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.textPrimary, textTransform: 'uppercase' },
  recipeItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginBottom: 8,
    borderRadius: 6, borderWidth: 1, borderColor: '#eee'
  },
  bulletPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.accent, marginRight: 10 },
  recipeText: { fontSize: 15, color: '#333', flex: 1 },
  emptyText: { fontStyle: 'italic', color: '#888', marginBottom: 15 },
  inputWrapper: { marginTop: 5 },
  input: { backgroundColor: '#fff', padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#ddd', color: '#333', marginBottom: 10, borderRadius: 4 },
  addButton: { backgroundColor: THEME.accent, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 4, elevation: 2 },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});