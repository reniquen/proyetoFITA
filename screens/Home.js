import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Linking } from 'react-native';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import AvatarCoach from './AvatarCoach';


export default function Home({ navigation }) {
  const rutinas = {
    plan1: {
      lunes: [
        {
          nombre: "Burpees",
          repeticiones: "3 series de 10 repeticiones",
          imagen: require('../assets/burpees.png'),
          video: "https://www.youtube.com/watch?v=IYusabTdFEo&ab_channel=VideoBodytech",
        },
        {
          nombre: "Mountain climbers",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/mountainclimbers.png'),
          video: "https://www.youtube.com/watch?v=cnyTQDSE884&ab_channel=Well%2BGood",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      martes: [
        {
          nombre: "Sentadillas",
          repeticiones: "4 series de 20 repeticiones",
          imagen: require('../assets/sentadillalibre.png'),
          video: "https://www.youtube.com/watch?v=VRKdOsad3HQ&ab_channel=Bestcycling",
        },
        {
          nombre: "Plancha",
          repeticiones: "3 series de 1 minuto",
          imagen: require('../assets/plancha.png'),
          video: "https://www.youtube.com/watch?v=d0atctiI7Vw&ab_channel=DeportesUncomo",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      miércoles: [
        {
          nombre: "Rodillas altas",
          repeticiones: "4 series de 1 minuto",
          imagen: require('../assets/rodillasaltas.png'),
          video: "https://www.youtube.com/watch?v=5sW0T86MwvY&ab_channel=KranosCalistenia",
        },
        {
          nombre: "Burpees",
          repeticiones: "3 series de 10 repeticiones",
          imagen: require('../assets/burpees.png'),
          video: "https://www.youtube.com/watch?v=IYusabTdFEo&ab_channel=VideoBodytech",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      jueves: [
        {
          nombre: "Movilidad",
          repeticiones: "15 minutos",
          imagen: require('../assets/movilidad.png'),
          video: "https://www.youtube.com/watch?v=DdpO0m15nto&ab_channel=JeremyEthierenEspa%C3%B1ol",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      viernes: [
        {
          nombre: "Burpees",
          repeticiones: "3 series de 10 repeticiones",
          imagen: require('../assets/burpees.png'),
          video: "https://www.youtube.com/watch?v=IYusabTdFEo&ab_channel=VideoBodytech",
        },
        {
          nombre: "Mountain climbers",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/mountainclimbers.png'),
          video: "https://www.youtube.com/watch?v=cnyTQDSE884&ab_channel=Well%2BGood",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
    },
    plan2: {
      lunes: [
        {
          nombre: "Burpees",
          repeticiones: "3 series de 10 repeticiones",
          imagen: require('../assets/burpees.png'),
          video: "https://www.youtube.com/watch?v=IYusabTdFEo&ab_channel=VideoBodytech",
        },
        {
          nombre: "Mountain climbers",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/mountainclimbers.png'),
          video: "https://www.youtube.com/watch?v=cnyTQDSE884&ab_channel=Well%2BGood",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      martes: [
        {
          nombre: "Sentadillas",
          repeticiones: "4 series de 20 repeticiones",
          imagen: require('../assets/sentadillalibre.png'),
          video: "https://www.youtube.com/watch?v=VRKdOsad3HQ&ab_channel=Bestcycling",
        },
        {
          nombre: "Plancha",
          repeticiones: "3 series de 1 minuto",
          imagen: require('../assets/elevacioneslaterales.png'),
          video: "https://www.youtube.com/watch?v=d0atctiI7Vw&ab_channel=DeportesUncomo",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      miércoles: [
        {
          nombre: "Rodillas altas",
          repeticiones: "4 series de 1 minuto",
          imagen: require('../assets/dominadas.png'),
          video: "https://www.youtube.com/watch?v=5sW0T86MwvY&ab_channel=KranosCalistenia",
        },
        {
          nombre: "Burpees",
          repeticiones: "3 series de 10 repeticiones",
          imagen: require('../assets/burpees.png'),
          video: "https://www.youtube.com/watch?v=IYusabTdFEo&ab_channel=VideoBodytech",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      jueves: [
        {
          nombre: "Movilidad",
          repeticiones: "15 minutos",
          imagen: require('../assets/movilidad.png'),
          video: "https://www.youtube.com/watch?v=DdpO0m15nto&ab_channel=JeremyEthierenEspa%C3%B1ol",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
      viernes: [
        {
          nombre: "Burpees",
          repeticiones: "3 series de 10 repeticiones",
          imagen: require('../assets/burpees.png'),
          video: "https://www.youtube.com/watch?v=IYusabTdFEo&ab_channel=VideoBodytech",
        },
        {
          nombre: "Mountain climbers",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/mountainclimbers.png'),
          video: "https://www.youtube.com/watch?v=cnyTQDSE884&ab_channel=Well%2BGood",
        },
        {
          nombre: "Saltar la cuerda",
          repeticiones: "1 serie de 15 minutos",
          imagen: require('../assets/saltocuerda.png'),
          video: "https://www.youtube.com/watch?v=rpS3MQgxdA0&ab_channel=Adri%C3%A1nFit",
        },
      ],
    },
    plan3: {
      lunes: [
        {
          nombre: "Sentadillas con barra",
          repeticiones: "4 series de 10 repeticiones",
          imagen: require('../assets/sentadilla.png'),
          video: "https://www.youtube.com/watch?v=dsCuiccYNGs&ab_channel=JulienLEPRETRE",
        },
        {
          nombre: "Prensa de pierna",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/prensa.png'),
          video: "https://www.youtube.com/watch?v=MTfwemR8QMQ&ab_channel=CARLOSOnlineCoach",
        },
        {
          nombre: "Hack Squat",
          repeticiones: "4 series de 8 a 12 repeticiones",
          imagen: require('../assets/hack.png'),
          video: "https://www.youtube.com/watch?v=0tn5K9NlCfo&ab_channel=Bodybuilding.com",
        },
      ],
      martes: [
        {
          nombre: "Press militar",
          repeticiones: "4 series de 8 repeticiones",
          imagen: require('../assets/pressmilitar.png'),
          video: "https://www.youtube.com/watch?v=waeCyaAQRn8&ab_channel=LIVESTRONG.COM",
        },
        {
          nombre: "Elevaciones laterales en polea",
          repeticiones: "3 series de 15 repeticiones",
          imagen: require('../assets/elevacioneslaterales.png'),
          video: "https://www.youtube.com/watch?v=gjUrYfNU1-M&ab_channel=Zonapablo",
        },
        {
          nombre: "Elevaciones posteriores",
          repeticiones: "3 series de 15 repeticiones",
          imagen: require('../assets/posterior.png'),
          video: "https://www.youtube.com/watch?v=pGg9p4cSJ2E&ab_channel=IbrahimNino",
        },
      ],
      miércoles: [
        {
          nombre: "Dominadas",
          repeticiones: "4 series al fallo",
          imagen: require('../assets/dominadas.png'),
          video: "https://www.youtube.com/watch?v=fJ1Sq208UVA&ab_channel=BUFFAcademyAPP",
        },
        {
          nombre: "Remo con barra",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/remo.png'),
          video: "https://www.youtube.com/watch?v=3uiWjik2yEQ&ab_channel=TecnicasGymtopz",
        },
        {
          nombre: "Pull Over",
          repeticiones: "4 series de 10 repeticiones",
          imagen: require('../assets/pullover.png'),
          video: "https://www.youtube.com/watch?v=9YQ1YXKko8s&ab_channel=ManuelEscalera",
        },
      ],
      jueves: [
        {
          nombre: "Sentadilla búlgara",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/sentadillabulgara.png'),
          video: "https://www.youtube.com/watch?v=7zBnXPL5cck&ab_channel=TecnicasGymtopz",
        },
        {
          nombre: "Peso muerto rumano",
          repeticiones: "4 series de 8 a 12 repeticiones",
          imagen: require('../assets/pesom.png'),
          video: "https://www.youtube.com/watch?v=EZ0iPia9kPM&ab_channel=KarenZ%C3%A1rate",
        },
        {
          nombre: "Abductores",
          repeticiones: "4 series de 10 repeticiones",
          imagen: require('../assets/abductores.png'),
          video: "https://www.youtube.com/watch?v=fItDiXXZyZo&ab_channel=FitKamp",
        },
      ],
      viernes: [
        {
          nombre: "Press de banca",
          repeticiones: "4 series de 8 repeticiones",
          imagen: require('../assets/pressbanca.png'),
          video: "https://www.youtube.com/watch?v=GeLq8cMODLc&ab_channel=TecnicasGymtopz",
        },
        {
          nombre: "Press inclinado con mancuernas",
          repeticiones: "4 series de 8 a 12 repeticiones",
          imagen: require('../assets/pressinclinado.png'),
          video: "https://www.youtube.com/watch?v=9fy0A5xWsgk&ab_channel=DrV%C3%ADctorL%C3%B3pez",
        },
        {
          nombre: "Cruce de poleas",
          repeticiones: "4 series de 12 repeticiones",
          imagen: require('../assets/crucepoleas.png'),
          video: "https://www.youtube.com/watch?v=gFoMzh-5H-8&ab_channel=CULTURADEGYM",
        },
      ],
    },
  };

  const planActual = rutinas.plan3;

  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const diaActual = diasSemana[new Date().getDay()];

  const rutinaHoy = planActual[diaActual] || [];

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch(() => alert('No se pudo cerrar sesión.'));
  };

  return (

    <ScrollView style={styles.contenedorScroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.padre}>
       <View style={styles.avatarContainer}>
              <AvatarCoach />
              <Text style={styles.avatarTexto}>¡Hola! Hoy te motivaré en tu rutina 💪</Text>
            </View>


        <Text style={styles.titulo}>Hoy {diaActual} te toca la siguiente rutina, ¡CON TODO!:</Text>
        {rutinaHoy.length > 0 ? (
          rutinaHoy.map((ejercicio, index) => (
            <View key={index} style={styles.tarjeta}>
              <TouchableOpacity onPress={() => Linking.openURL(ejercicio.video)}>
                <Image source={ejercicio.imagen} style={styles.imagen} />
              </TouchableOpacity>
              <View style={styles.textoContainer}>
                <Text style={styles.nombre}>{ejercicio.nombre}</Text>
                <Text style={styles.repeticiones}>{ejercicio.repeticiones}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noRutina}>Hoy te toca descanso.</Text>
        )}
        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate('Comidas')}
        >
          <Text style={styles.botonTexto}>Ver dieta de hoy</Text>
        </TouchableOpacity>

         <TouchableOpacity
                style={styles.boton}
                onPress={() => navigation.navigate('Avatar')}
              >
                <Text style={styles.botonTexto}>Ver Avatar</Text>
              </TouchableOpacity>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity style={[styles.boton, { backgroundColor: '#f27474', marginTop: 15 }]} onPress={cerrarSesion}>
          <Text style={[styles.botonTexto, { color: 'white' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
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
  imagen: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  textoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  repeticiones: {
    fontSize: 16,
    color: '#333',
  },
  noRutina: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  boton: {
    backgroundColor: '#82e0aa',
    borderRadius: 50,
    paddingVertical: 20,
    width: '100%',
    marginTop: 20,
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    alignContent: 'center',
  },
  botonTexto: {
    textAlign: 'center',
    color: 'Black',
    fontWeight: 'bold',
  },

  avatarContainer: {
    backgroundColor: '#fff3e0',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  avatarTexto: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
