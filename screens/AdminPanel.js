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
    Switch,
    BackHandler,
    Platform,
    StatusBar,
} from 'react-native';
import { db, auth } from './firebaseConfig';
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { debounce } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

// --- PALETA DE COLORES DEL DISEÑO (Mantenida) ---
const COLORS = {
    mediumGreen: '#4CAF50',
    lightGreenBg: '#E8F5E9', // Fondo principal
    cardBg: '#C8E6C9', // Fondo tarjetas
    yellowStripe: '#FBC02D',
    redButton: '#D32F2F',
    textDark: '#263238',
    textLight: '#546E7A',
    white: '#FFFFFF',
    grayBadge: '#90A4AE',
    searchBorder: '#A5D6A7',
    inputBg: '#F5F5F5',
    inputBorder: '#E0E0E0',
};

export default function AdminPanel({ navigation }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPlan, setEditPlan] = useState('');
    const [displayEmail, setDisplayEmail] = useState('');

    const [editIsPremium, setEditIsPremium] = useState(false);
    const [editSubscriptionDate, setEditSubscriptionDate] = useState('');

    const planOptions = ['Plan 1', 'Plan 2', 'Plan 3'];

    // --- Suscripción en Tiempo Real ( onSnapshot ) ---
    useEffect(() => {
        setLoading(true);
        const q = collection(db, 'usuarios');

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedUsers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(fetchedUsers);
            filterData(searchText, fetchedUsers);
            setLoading(false);
        }, (error) => {
            console.error('Error en tiempo real:', error);
            Alert.alert('Error', 'Problema de conexión con la base de datos en tiempo real.');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // --- FUNCIÓN DE CIERRE DE SESIÓN ---
    const handleLogout = useCallback(async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas salir?',
            [
                { text: 'Cancelar', style: 'cancel', onPress: () => { } },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (e) {
                            Alert.alert('Error', e.message);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }, [navigation]);

    // --- MANEJO DEL BOTÓN DE RETROCESO (Usando useFocusEffect) ---
    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                handleLogout();
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            return () => backHandler.remove();
        }, [handleLogout])
    );

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

    const handleEditUser = (user) => {
        setCurrentUserToEdit(user);
        setEditName(user.nombre || '');
        // Si el plan no existe o no está en las opciones, establece 'Ninguno' para la visualización
        const currentPlan = user.plan && planOptions.includes(user.plan) ? user.plan : 'Plan 1'; // Se inicializa a Plan 1 para evitar Ninguno en el modal
        setEditPlan(currentPlan);
        setDisplayEmail(user.email || '');

        setEditIsPremium(user.isPremium || false);
        setEditSubscriptionDate(user.fechaSuscripcion || '');

        setIsEditModalVisible(true);
    };

    // ----------------------------------------------------------------------------------
    // ✅ FUNCIÓN CORREGIDA: Lógica de actualización de Firestore
    // ----------------------------------------------------------------------------------
    const saveEditedUser = async () => {
        if (!currentUserToEdit) return;

        setLoading(true);
        try {
            const userDocRef = doc(db, 'usuarios', currentUserToEdit.id);

            const updates = {
                nombre: editName,
                plan: editPlan,
                isPremium: editIsPremium,
                // Si es Premium Y tiene fecha, usa la fecha. Si no (Freemium), establece a null para borrar el campo de la suscripción.
                fechaSuscripcion: editIsPremium && editSubscriptionDate ? editSubscriptionDate : null,
            };

            await updateDoc(userDocRef, updates); // <--- Aquí se realiza la actualización

            Alert.alert('Éxito', 'Usuario actualizado correctamente.');
            setIsEditModalVisible(false);

        } catch (e) {
            console.error('Error al guardar (Firestore):', e);
            if (e.code === 'permission-denied') {
                Alert.alert('Error de Permisos', 'No tienes permisos de administrador para editar este usuario.');
            } else {
                Alert.alert('Error', 'Falló la actualización: ' + e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    // ----------------------------------------------------------------------------------

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
        } catch (e) {
            console.error('Error al eliminar:', e);
            Alert.alert('Error', 'Falló la eliminación: ' + e.message);
        }
    };


    // --- Renderizado de la Tarjeta de Usuario ---
    const renderUserItem = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.cardStripe} />
            <View style={styles.cardContent}>
                <Text style={styles.userName}>Nombre Usuario: <Text style={styles.userNameBold}>{item.nombre || 'Sin Nombre'}</Text></Text>
                <Text style={styles.userEmail}>Correo: {item.email || 'Sin Email'}</Text>

                <View style={styles.planStatusContainer}>
                    <Text style={styles.userPlan}>Plan: {item.plan || 'Ninguno'}</Text>
                    {/* Insignia de Estado con EMOJIS anteriores */}
                    <View style={[styles.statusBadge, item.isPremium ? styles.premiumBadge : styles.freemiumBadge]}>
                        <Text style={styles.badgeTextBold}>
                            {item.isPremium ? '⭐ Usuario Premium' : '👤 Usuario Freemium'}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardActions}>
                    <TouchableOpacity style={[styles.cardActionButton, styles.editButton]} onPress={() => handleEditUser(item)}>
                        <Text style={styles.cardActionText}>Editar Datos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cardActionButton, styles.deleteButton]} onPress={() => confirmDeleteUser(item)}>
                        <Text style={styles.cardActionText}>Borrar Datos</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading && users.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.mediumGreen} />
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={COLORS.lightGreenBg} barStyle="dark-content" />

            <SafeAreaView style={styles.safeArea}>
                {/* --- TÍTULO SIMPLE --- */}
                <Text style={styles.headerTitle}>Menú de Administración</Text>

                {/* --- CONTENIDO PRINCIPAL --- */}
                <View style={styles.contentContainer}>
                    <View style={styles.searchContainer}>
                        <Icon name="magnify" size={24} color="#9E9E9E" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar por nombre o correo..."
                            value={searchText}
                            onChangeText={handleSearchChange}
                            placeholderTextColor="#9E9E9E"
                        />
                    </View>

                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUserItem}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={<Text style={styles.emptyList}>No se encontraron usuarios.</Text>}
                        style={styles.flatList}
                    />
                </View>

                {/* --- BOTÓN DE CERRAR SESIÓN --- */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.footerLogoutButton} onPress={handleLogout}>
                        <Text style={styles.footerLogoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* --- Modal de Edición --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
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
                        <Text style={styles.label}>Estado de Suscripción:</Text>
                        <View style={styles.switchContainer}>
                            <Switch
                                trackColor={{ false: "#BDBDBD", true: COLORS.mediumGreen }}
                                thumbColor={editIsPremium ? COLORS.yellowStripe : "#F5F5F5"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setEditIsPremium}
                                value={editIsPremium}
                            />
                            <Text style={styles.switchLabel}>
                                {editIsPremium ? "⭐ Premium" : "👤 Freemium"}
                            </Text>
                        </View>
                        {editIsPremium && (
                            <>
                                <Text style={styles.label}>Fecha de Suscripción (Texto):</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Ej: 2025-11-28T..."
                                    value={editSubscriptionDate}
                                    onChangeText={setEditSubscriptionDate}
                                />
                            </>
                        )}

                        {/* --- SECCIÓN DE BOTONES DE PLAN RECUPERADA --- */}
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
                        {/* ------------------------------------------- */}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setIsEditModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={saveEditedUser}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.lightGreenBg,
    },
    safeArea: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 2,
        borderColor: COLORS.searchBorder,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textDark,
    },
    flatList: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyList: {
        textAlign: 'center',
        fontSize: 18,
        color: COLORS.textLight,
        marginTop: 50,
    },
    userCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.cardBg,
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardStripe: {
        width: 12,
        backgroundColor: COLORS.yellowStripe,
    },
    cardContent: {
        flex: 1,
        padding: 15,
    },
    userName: {
        fontSize: 16,
        color: COLORS.textDark,
        marginBottom: 4,
    },
    userNameBold: {
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12,
    },
    planStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    userPlan: {
        fontSize: 15,
        color: COLORS.textDark,
        fontWeight: '500',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    premiumBadge: {
        backgroundColor: COLORS.mediumGreen,
    },
    freemiumBadge: {
        backgroundColor: COLORS.grayBadge,
    },
    badgeTextBold: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardActionButton: {
        flex: 0.48,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: COLORS.mediumGreen,
    },
    deleteButton: {
        backgroundColor: COLORS.redButton,
    },
    cardActionText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    footerContainer: {
        padding: 20,
    },
    footerLogoutButton: {
        backgroundColor: COLORS.redButton,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: COLORS.redButton,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    footerLogoutText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.lightGreenBg,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textLight,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 25,
        width: '90%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.textDark,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLORS.textDark,
        marginTop: 10,
    },
    modalInput: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: COLORS.textDark,
    },
    readOnlyInput: {
        backgroundColor: '#ECEFF1',
        color: COLORS.textLight,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 5,
    },
    switchLabel: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
        color: COLORS.textDark,
    },
    // --- ESTILOS RECUPERADOS PARA LOS BOTONES DEL PLAN ---
    planButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 20,
    },
    planButton: {
        backgroundColor: COLORS.inputBg,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        marginBottom: 10,
        width: '48%',
        alignItems: 'center',
    },
    selectedPlanButton: {
        backgroundColor: COLORS.mediumGreen,
        borderColor: COLORS.mediumGreen,
    },
    planButtonText: {
        color: COLORS.textDark,
        fontSize: 14,
        fontWeight: '500',
    },
    selectedPlanButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    // ---------------------------------------------------
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: COLORS.grayBadge,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        minWidth: 110,
        alignItems: 'center',
    },
    modalSaveButton: {
        backgroundColor: COLORS.mediumGreen,
    },
    modalButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});