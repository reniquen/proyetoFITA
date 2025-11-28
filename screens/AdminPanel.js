// screens/AdminPanel.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  // IMPORTANTE: Importar Switch para el botón de Premium
  Switch,
} from 'react-native';
// Importamos db, auth y las funciones directas de Firestore
import { db, auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
// Usamos onSnapshot para tiempo real en lugar de getDocs
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { debounce } from 'lodash';

export default function AdminPanel({ navigation }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Estados para el modal de edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');

  // --- NUEVOS ESTADOS PARA SUSCRIPCIÓN ---
  const [editIsPremium, setEditIsPremium] = useState(false);
  const [editSubscriptionDate, setEditSubscriptionDate] = useState('');

  // --- Opciones de Plan (Botones) ---
  const planOptions = ['Plan 1', 'Plan 2', 'Plan 3'];

  // --- Suscripción en Tiempo Real ( onSnapshot ) ---
  useEffect(() => {
    setLoading(true);
    // Creamos la referencia a la colección
    const q = collection(db, 'usuarios');

    // Nos suscribimos a los cambios. Esto se ejecuta automáticamente
    // cuando algo cambia en la base de datos (ej. un usuario paga)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
      // Aplicamos el filtro actual a los nuevos datos
      filterData(searchText, fetchedUsers);
      setLoading(false);
    }, (error) => {
      console.error('Error en tiempo real:', error);
      Alert.alert('Error', 'Problema de conexión con la base de datos en tiempo real.');
      setLoading(false);
    });

    // Función de limpieza al desmontar el componente
    return () => unsubscribe();
  }, []); // Se ejecuta una vez al montar

  // Función para filtrar localmente
  const filterData = (text, usersData) => {
    if (text) {
      const newData = usersData.filter((user) => {
        const itemData = user.nombre ? user.nombre.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        const emailData = user.email ? user.email.toUpperCase() : ''.toUpperCase();
        return itemData.indexOf(textData) > -1 || emailData.indexOf(textData) > -1;
      });
      setFilteredUsers(newData);
    } else {
      setFilteredUsers(usersData);
    }
  };

  // Debounce para la búsqueda
  const debouncedSearch = useCallback(
    debounce((text) => {
       filterData(text, users);
    }, 300),
    [users]
  );

  const handleSearchChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  // --- Funciones de Acción ---

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  const handleEditUser = (user) => {
    setCurrentUserToEdit(user);
    setEditName(user.nombre || '');
    const currentPlan = user.plan && planOptions.includes(user.plan) ? user.plan : 'Ninguno';
    setEditPlan(currentPlan);
    setDisplayEmail(user.email || '');

    // --- CARGAR DATOS NUEVOS AL MODAL ---
    // Si isPremium no existe, asumimos false (Freemium)
    setEditIsPremium(user.isPremium || false);
    // Si hay fecha, la mostramos como string. Si no, cadena vacía.
    // NOTA: En tu imagen la fecha es un string largo. Si en el futuro usas
    // Timestamps de Firestore, habría que convertirlo aquí: user.fechaSuscripcion?.toDate().toString()
    setEditSubscriptionDate(user.fechaSuscripcion || '');

    setIsEditModalVisible(true);
  };

  const saveEditedUser = async () => {
    if (!currentUserToEdit) return;

    setLoading(true);
    try {
      const userDocRef = doc(db, 'usuarios', currentUserToEdit.id);

      // Preparamos los datos a actualizar
      const updates = {
        nombre: editName,
        plan: editPlan,
        // Guardamos el estado del interruptor
        isPremium: editIsPremium,
        // Lógica importante: Si ahora es Premium, guardamos la fecha que haya en el input.
        // Si lo pasamos a Freemium (false), borramos la fecha (null) para mantener la consistencia.
        fechaSuscripcion: editIsPremium ? editSubscriptionDate : null,
      };

      await updateDoc(userDocRef, updates);

      Alert.alert('Éxito', 'Usuario actualizado correctamente en la base de datos.');
      setIsEditModalVisible(false);
      // No hace falta llamar a fetchUsers() porque onSnapshot se actualiza solo

    } catch (e) {
      console.error('Error al guardar (Firestore directo):', e);
      if (e.code === 'permission-denied') {
         Alert.alert('Error de Permisos', 'No tienes permisos de administrador para editar este usuario.');
      } else {
         Alert.alert('Error', 'Falló la actualización: ' + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (user) => {
    Alert.alert(
      'Confirmar Eliminación',
      `Se eliminarán los DATOS de ${user.nombre || user.email}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar Datos', onPress: () => deleteUser(user), style: 'destructive' },
      ]
    );
  };

  const deleteUser = async (user) => {
    try {
      await deleteDoc(doc(db, 'usuarios', user.id));
      Alert.alert('Éxito', 'Datos del usuario eliminados.');
      // onSnapshot actualizará la lista automáticamente
    } catch (e) {
      console.error('Error al eliminar:', e);
      Alert.alert('Error', 'Falló la eliminación: ' + e.message);
    }
  };

  // --- Renderizado ---

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.nombre || 'Sin Nombre'}</Text>
      <Text style={styles.userEmail}>{item.email || 'Sin Email'}</Text>
      <Text style={styles.userPlan}>Plan: {item.plan || 'Ninguno'}</Text>

      {/* --- NUEVO: Indicador visual en la tarjeta --- */}
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, item.isPremium ? styles.premiumText : styles.freemiumText]}>
             {item.isPremium ? '⭐ Usuario Premium' : '👤 Usuario Freemium'}
        </Text>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditUser(item)}>
          <Text style={styles.actionButtonText}>Editar Datos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => confirmDeleteUser(item)}
        >
          <Text style={styles.actionButtonText}>Borrar Datos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && users.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Menú de Administración</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Buscar por nombre o correo..."
        value={searchText}
        onChangeText={handleSearchChange}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyList}>No se encontraron usuarios.</Text>}
        style={styles.flatList}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* Modal de Edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Usamos ScrollView por si el modal se hace muy alto */}
            <React.Fragment>
            <Text style={styles.modalTitle}>Editar Datos</Text>

            <Text style={styles.label}>Correo (Solo lectura):</Text>
             <TextInput
              style={[styles.modalInput, styles.readOnlyInput]}
              value={displayEmail}
              editable={false}
            />

            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre del usuario"
              value={editName}
              onChangeText={setEditName}
            />

             {/* --- NUEVA SECCIÓN DE SUSCRIPCIÓN --- */}
            <Text style={styles.label}>Estado de Suscripción:</Text>
            <View style={styles.switchContainer}>
                <Switch
                    trackColor={{ false: "#767577", true: "#3498db" }}
                    thumbColor={editIsPremium ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setEditIsPremium} // Al cambiar, actualiza el estado
                    value={editIsPremium} // El valor actual (true/false)
                />
                <Text style={styles.switchLabel}>
                    {editIsPremium ? "⭐ Premium" : "👤 Freemium"}
                </Text>
            </View>

            {/* Solo mostramos el campo de fecha si es Premium */}
            {editIsPremium && (
                <>
                    <Text style={styles.label}>Fecha de Suscripción:</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Ej: 2025-11-28T..."
                        value={editSubscriptionDate}
                        onChangeText={setEditSubscriptionDate}
                        // Nota: Para producción, aquí sería mejor un DatePicker
                    />
                    <Text style={styles.helperText}>
                        * Si cambias a Freemium, esta fecha se borrará al guardar.
                    </Text>
                </>
            )}
            {/* --- FIN NUEVA SECCIÓN --- */}


            <Text style={styles.label}>Seleccionar Plan de Ejercicios:</Text>
            <View style={styles.planButtonsContainer}>
              {planOptions.map((plan, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.planButton,
                    editPlan === plan && styles.selectedPlanButton,
                  ]}
                  onPress={() => setEditPlan(plan)}
                >
                  <Text
                    style={[
                      styles.planButtonText,
                      editPlan === plan && styles.selectedPlanButtonText,
                    ]}
                  >
                    {plan}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={saveEditedUser}>
                <Text style={styles.modalButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
            </React.Fragment>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#34495e',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    fontSize: 16,
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 5,
  },
  userPlan: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  // --- ESTILOS NUEVOS PARA STATUS EN TARJETA ---
  statusContainer: {
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  premiumText: {
    color: '#27ae60', // Verde para premium
  },
  freemiumText: {
    color: '#7f8c8d', // Gris para freemium
  },
  // --------------------------------------------
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#95a5a6',
  },
  logoutButton: {
    backgroundColor: '#c0392b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    elevation: 4,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%', // Un poco más ancho
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#34495e',
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: '#e9ecef',
    color: '#7f8c8d',
  },
  // --- ESTILOS NUEVOS PARA EL SWITCH Y LA FECHA EN MODAL ---
  switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
      paddingVertical: 5,
  },
  switchLabel: {
      fontSize: 16,
      marginLeft: 10,
      fontWeight: '500',
      color: '#333',
  },
  helperText: {
      fontSize: 12,
      color: '#e74c3c',
      marginTop: 2,
      fontStyle: 'italic',
  },
  // -------------------------------------------------------
  planButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
  },
  planButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  selectedPlanButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  planButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedPlanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  modalSaveButton: {
    backgroundColor: '#27ae60',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});