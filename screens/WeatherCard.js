import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';


const API_KEY = '8ce90b90818c69ea0d643771bfccd52c'; 

export default function WeatherCard() {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Sin permiso');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );
      const data = await response.json();
      
      if (data.cod !== 200) {
        setError(data.message);
      } else {
        setClima(data);
      }
    } catch (e) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const obtenerConsejo = (temp, condition, wind) => {
    const mainCondition = condition.toLowerCase();
    
    if (mainCondition.includes('rain') || mainCondition.includes('storm') || mainCondition.includes('drizzle')) 
      return { text: "Lluvia: Mejor entrena en casa", color: '#e74c3c' }; 
    
    if (wind > 20) 
      return { text: "Mucho viento, usa cortavientos", color: '#f39c12' }; 
    
    if (temp < 10) 
      return { text: "¡Hace frío! Sal muy abrigado", color: '#3498db' }; 
    
    if (temp >= 10 && temp < 20) 
      return { text: "Está fresco, abrígate", color: '#5dade2' }; 

    if (temp >= 20 && temp < 28) 
      return { text: "¡Clima perfecto para salir!", color: '#27ae60' }; 

    return { text: "¡Mucho calor! Hidrátate bien", color: '#e67e22' }; 
  };

  if (loading) return <ActivityIndicator size="small" color="#2c3e50" />;
  if (error || !clima || !clima.main) return null;

  const { main, weather, wind, name } = clima;
  const consejo = obtenerConsejo(main.temp, weather[0].main, wind.speed);
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  // --- Lógica para el texto del clima ---
  let descripcion = weather[0].description;
  
  if (weather[0].icon.includes('n') && descripcion.includes('cielo claro')) {
    descripcion = "noche despejada";
  }
  
  descripcion = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        
        
        <View style={styles.weatherInfo}>
         
          <View style={styles.iconContainer}>
            <Image source={{ uri: iconUrl }} style={styles.iconImage} resizeMode="cover" />
          </View>
          
          <View>
            <Text style={styles.temp}>{Math.round(main.temp)}°</Text>
            <Text style={styles.location}>📍 {name}</Text>            
            <Text style={styles.description}>{descripcion}</Text>
          </View>
        </View>

        {/* Lado Derecho: Detalles */}
        <View style={styles.details}>
          <Text style={styles.detailText}>🍃 Viento: {Math.round(wind.speed)} km/h</Text>
          <Text style={styles.detailText}>💧 Humedad: {main.humidity}%</Text>
        </View>
      </View>

      <View style={[styles.badge, { backgroundColor: consejo.color + '20' }]}> 
        <Text style={[styles.consejoText, { color: consejo.color }]}>
          {consejo.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  iconContainer: {
    width: 46,       
    height: 46,
    backgroundColor: '#f0f3f4',
    borderRadius: 23, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  iconImage: {
    width: 65,      
    height: 65,      
  },
  
  temp: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 30, 
  },
  location: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  description: {
    fontSize: 11, 
    color: '#95a5a6', 
    marginTop: 2,
    fontStyle: 'italic',
  },
  details: {
    alignItems: 'flex-end',
  },
  detailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
    fontWeight: '500',
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  consejoText: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
});