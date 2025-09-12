import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function AdminPanel({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nuevoEmail, setNuevoEmail] = useState(''); // Cambiado de nuevoCorreo a nuevoEmail

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        const listaUsuarios = querySnapshot.docs.map(docu => ({
          id: docu.id,
          ...docu.data(),
        }));
        setUsuarios(listaUsuarios);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de usuarios.');
      }
    };

    obtenerUsuarios();
  }, []);

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch(() => Alert.alert('Error', 'No se pudo cerrar sesión.'));
  };

  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, 'usuarios', id));
      setUsuarios(usuarios.filter(user => user.id !== id));
      Alert.alert('Éxito', 'Usuario eliminado correctamente.');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      Alert.alert('Error', 'No se pudo eliminar el usuario.');
    }
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditando(usuario);
    setNuevoEmail(usuario.email); // Cambiado de correo a email
    setModalVisible(true);
  };

  const guardarCambios = async () => {
    if (!nuevoEmail.trim()) { // Cambiado de nuevoCorreo a nuevoEmail
      Alert.alert('Error', 'El email no puede estar vacío.'); // Cambiado de correo a email
      return;
    }

    try {
      await updateDoc(doc(db, 'usuarios', usuarioEditando.id), {
        email: nuevoEmail // Cambiado de correo a email
      });

      setUsuarios(usuarios.map(user =>
        user.id === usuarioEditando.id ? { ...user, email: nuevoEmail } : user // Cambiado de correo a email
      ));

      setModalVisible(false);
      Alert.alert('Éxito', 'Email actualizado correctamente.'); // Cambiado de correo a email
    } catch (error) {
      console.error('Error editando usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar la información.');
    }
  };

  return (
    <View style={styles.padre}>
      <Text style={styles.titulo}>Panel de Administración</Text>
      <Text style={styles.subtitulo}>Bienvenido, administrador</Text>

      <Text style={styles.texto}>Usuarios registrados: {usuarios.length}</Text>

      {/* Lista de usuarios */}
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        style={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.texto}>{item.nombre} {item.apellido}</Text>
            <Text style={styles.textoSecundario}>📧 {item.email}</Text> {/* Cambiado de correo a email */}

            <View style={styles.acciones}>
              <TouchableOpacity
                style={[styles.botonAccion, { backgroundColor: '#f39c12' }]}
                onPress={() => abrirModalEdicion(item)}
              >
                <Text style={styles.botonTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botonAccion, { backgroundColor: '#e74c3c' }]}
                onPress={() => eliminarUsuario(item.id)}
              >
                <Text style={styles.botonTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para editar email */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Editar Email</Text> {/* Cambiado de Correo Electrónico a Email */}

            <Text style={styles.modalSubtitulo}>
              Editando: {usuarioEditando?.nombre} {usuarioEditando?.apellido}
            </Text>

            <TextInput
              style={styles.input}
              value={nuevoEmail} // Cambiado de nuevoCorreo a nuevoEmail
              onChangeText={setNuevoEmail} // Cambiado de setNuevoCorreo a setNuevoEmail
              placeholder="Ingrese el nuevo email" // Cambiado de correo a email
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.botonModal, styles.botonCancelar]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.botonTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botonModal, styles.botonGuardar]}
                onPress={guardarCambios}
              >
                <Text style={styles.botonTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <TouchableOpacity style={[styles.boton, { backgroundColor: '#2ecc71' }]} onPress={cerrarSesion}>
        <Text style={[styles.botonTexto, { color: 'white' }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#2c3e50',
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
    color: '#34495e',
  },
  textoSecundario: {
    fontSize: 14,
    marginBottom: 10,
    color: '#7f8c8d',
  },
  lista: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonAccion: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  boton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  modalSubtitulo: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botonModal: {
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#e74c3c',
  },
  botonGuardar: {
    backgroundColor: '#2ecc71',
  },
});