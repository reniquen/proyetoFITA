import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';

export default function Comidas() {
    const dietas = {
        lunes: [
            { nombre: "Desayuno", comida: "Avena proteica, frutas y almendras", calorias: 400 },
            { nombre: "Almuerzo", comida: "Pollo a la plancha con arroz integral y brócoli", calorias: 600 },
            { nombre: "Cena", comida: "Salmón a la plancha con ensalada de palta y quinoa", calorias: 500 },
        ],
        martes: [
            { nombre: "Desayuno", comida: "Tortilla de claras de huevo con espinaca y pan integral", calorias: 350 },
            { nombre: "Almuerzo", comida: "Pavo con papas al horno y espárragos", calorias: 550 },
            { nombre: "Cena", comida: "Ensalada de pollo con palta, nueces y almendras", calorias: 450 },
        ],
        miércoles: [
            { nombre: "Desayunos", comida: "Batido de proteína con avena y plátano", calorias: 400 },
            { nombre: "Almuerzo", comida: "Pechuga de pollo con arroz integral y verduras salteadas", calorias: 500 },
            { nombre: "Cena", comida: "Filete de res con espinaca y quinoa", calorias: 600 },
        ],
        jueves: [
            { nombre: "Desayuno", comida: "Yogur griego con nueces y miel", calorias: 350 },
            { nombre: "Almuerzo", comida: "Salmón a la plancha con papas al horno y espárragos", calorias: 600 },
            { nombre: "Cena", comida: "Pollo con ensalada de palta y tomate", calorias: 500 },
        ],
        viernes: [
            { nombre: "Desayuno", comida: "Avena con yogur griego y frutos rojos", calorias: 400 },
            { nombre: "Almuerzo", comida: "Pechuga de pavo con arroz integral y ensalada", calorias: 550 },
            { nombre: "Cena", comida: "Atún con espárragos y quinoa", calorias: 500 },
        ],
        sábado: [
            { nombre: "Desayuno", comida: "Batido de proteína con avena y mantequilla de maní", calorias: 450 },
            { nombre: "Almuerzo", comida: "Arroz integral con salmón a la plancha y brócoli", calorias: 600 },
            { nombre: "Cena", comida: "Pollo a la plancha con ensalada de palta", calorias: 500 },
        ],
        domingo: [
            { nombre: "Desayuno", comida: "Tostadas integrales con palta y huevo", calorias: 400 },
            { nombre: "Almuerzo", comida: "Pechuga de pollo a la plancha con arroz integral", calorias: 550 },
            { nombre: "Cena", comida: "Ensalada de atún con palta y tomate", calorias: 450 },
        ],
    };

    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const diaActual = diasSemana[new Date().getDay()];
    const dietaHoy = dietas[diaActual] || [];

    // Calcular total calorías
    const totalCalorias = dietaHoy.reduce((total, comida) => total + comida.calorias, 0);

    return (
        <ScrollView style={styles.contenedorScroll} contentContainerStyle={styles.scrollContent}>
            <View style={styles.padre}>
                <Text style={styles.titulo}>Hoy {diaActual} debes seguir la siguiente dieta, ¡A POR ESAS GAINS!:</Text>
                {dietaHoy.length > 0 ? (
                    dietaHoy.map((comida, index) => (
                        <View key={index} style={styles.tarjeta}>
                            <Text style={styles.nombre}>{comida.nombre}</Text>
                            <Text style={styles.comida}>{comida.comida}</Text>
                            <Text style={styles.calorias}>Calorías: {comida.calorias} kcal</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDieta}>Hoy no hay dieta programada.</Text>
                )}
                <Text style={styles.totalCalorias}>Calorías totales del día: {totalCalorias} kcal</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenedorScroll: {
        flex: 1,
        backgroundColor: '#58d68d',
    },
    scrollContent: {
        padding: 20,
    },
    padre: {
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    tarjeta: {
        backgroundColor: '#fad7a0',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        width: '95%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    comida: {
        fontSize: 16,
        color: '#333',
    },
    calorias: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    noDieta: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    totalCalorias: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
    },
});
