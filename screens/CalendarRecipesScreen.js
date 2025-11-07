import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useUserData } from './UserDataContext';

// Configuración opcional para español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CalendarRecipesScreen() {
  const { recetasCalendar, addRecipeToCalendar } = useUserData();
  const [selectedDate, setSelectedDate] = useState('');
  const [newRecipe, setNewRecipe] = useState('');

  // Marcar días que tienen recetas en el calendario
  const markedDates = Object.keys(recetasCalendar).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: 'orange' };
    return acc;
  }, {});

  // Cuando seleccionas un día
  if (selectedDate) {
    markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: '#3498db' };
  }

  const handleAdd = () => {
    if (newRecipe.trim()) {
      addRecipeToCalendar(selectedDate, newRecipe);
      setNewRecipe('');
      Alert.alert("¡Listo!", "Receta agregada al calendario.");
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#3498db',
          todayTextColor: '#3498db',
          arrowColor: '#3498db',
        }}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.dateTitle}>
          {selectedDate ? `Recetas del: ${selectedDate}` : 'Selecciona una fecha'}
        </Text>

        {selectedDate && (
          <>
            <FlatList
              data={recetasCalendar[selectedDate] || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.recipeItem}>
                  <Text>🍴 {item}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No hay recetas para este día.</Text>}
            />

            {/* Input rápido para añadir manualmente */}
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Agregar receta manual..."
                value={newRecipe}
                onChangeText={setNewRecipe}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  detailsContainer: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  dateTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' },
  recipeItem: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  emptyText: { fontStyle: 'italic', color: 'gray' },
  inputContainer: { flexDirection: 'row', marginTop: 10 },
  input: { flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  addButton: { backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', width: 50, borderRadius: 10 },
  addButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
});