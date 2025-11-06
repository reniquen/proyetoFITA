import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useUserData } from './UserDataContext';

// Configuración de localización para el calendario
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CalendarRecipesScreen() {
  // Contexto de datos del usuario
  const { recetasCalendar = {}, addRecipeToCalendar } = useUserData();

  const [selectedDate, setSelectedDate] = useState('');
  const [newRecipe, setNewRecipe] = useState('');

  // 🔒 Protección total ante valores indefinidos o corruptos
  const safeCalendar = recetasCalendar && typeof recetasCalendar === 'object' ? recetasCalendar : {};

  // ✅ Generar marcadores de calendario de forma segura
  const markedDates = {};
  if (safeCalendar && Object.keys(safeCalendar).length > 0) {
    Object.keys(safeCalendar).forEach(date => {
      if (typeof date === 'string' && date.includes('-')) {
        markedDates[date] = { marked: true, dotColor: '#9b59b6' };
      }
    });
  }

  // ✅ Asegurar que selectedDate se marque sin conflicto
  if (selectedDate) {
    markedDates[selectedDate] = { 
      ...(markedDates[selectedDate] || {}), 
      selected: true, 
      selectedColor: '#3498db' 
    };
  }

  // 🔧 Función segura para agregar recetas
  const handleAdd = useCallback(async () => {
    if (!selectedDate) {
      return Alert.alert("Error", "Selecciona una fecha primero.");
    }
    if (!newRecipe.trim()) {
      return Alert.alert("Error", "Escribe el nombre de la receta.");
    }

    try {
      await addRecipeToCalendar(selectedDate, newRecipe.trim());
      Alert.alert("Éxito", `"${newRecipe.trim()}" ha sido agendada para el ${selectedDate}.`);
      setNewRecipe('');
    } catch (error) {
      console.error('Error al agregar receta:', error);
      Alert.alert("Error", "No se pudo guardar la receta. Inténtalo de nuevo.");
    }
  }, [selectedDate, newRecipe, addRecipeToCalendar]);

  // ✅ Evitar crash si el día no existe aún
  const recipesForSelectedDay = Array.isArray(safeCalendar[selectedDate])
    ? safeCalendar[selectedDate]
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates && typeof markedDates === 'object' ? markedDates : {}}
        theme={{ 
          selectedDayBackgroundColor: '#3498db',
          todayTextColor: '#e74c3c',
          arrowColor: '#3498db',
        }}
      />

      <View style={styles.details}>
        <Text style={styles.title}>
          {selectedDate 
            ? `Menú agendado para ${selectedDate}` 
            : 'Selecciona un día en el calendario'}
        </Text>

        {selectedDate && (
          <>
            <FlatList
              data={recipesForSelectedDay}
              keyExtractor={(item, i) => item + i.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemText}>🍽️ {item}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: '#999', paddingLeft: 5 }}>
                  No hay recetas agendadas para este día.
                </Text>
              }
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe la nueva receta..."
                value={newRecipe}
                onChangeText={setNewRecipe}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  details: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  item: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 8, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 1 
  },
  itemText: { fontSize: 16, color: '#2c3e50' },
  inputContainer: { flexDirection: 'row', marginTop: 15, paddingBottom: 10 },
  input: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  addButton: { 
    backgroundColor: '#3498db', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 50, 
    borderRadius: 10, 
    height: 50 
  },
  addText: { color: '#fff', fontSize: 24, fontWeight: 'bold' }
});
