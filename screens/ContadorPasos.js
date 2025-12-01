import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import WeatherCard from './WeatherCard'; // Tarjeta de Clima
import { useStep } from './PasosContext'; // Cerebro

export default function StepCounter() {
  const navigation = useNavigation();
  
  // 👇 1. Extraemos 'caloriasExtra' del contexto
  const { 
    activo, pasos, segundos, historial, toggleCronometro, formatearTiempo,
    KCAL_POR_PASO, METROS_POR_PASO, caloriasExtra 
  } = useStep();

  // 👇 2. Calculamos el total: Calorías por pasos + Calorías extras (rutina)
  const caloriasPasos = pasos * KCAL_POR_PASO;
  const totalKcal = (caloriasPasos + (caloriasExtra || 0)).toFixed(1);
  
  const distanciaKm = ((pasos * METROS_POR_PASO) / 1000).toFixed(2);

  // --- RENDERIZADO DE ITEMS DEL HISTORIAL ---
  const renderItem = ({ item, index }) => (
    <View style={styles.historyRow}>
      <Text style={[styles.cell, styles.col1]}>{historial.length - index}</Text>
      <Text style={[styles.cell, styles.col2]}>{item.hora}</Text>
      <Text style={[styles.cell, styles.col3]}>{item.pasos}</Text>
      <Text style={[styles.cell, styles.col4]}>{item.kcal}</Text>
      <Text style={[styles.cell, styles.col5]}>{item.tiempo}</Text>
    </View>
  );

  // --- CABECERA DE LA LISTA (Todo lo que va arriba del historial) ---
  const renderHeader = () => (
    <View>
      {/* Tarjeta de Clima */}
      <View style={{ marginBottom: 15 }}>
        <WeatherCard />
      </View>

      {/* Sección Superior (Cronómetro y Círculo) */}
      <View style={styles.topSection}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatearTiempo(segundos)}</Text>
          <Text style={styles.timerLabel}>TIEMPO TOTAL</Text>
        </View>

        <View style={styles.stepsCircle}>
          <View style={styles.innerCircle}>
            <Text style={styles.stepNumber}>{pasos}</Text>
            <Text style={styles.stepLabel}>PASOS</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.cardOrange]}>
            <Text style={styles.statIcon}>🔥</Text>
            {/* 👇 3. Mostramos el TOTAL acumulado */}
            <Text style={[styles.statValue, { color: '#e67e22' }]}>{totalKcal}</Text>
            <Text style={styles.statLabel}>Kcal Totales</Text>
          </View>
          <View style={[styles.statCard, styles.cardBlue]}>
            <Text style={styles.statIcon}>📏</Text>
            <Text style={[styles.statValue, { color: '#3498db' }]}>{distanciaKm}</Text>
            <Text style={styles.statLabel}>Km</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, activo ? styles.stopBtn : styles.startBtn]} 
          onPress={toggleCronometro}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {activo ? "DETENER SESIÓN" : "INICIAR CAMINATA"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Título del Historial */}
      <Text style={styles.historyTitle}>Historial de Sesiones</Text>
      
      {/* Encabezados de la Tabla */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.col1]}>#</Text>
        <Text style={[styles.headerCell, styles.col2]}>Hora</Text>
        <Text style={[styles.headerCell, styles.col3]}>Pasos</Text>
        <Text style={[styles.headerCell, styles.col4]}>Kcal</Text>
        <Text style={[styles.headerCell, styles.col5]}>Tiempo</Text>
      </View>
    </View>
  );

  // --- VISTA PRINCIPAL ---
  return (
    <View style={styles.mainContainer}>
      {/* Header Fijo (Flecha atrás) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Entrenamiento</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* LISTA GIGANTE QUE CONTIENE TODO */}
      <FlatList
        data={historial}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay registros hoy.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: { padding: 5 },
  screenTitle: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  
  // Estilos de la Sección Superior
  topSection: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  timerContainer: { marginBottom: 15 },
  timerText: { fontSize: 40, fontWeight: '300', color: '#34495e', fontVariant: ['tabular-nums'] },
  timerLabel: { fontSize: 10, color: '#95a5a6', fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
  
  stepsCircle: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: 'white',
    elevation: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1,
  },
  innerCircle: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#2ecc71',
    justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed',
  },
  stepNumber: { fontSize: 40, fontWeight: 'bold', color: '#27ae60' },
  stepLabel: { fontSize: 12, color: '#95a5a6', fontWeight: 'bold' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  statCard: {
    width: '48%', backgroundColor: 'white', padding: 15, borderRadius: 15,
    alignItems: 'center', elevation: 3, borderBottomWidth: 4,
  },
  cardOrange: { borderBottomColor: '#e67e22' },
  cardBlue: { borderBottomColor: '#3498db' },
  statIcon: { fontSize: 24, marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 14, color: '#7f8c8d' },

  button: { width: '100%', paddingVertical: 18, borderRadius: 30, alignItems: 'center', elevation: 5, marginBottom: 10 },
  startBtn: { backgroundColor: '#2c3e50' },
  stopBtn: { backgroundColor: '#c0392b' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

  // Estilos del Historial
  historyTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 8, marginBottom: 5 },
  headerCell: { fontWeight: 'bold', color: '#7f8c8d', fontSize: 12, textAlign: 'center' },
  historyRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: 'white', borderRadius: 8, marginBottom: 5, paddingHorizontal: 5 },
  cell: { fontSize: 13, color: '#34495e', textAlign: 'center' },
  
  // Columnas
  col1: { width: '10%' }, 
  col2: { width: '20%' }, 
  col3: { width: '20%' }, 
  col4: { width: '20%' }, 
  col5: { width: '30%' }, 
  
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 20, fontStyle: 'italic', marginBottom: 50 }
});