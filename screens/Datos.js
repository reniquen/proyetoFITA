// screens/Datos.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Importamos getDoc
import { db } from './firebaseConfig';

const { width } = Dimensions.get('window');

// --- Paleta de Colores Mejorada ---
const COLORS = {
  brandGreenDark: '#005b4f', 
  brandGreen: '#00A86B',
  brandYellow: '#FFD54F', 
  mainBg: '#EFF2E7',    
  cardBg: '#FFFFFF',    
  textDark: '#2D3748',  
  textMedium: '#718096',
  inputBg: '#FFFFFF',
  inputBorder: '#E0E6DD',
  sectionBg: '#F0F4C3', // Color usado para el fondo de la intro y el IMC
};

export default function Datos({ route, navigation }) {
  const { userId } = route.params;
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DEL FORMULARIO ---
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [sexo, setSexo] = useState(null); // Nuevo estado para el sexo
  const [edad, setEdad] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  
  // ESTADOS PARA EL IMC
  const [imc, setImc] = useState(null);
  const [imcCategory, setImcCategory] = useState(''); 
  const [imcColor, setImcColor] = useState(COLORS.textDark); 

  const [limitaciones, setLimitaciones] = useState([]);
  const [otraLimitacion, setOtraLimitacion] = useState(''); 
  const opcionesLimitaciones = ['Ninguna', 'Rodillas', 'Espalda Baja', 'Hombros', 'Muñecas', 'Tobillos', 'Movilidad Reducida'];

  const [alergias, setAlergias] = useState([]);
  const [otraAlergia, setOtraAlergia] = useState('');
  // Asegúrate que estos valores coincidan con los `ingredientes` en `Comidas.js` (en minúsculas)
  const opcionesAlergias = ['Ninguna', 'gluten', 'lactosa', 'frutos secos', 'mariscos', 'huevo', 'vegetariano', 'vegano'];

  // Opciones para la selección de sexo
  const opcionesSexo = ['Hombre', 'Mujer', 'Prefiero no decirlo'];

  // --- Cargar datos existentes del usuario al iniciar ---
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'usuarios', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setSelectedPlan(data.plan || null);
          setSexo(data.sexo || null); // Cargar el sexo
          setEdad(String(data.edad || ''));
          setAltura(String(data.alturaCm || ''));
          setPeso(String(data.pesoKg || ''));
          
          setLimitaciones(data.limitacionesFisicas && data.limitacionesFisicas.length > 0 ? data.limitacionesFisicas : ['Ninguna']);
          setOtraLimitacion(data.limitacionesManual || '');
          
          setAlergias(data.alergiasPreferencias && data.alergiasPreferencias.length > 0 ? data.alergiasPreferencias : ['Ninguna']);
          setOtraAlergia(data.alergiasManual || '');
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        Alert.alert("Error", "No se pudieron cargar tus datos existentes.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // --- FUNCIÓN PARA CLASIFICAR EL IMC SEGÚN ESTÁNDAR OMS ---
  const classifyIMC = (imcValue) => {
    const value = parseFloat(imcValue);
    if (isNaN(value)) {
        setImcCategory('');
        return;
    }
    if (value < 18.5) {
        setImcCategory('Bajo peso');
        setImcColor('#FFB74D'); 
    } else if (value >= 18.5 && value <= 24.9) {
        setImcCategory('Peso normal (Saludable)');
        setImcColor(COLORS.brandGreen); 
    } else if (value >= 25 && value <= 29.9) {
        setImcCategory('Sobrepeso');
        setImcColor('#FB8C00'); 
    } else if (value >= 30) {
        setImcCategory('Obesidad');
        setImcColor('#E53935'); 
    }
  };

  // --- CÁLCULO AUTOMÁTICO DEL IMC ---
  useEffect(() => {
    if (altura && peso) {
      const altMetros = parseFloat(altura) / 100;
      const pesoKg = parseFloat(peso.replace(',', '.')); // Reemplazar coma por punto para asegurar el parseo
      if (altMetros > 0 && pesoKg > 0) {
        const imcCalculado = (pesoKg / (altMetros * altMetros)).toFixed(1);
        setImc(imcCalculado);
        classifyIMC(imcCalculado);
      } else {
        setImc(null);
        setImcCategory('');
        setImcColor(COLORS.textDark);
      }
    } else {
      setImc(null);
      setImcCategory('');
      setImcColor(COLORS.textDark);
    }
  }, [altura, peso]);

  // Función para manejar la selección de chips de múltiple opción (Limitaciones, Alergias)
  const toggleMultiSelection = (item, list, setList, setManualTextStr) => {
    if (item === 'Ninguna') {
      setList(['Ninguna']);
      if (setManualTextStr) setManualTextStr('');
      return;
    }
    let newList = [...list];
    if (newList.includes('Ninguna')) {
        newList = newList.filter(i => i !== 'Ninguna');
    }
    if (newList.includes(item)) {
      newList = newList.filter(i => i !== item);
      if (item === 'Otro' && setManualTextStr) setManualTextStr('');
    } else {
      newList.push(item);
    }
    if (newList.length === 0) setList(['Ninguna']);
    else setList(newList);
  };

  // Función para manejar la selección de chips de opción única (Sexo)
  const handleSingleSelection = (item, setState) => {
    setState(item);
  };

  const guardarDatos = async () => {
    if (!selectedPlan) { Alert.alert('Falta información', 'Por favor selecciona un Plan.'); return; }
    if (!sexo) { Alert.alert('Falta información', 'Por favor selecciona tu sexo.'); return; } // Nueva validación para el sexo
    if (!edad || !altura || !peso) { Alert.alert('Falta información', 'Por favor completa tu edad, altura y peso.'); return; }
    
    // Validar que sean números y positivos
    if (isNaN(parseInt(edad)) || isNaN(parseFloat(altura)) || isNaN(parseFloat(peso.replace(',', '.')))) {
        Alert.alert('Datos Inválidos', 'Edad, altura y peso deben ser valores numéricos.'); return;
    }
    if (parseInt(edad) <= 0 || parseFloat(altura) <= 0 || parseFloat(peso.replace(',', '.')) <= 0) {
        Alert.alert('Datos Inválidos', 'Edad, altura y peso deben ser valores positivos.'); return;
    }

    if (limitaciones.length === 0) { Alert.alert('Falta información', 'Selecciona tus limitaciones físicas.'); return; }
    if (alergias.length === 0) { Alert.alert('Falta información', 'Selecciona tus alergias/preferencias.'); return; }

    if (limitaciones.includes('Otro') && !otraLimitacion.trim()) {
        Alert.alert('Falta información', 'Por favor especifica tu "Otra" limitación física.'); return;
    }
    if (alergias.includes('Otro') && !otraAlergia.trim()) {
        Alert.alert('Falta información', 'Por favor especifica tu "Otra" alergia o preferencia.'); return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'usuarios', userId);
      
      const finalLimitacionesArray = limitaciones.filter(item => item !== 'Ninguna' && item !== 'Otro');
      const finalAlergiasArray = alergias.filter(item => item !== 'Ninguna' && item !== 'Otro');

      await updateDoc(userRef, {
        plan: selectedPlan,
        sexo: sexo, // Guardar el sexo
        edad: parseInt(edad),
        alturaCm: parseInt(altura),
        pesoKg: parseFloat(peso.replace(',', '.')),
        imc: parseFloat(imc),
        imcCategory: imcCategory,
        limitacionesFisicas: finalLimitacionesArray,
        limitacionesManual: limitaciones.includes('Otro') ? otraLimitacion.trim() : '',
        alergiasPreferencias: finalAlergiasArray,
        alergiasManual: alergias.includes('Otro') ? otraAlergia.trim() : '',
        datosCompletos: true,
        ultimaActualizacion: new Date().toISOString()
      });

      Alert.alert('¡Perfil Completado!', 'Tu plan personalizado está listo.', [
        { text: '¡A Entrenar!', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }
      ]);

    } catch (error) {
      console.error('Error al guardar datos:', error);
      Alert.alert('Error', 'No se pudieron guardar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlanOption = (nombrePlan, icono, descripcion) => {
    const isSelected = selectedPlan === nombrePlan;
    return (
      <TouchableOpacity
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={() => setSelectedPlan(nombrePlan)}
        activeOpacity={0.8}
      >
        <Icon name={icono} size={28} color={isSelected ? COLORS.brandYellow : COLORS.brandGreen} style={{marginBottom: 5}} />
        <Text style={[styles.planTitle, isSelected && styles.planTitleSelected]}>{nombrePlan}</Text>
        <Text style={[styles.planDesc, isSelected && styles.planDescSelected]} numberOfLines={2}>{descripcion}</Text>
        {isSelected && <View style={styles.checkmarkContainer}><Icon name="check-circle" size={18} color={COLORS.brandYellow} /></View>}
      </TouchableOpacity>
    );
  };

  // Render para grupos de checkboxes con input manual (Limitaciones, Alergias)
  const renderCheckboxGroupWithManualInput = (opcionesBase, estadoActual, setEstado, textoManual, setTextoManual, placeholderManual) => {
    const opcionesCompletas = opcionesBase.includes('Otro') ? opcionesBase : [...opcionesBase, 'Otro'];
    const showManualInput = estadoActual.includes('Otro');

    return (
      <View>
        <View style={styles.checkboxContainerTidy}>
          {opcionesCompletas.map((opcion) => {
            const isSelected = estadoActual.includes(opcion);
            const displayText = opcion === 'Otro' ? 'Otro (Especificar)' : opcion;
            return (
              <TouchableOpacity
                key={opcion}
                style={[styles.checkboxChipTidy, isSelected && styles.checkboxChipSelected]}
                onPress={() => toggleMultiSelection(opcion, estadoActual, setEstado, opcion === 'Otro' ? setTextoManual : null)}
                activeOpacity={0.7}
              >
                <Text style={[styles.checkboxText, isSelected && styles.checkboxTextSelected]}>{displayText}</Text>
                {isSelected && <Icon name="check" size={16} color={COLORS.brandGreenDark} style={{marginLeft: 5}} />}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {showManualInput && (
            <View style={styles.manualInputContainer}>
              <Icon name="pencil-outline" size={20} color={COLORS.brandGreen} style={{marginRight: 10}} />
              <TextInput
                style={styles.manualInput}
                placeholder={placeholderManual}
                placeholderTextColor={COLORS.textMedium}
                value={textoManual}
                onChangeText={setTextoManual}
              />
            </View>
        )}
      </View>
    );
  };

  // Nuevo render para grupos de selección única (Sexo)
  const renderSingleSelectGroup = (opciones, estadoActual, setEstado) => {
    return (
      <View style={styles.checkboxContainerTidy}>
        {opciones.map((opcion) => {
          const isSelected = estadoActual === opcion;
          return (
            <TouchableOpacity
              key={opcion}
              style={[styles.checkboxChipTidy, isSelected && styles.checkboxChipSelected]}
              onPress={() => handleSingleSelection(opcion, setEstado)}
              activeOpacity={0.7}
            >
              <Text style={[styles.checkboxText, isSelected && styles.checkboxTextSelected]}>{opcion}</Text>
              {isSelected && <Icon name="check" size={16} color={COLORS.brandGreenDark} style={{marginLeft: 5}} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };


  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandGreenDark} />
      <SafeAreaView style={styles.safeAreaTop} />

      {/* --- HEADER CENTRADO --- */}
      <View style={styles.headerBarImproved}>
        <Text style={styles.headerTitleImproved}>Configura tu Perfil FITA</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- INTRODUCCIÓN MEJORADA (Contenedor con color) --- */}
          <View style={styles.introContainer}>
            <Icon name="clipboard-text-outline" size={32} color={COLORS.brandGreenDark} style={{marginBottom: 8}} />
            <Text style={styles.welcomeSectionTitle}>Tu Perfil de Entreno</Text>
            <Text style={styles.welcomeSubtitle}>
              Completa esta información para generar un plan adaptado a tus necesidades.
            </Text>
          </View>

          {/* --- SECCIÓN 1: PLANES --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}><Icon name="star" size={20} color={COLORS.brandYellow} /> Objetivo Principal</Text>
            <View style={styles.planesRow}>
              {renderPlanOption('Plan 1', 'dumbbell', 'Pérdida de peso')}
              {renderPlanOption('Plan 2', 'arm-flex', 'Tonificación')}
              {renderPlanOption('Plan 3', 'weight-lifter', 'Ganancia muscular')}
            </View>
          </View>

          {/* --- SECCIÓN 1.5: SEXO (NUEVO) --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}><Icon name="gender-male-female" size={20} color={COLORS.brandYellow} /> Sexo</Text>
            <Text style={styles.sectionHelper}>Esta información nos ayuda a personalizar mejor tu plan.</Text>
            {renderSingleSelectGroup(opcionesSexo, sexo, setSexo)}
          </View>

          {/* --- SECCIÓN 2: DATOS CORPORALES --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}><Icon name="human-male-height" size={20} color={COLORS.brandYellow} /> Mis Medidas</Text>
            <View style={styles.inputsRow}>
              <View style={styles.inputGroupSmall}>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput style={styles.inputField} placeholder="Años" keyboardType="number-pad" value={edad} onChangeText={setEdad} maxLength={3} />
              </View>
              <View style={styles.inputGroupSmall}>
                <Text style={styles.inputLabel}>Altura (cm)</Text>
                <TextInput style={styles.inputField} placeholder="Ej: 175" keyboardType="number-pad" value={altura} onChangeText={setAltura} maxLength={3} />
              </View>
              <View style={styles.inputGroupSmall}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput style={styles.inputField} placeholder="Ej: 70.5" keyboardType="decimal-pad" value={peso} onChangeText={setPeso} maxLength={5} />
              </View>
            </View>

            {/* --- VISUALIZACIÓN IMC --- */}
            {imc && (
              <View style={styles.imcContainer}>
                <Text style={styles.imcLabelSmall}>Tu IMC estimado:</Text>
                <Text style={styles.imcValueLarge}>{imc}</Text>
                {imcCategory !== '' && (
                    <Text style={[styles.imcCategoryText, { color: imcColor }]}>
                      {imcCategory.toUpperCase()}
                    </Text>
                )}
              </View>
            )}
          </View>

          {/* --- SECCIÓN 3: LIMITACIONES --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}><Icon name="alert-circle" size={20} color={COLORS.brandYellow}/> Limitaciones Físicas</Text>
            <Text style={styles.sectionSubtitleSmall}>Selecciona varias opciones si es necesario.</Text>
            <Text style={styles.sectionHelper}>Evitaremos ejercicios que afecten estas zonas.</Text>
            {renderCheckboxGroupWithManualInput(opcionesLimitaciones, limitaciones, setLimitaciones, otraLimitacion, setOtraLimitacion, "Ej: Operación de rodilla hace 2 años...")}
          </View>

          {/* --- SECCIÓN 4: ALERGIAS/DIETA --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}><Icon name="food-apple" size={20} color={COLORS.brandYellow}/> Nutrición y Alergias</Text>
            <Text style={styles.sectionSubtitleSmall}>Selecciona varias opciones.</Text>
            <Text style={styles.sectionHelper}>Adaptaremos tu plan nutricional a tus necesidades.</Text>
            {renderCheckboxGroupWithManualInput(opcionesAlergias, alergias, setAlergias, otraAlergia, setOtraAlergia, "Ej: Intolerancia leve a la lactosa...")}
          </View>

          {/* --- BOTÓN GUARDAR --- */}
          <TouchableOpacity
            style={[styles.botonGuardar, loading && styles.botonDeshabilitado]}
            onPress={guardarDatos}
            disabled={loading}
            activeOpacity={0.9}
          >
              {loading ? (
                  <ActivityIndicator color={COLORS.brandGreenDark} /> 
              ) : (
                  <>
                   <Text style={styles.textoBotonGuardar}>FINALIZAR PERFIL</Text>
                   <Icon name="check-bold" size={20} color={COLORS.brandGreenDark} style={{marginLeft: 8}}/>
                  </>
              )}
          </TouchableOpacity>
          
          <View style={{height: 40}}/>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.mainBg },
  safeAreaTop: { flex: 0, backgroundColor: COLORS.brandGreenDark },
  
  headerBarImproved: {
    backgroundColor: COLORS.brandGreenDark,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 4,
  },
  headerTitleImproved: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center'
  },
  
  scrollContent: { padding: 20 },

  // --- NUEVO: Contenedor de Introducción ---
  introContainer: {
    backgroundColor: COLORS.sectionBg, // Color amarillo/verde suave
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EE9C' // Borde sutil para definirlo
  },
  welcomeSectionTitle: {
      fontSize: 22, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 8,
      textAlign: 'center'
  },
  welcomeSubtitle: {
    fontSize: 15, color: COLORS.textMedium, textAlign: 'center', marginBottom: 0,
  },

  // --- Estilos de Secciones ---
  sectionContainer: {
    backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 20, marginBottom: 20,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: COLORS.brandGreenDark, marginBottom: 2,
    flexDirection: 'row', alignItems: 'center', gap: 8
  },
  sectionSubtitleSmall: {
      fontSize: 12, color: COLORS.brandGreen, fontWeight: '600', marginBottom: 10, marginLeft: 28
  },
  sectionHelper: { fontSize: 13, color: COLORS.textMedium, marginBottom: 15 },

  // --- Estilos Planes ---
  planesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  planCard: {
    width: '31%', backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.inputBorder,
  },
  planCardSelected: { backgroundColor: COLORS.brandGreenDark, borderColor: COLORS.brandYellow },
  planTitle: { fontWeight: 'bold', color: COLORS.textDark, fontSize: 13, marginBottom: 4, textAlign: 'center' },
  planTitleSelected: { color: COLORS.brandYellow },
  planDesc: { fontSize: 11, color: COLORS.textMedium, textAlign: 'center' },
  planDescSelected: { color: '#E0E0E0' },
  checkmarkContainer: { position: 'absolute', top: 5, right: 5 },

  // --- Estilos Inputs Corporales ---
  inputsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputGroupSmall: { width: '31%' },
  inputLabel: { fontSize: 14, color: COLORS.textDark, marginBottom: 8, fontWeight: '600' },
  inputField: {
    backgroundColor: COLORS.inputBg, borderRadius: 10, padding: 12, fontSize: 16,
    color: COLORS.textDark, textAlign: 'center', borderWidth: 1, borderColor: COLORS.inputBorder
  },
  // --- ESTILOS PARA EL IMC VISUAL ---
  imcContainer: {
    marginTop: 20, alignItems: 'center', backgroundColor: COLORS.sectionBg, paddingVertical: 15, borderRadius: 12,
    borderWidth: 1, borderColor: '#E6EE9C' 
  },
  imcLabelSmall: { fontSize: 14, color: COLORS.textMedium, marginBottom: 5 },
  imcValueLarge: { fontSize: 36, fontWeight: '900', color: COLORS.brandGreenDark, lineHeight: 40 },
  imcCategoryText: { fontSize: 16, fontWeight: '800', marginTop: 5, letterSpacing: 0.5 },

  // --- Estilos Checkboxes ---
  checkboxContainerTidy: { 
      flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' 
  },
  checkboxChipTidy: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg,
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1, borderColor: COLORS.inputBorder, flexGrow: 0,
  },
  checkboxChipSelected: { backgroundColor: COLORS.brandYellow, borderColor: COLORS.brandGreenDark },
  checkboxText: { color: COLORS.textDark, fontSize: 13 },
  checkboxTextSelected: { color: COLORS.brandGreenDark, fontWeight: '700' },

  // --- Estilos Input Manual ---
  manualInputContainer: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg,
      borderRadius: 12, marginTop: 15, paddingHorizontal: 15, height: 50,
      borderWidth: 1, borderColor: COLORS.brandGreen,
  },
  manualInput: { flex: 1, color: COLORS.textDark, fontSize: 14 },

  // --- Botón Guardar ---
  botonGuardar: {
    backgroundColor: COLORS.brandYellow, flexDirection: 'row', paddingVertical: 18, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
    elevation: 4, shadowColor: COLORS.brandYellow, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3
  },
  botonDeshabilitado: { opacity: 0.7 },
  textoBotonGuardar: { color: COLORS.brandGreenDark, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
});