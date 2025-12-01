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
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const { width } = Dimensions.get('window');

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
  sectionBg: '#F0F4C3',
};

export default function Datos({ route, navigation }) {
  const { userId } = route.params;
  const [loading, setLoading] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [sexo, setSexo] = useState(null);
  const [edad, setEdad] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');

  const [imc, setImc] = useState(null);
  const [imcCategory, setImcCategory] = useState('');
  const [imcColor, setImcColor] = useState(COLORS.textDark);

  const [limitaciones, setLimitaciones] = useState([]);
  const [otraLimitacion, setOtraLimitacion] = useState('');
  const opcionesLimitaciones = [
    'Ninguna',
    'Rodillas',
    'Espalda Baja',
    'Hombros',
    'Muñecas',
    'Tobillos',
    'Movilidad Reducida'
  ];

  const [alergias, setAlergias] = useState([]);
  const [otraAlergia, setOtraAlergia] = useState('');
  const opcionesAlergias = [
    'Ninguna',
    'gluten',
    'lactosa',
    'frutos secos',
    'mariscos',
    'huevo',
    'vegetariano',
    'vegano'
  ];

  const opcionesSexo = ['Hombre', 'Mujer', 'Prefiero no decirlo'];

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'usuarios', userId);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();

          setSelectedPlan(data.plan || null);
          setSexo(data.sexo || null);

          setEdad(String(data.edad || ''));
          setAltura(String(data.alturaCm || ''));
          setPeso(String(data.pesoKg || ''));

          setLimitaciones(
            data.limitacionesFisicas?.length > 0 ? data.limitacionesFisicas : ['Ninguna']
          );
          setOtraLimitacion(data.limitacionesManual || '');

          setAlergias(
            data.alergiasPreferencias?.length > 0 ? data.alergiasPreferencias : ['Ninguna']
          );
          setOtraAlergia(data.alergiasManual || '');
        }
      } catch (e) {
        Alert.alert("Error", "No se pudieron cargar tus datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const classifyIMC = (value) => {
    const imc = parseFloat(value);
    if (isNaN(imc)) return;

    if (imc < 18.5) {
      setImcCategory('Bajo peso');
      setImcColor('#FFB74D');
    } else if (imc <= 24.9) {
      setImcCategory('Peso normal (Saludable)');
      setImcColor(COLORS.brandGreen);
    } else if (imc <= 29.9) {
      setImcCategory('Sobrepeso');
      setImcColor('#FB8C00');
    } else {
      setImcCategory('Obesidad');
      setImcColor('#E53935');
    }
  };

  useEffect(() => {
    if (altura && peso) {
      const altM = parseFloat(altura) / 100;
      const kg = parseFloat(peso.replace(',', '.'));
      if (altM > 0 && kg > 0) {
        const result = (kg / (altM * altM)).toFixed(1);
        setImc(result);
        classifyIMC(result);
        return;
      }
    }
    setImc(null);
    setImcCategory('');
    setImcColor(COLORS.textDark);
  }, [altura, peso]);

  const toggleMultiSelection = (item, list, setList, setManual) => {
    if (item === 'Ninguna') {
      setList(['Ninguna']);
      if (setManual) setManual('');
      return;
    }

    let newList = [...list];

    if (newList.includes('Ninguna'))
      newList = newList.filter((i) => i !== 'Ninguna');

    if (newList.includes(item)) {
      newList = newList.filter((i) => i !== item);
      if (item === 'Otro' && setManual) setManual('');
    } else {
      newList.push(item);
    }

    setList(newList.length > 0 ? newList : ['Ninguna']);
  };

  const guardarDatos = async () => {
    if (!selectedPlan) return Alert.alert('Error', 'Selecciona un plan.');
    if (!sexo) return Alert.alert('Error', 'Selecciona tu sexo.');
    if (!edad || !altura || !peso)
      return Alert.alert('Error', 'Faltan datos corporales.');

    if (limitaciones.includes('Otro') && !otraLimitacion.trim())
      return Alert.alert('Error', 'Especifica tu limitación.');

    if (alergias.includes('Otro') && !otraAlergia.trim())
      return Alert.alert('Error', 'Especifica tu alergia.');

    setLoading(true);
    try {
      const ref = doc(db, 'usuarios', userId);

      await updateDoc(ref, {
        plan: selectedPlan,
        sexo,
        edad: parseInt(edad),
        alturaCm: parseInt(altura),
        pesoKg: parseFloat(peso.replace(',', '.')),
        imc: parseFloat(imc),
        imcCategory,
        limitacionesFisicas: limitaciones.filter(i => i !== 'Ninguna' && i !== 'Otro'),
        limitacionesManual: limitaciones.includes('Otro') ? otraLimitacion.trim() : '',
        alergiasPreferencias: alergias.filter(i => i !== 'Ninguna' && i !== 'Otro'),
        alergiasManual: alergias.includes('Otro') ? otraAlergia.trim() : '',
        datosCompletos: true,
        ultimaActualizacion: new Date().toISOString()
      });

      Alert.alert('¡Éxito!', 'Tu perfil ha sido actualizado.', [
        { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }
      ]);

    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlanOption = (nombre, icono, desc) => {
    const sel = selectedPlan === nombre;
    return (
      <TouchableOpacity
        style={[styles.planCard, sel && styles.planCardSelected]}
        onPress={() => setSelectedPlan(nombre)}
      >
        <Icon name={icono} size={28} color={sel ? COLORS.brandYellow : COLORS.brandGreen} />
        <Text style={[styles.planTitle, sel && styles.planTitleSelected]}>{nombre}</Text>
        <Text style={[styles.planDesc, sel && styles.planDescSelected]} numberOfLines={2}>
          {desc}
        </Text>
        {sel && <Icon name="check-circle" size={18} color={COLORS.brandYellow} style={styles.checkmark} />}
      </TouchableOpacity>
    );
  };

  const renderCheckboxGroupWithManualInput = (
    opcionesBase, estado, setEstado, manual, setManual, placeholder
  ) => {
    const opciones = opcionesBase.includes('Otro') ? opcionesBase : [...opcionesBase, 'Otro'];
    const showManual = estado.includes('Otro');

    return (
      <View>
        <View style={styles.checkboxContainer}>
          {opciones.map((opcion) => {
            const sel = estado.includes(opcion);
            return (
              <TouchableOpacity
                key={opcion}
                style={[styles.checkboxChip, sel && styles.checkboxChipSelected]}
                onPress={() => toggleMultiSelection(opcion, estado, setEstado, opcion === 'Otro' ? setManual : null)}
              >
                <Text style={[styles.checkboxText, sel && styles.checkboxTextSelected]}>
                  {opcion === 'Otro' ? 'Otro (Especificar)' : opcion}
                </Text>
                {sel && <Icon name="check" size={16} color={COLORS.brandGreenDark} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {showManual && (
          <View style={styles.manualInputContainer}>
            <Icon name="pencil-outline" size={20} color={COLORS.brandGreen} />
            <TextInput
              style={styles.manualInput}
              placeholder={placeholder}
              placeholderTextColor={COLORS.textMedium}
              value={manual}
              onChangeText={setManual}
            />
          </View>
        )}
      </View>
    );
  };

  const renderSingleSelectGroup = (opciones, estado, setEstado) => (
    <View style={styles.checkboxContainer}>
      {opciones.map((opc) => {
        const sel = estado === opc;
        return (
          <TouchableOpacity
            key={opc}
            style={[styles.checkboxChip, sel && styles.checkboxChipSelected]}
            onPress={() => setEstado(opc)}
          >
            <Text style={[styles.checkboxText, sel && styles.checkboxTextSelected]}>{opc}</Text>
            {sel && <Icon name="check" size={16} color={COLORS.brandGreenDark} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandGreenDark} />
      <SafeAreaView style={styles.safeAreaTop} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Configura tu Perfil FITA</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.introContainer}>
            <Icon name="clipboard-text-outline" size={32} color={COLORS.brandGreenDark} />
            <Text style={styles.welcomeSectionTitle}>Tu Perfil de Entreno</Text>
            <Text style={styles.welcomeSubtitle}>
              Completa esta información para generar un plan adaptado a tus necesidades.
            </Text>
          </View>

          {/* PLAN */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <Icon name="star" size={20} color={COLORS.brandYellow} /> Objetivo Principal
            </Text>

            <View style={styles.planesRow}>
              {renderPlanOption('Plan 1', 'dumbbell', 'Pérdida de peso')}
              {renderPlanOption('Plan 2', 'arm-flex', 'Tonificación')}
              {renderPlanOption('Plan 3', 'weight-lifter', 'Ganancia muscular')}
            </View>
          </View>

          {/* SEXO */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <Icon name="gender-male-female" size={20} color={COLORS.brandYellow} /> Sexo
            </Text>
            <Text style={styles.sectionHelper}>Esta información ayuda a personalizar tu plan.</Text>

            {renderSingleSelectGroup(opcionesSexo, sexo, setSexo)}
          </View>

          {/* DATOS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <Icon name="human-male-height" size={20} color={COLORS.brandYellow} /> Mis Medidas
            </Text>

            <View style={styles.inputsRow}>
              <View style={styles.inputGroupSmall}>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Años"
                  keyboardType="number-pad"
                  value={edad}
                  onChangeText={setEdad}
                  maxLength={3}
                />
              </View>

              <View style={styles.inputGroupSmall}>
                <Text style={styles.inputLabel}>Altura (cm)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Ej: 175"
                  keyboardType="number-pad"
                  value={altura}
                  onChangeText={setAltura}
                  maxLength={3}
                />
              </View>

              <View style={styles.inputGroupSmall}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Ej: 70.5"
                  keyboardType="decimal-pad"
                  value={peso}
                  onChangeText={setPeso}
                  maxLength={5}
                />
              </View>
            </View>

            {imc && (
              <View style={styles.imcContainer}>
                <Text style={styles.imcLabelSmall}>Tu IMC estimado:</Text>
                <Text style={styles.imcValueLarge}>{imc}</Text>
                <Text style={[styles.imcCategoryText, { color: imcColor }]}>
                  {imcCategory.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* LIMITACIONES */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <Icon name="alert-circle" size={20} color={COLORS.brandYellow} /> Limitaciones Físicas
            </Text>

            <Text style={styles.sectionHelper}>Selecciona varias si es necesario.</Text>

            {renderCheckboxGroupWithManualInput(
              opcionesLimitaciones,
              limitaciones,
              setLimitaciones,
              otraLimitacion,
              setOtraLimitacion,
              "Ej: Operación de rodilla hace 2 años..."
            )}
          </View>

          {/* ALERGIAS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <Icon name="food-apple" size={20} color={COLORS.brandYellow} /> Nutrición y Alergias
            </Text>

            <Text style={styles.sectionHelper}>Selecciona todas las que apliquen.</Text>

            {renderCheckboxGroupWithManualInput(
              opcionesAlergias,
              alergias,
              setAlergias,
              otraAlergia,
              setOtraAlergia,
              "Ej: alergia a mariscos..."
            )}
          </View>

          {/* BOTÓN GUARDAR */}
          <TouchableOpacity style={styles.saveButton} onPress={guardarDatos} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Perfil</Text>
            )}
          </TouchableOpacity>

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