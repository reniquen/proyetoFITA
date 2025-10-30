import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function AdminPanel({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);

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

  const editarUsuario = async (id) => {
    try {
      // Aquí puedes cambiar el campo que quieras actualizar. Ejemplo: nombre
      const nuevoNombre = "Usuario Editado"; // <-- lo ideal es mostrar un formulario o Alert.prompt
      await updateDoc(doc(db, 'usuarios', id), { nombre: nuevoNombre });

      setUsuarios(usuarios.map(user =>
        user.id === id ? { ...user, nombre: nuevoNombre } : user
      ));

      Alert.alert('Éxito', 'Usuario actualizado correctamente.');
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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.texto}>{item.nombre} {item.apellido}</Text>
            <Text style={styles.textoSecundario}>📧 {item.correo}</Text>

            <View style={styles.acciones}>
              <TouchableOpacity style={[styles.botonAccion, { backgroundColor: '#f39c12' }]} onPress={() => editarUsuario(item.id)}>
                <Text style={styles.botonTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonAccion, { backgroundColor: '#e74c3c' }]} onPress={() => eliminarUsuario(item.id)}>
                <Text style={styles.botonTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={[styles.boton, { backgroundColor: '#2ecc71' }]} onPress={cerrarSesion}>
        <Text style={[styles.botonTexto, { color: 'white' }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    backgroundColor: '#58d68d',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fad7a0',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoSecundario: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botonAccion: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  boton: {
    marginTop: 20,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  botonTexto: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});


