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
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importación corregida
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function AdminPanel({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [campoEditando, setCampoEditando] = useState('email');
  const [nuevoValor, setNuevoValor] = useState('');

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
    setCampoEditando('email');
    setNuevoValor(usuario.email);
    setModalVisible(true);
  };

  const guardarCambios = async () => {
    if (!nuevoValor.trim()) {
      Alert.alert('Error', 'El valor no puede estar vacío.');
      return;
    }

    try {
      await updateDoc(doc(db, 'usuarios', usuarioEditando.id), {
        [campoEditando]: nuevoValor
      });

      setUsuarios(usuarios.map(user =>
        user.id === usuarioEditando.id ? { ...user, [campoEditando]: nuevoValor } : user
      ));

      setModalVisible(false);
      Alert.alert('Éxito', 'Campo actualizado correctamente.');
    } catch (error) {
      console.error('Error editando usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar la información.');
    }
  };

  const cambiarCampoEditando = (campo) => {
    setCampoEditando(campo);
    setNuevoValor(usuarioEditando[campo] || '');
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
            <Text style={styles.textoSecundario}>📧 {item.email}</Text>
            <Text style={styles.textoSecundario}>Altura: {item.altura || 'N/A'}</Text>
            <Text style={styles.textoSecundario}>Peso: {item.peso || 'N/A'}</Text>
            <Text style={styles.textoSecundario}>IMC: {item.imc || 'N/A'}</Text>
            <Text style={styles.textoSecundario}>Plan: {item.plan || 'N/A'}</Text>

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

      {/* Modal para editar campos */}
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
            <Text style={styles.modalTitulo}>Editar Campo</Text>

            <Text style={styles.modalSubtitulo}>
              Editando: {usuarioEditando?.nombre} {usuarioEditando?.apellido}
            </Text>

            <Text style={styles.label}>Selecciona el campo a editar:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={campoEditando}
                style={styles.picker}
                onValueChange={cambiarCampoEditando}
              >
                <Picker.Item label="Email" value="email" />
                <Picker.Item label="Nombre" value="nombre" />
                <Picker.Item label="Altura" value="altura" />
                <Picker.Item label="Peso" value="peso" />
                <Picker.Item label="IMC" value="imc" />
                <Picker.Item label="Plan" value="plan" />
              </Picker>
            </View>

            <Text style={styles.label}>Nuevo valor:</Text>
            <TextInput
              style={styles.input}
              value={nuevoValor}
              onChangeText={setNuevoValor}
              placeholder={`Ingrese el nuevo ${campoEditando}`}
              keyboardType={campoEditando === 'email' ? 'email-address' : 'default'}
              autoCapitalize={campoEditando === 'nombre' ? 'words' : 'none'}
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
    marginBottom: 5,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#34495e',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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