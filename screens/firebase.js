// Inicializar Firestore y Auth
const auth = firebase.auth();
const db = firebase.firestore();

// Función para guardar la información del usuario
function saveUserInfo() {
    const nombre = document.getElementById('nombre').value;
    const altura = document.getElementById('altura').value;
    const peso = document.getElementById('peso').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;
    
    // Validación básica
    if (!nombre || !altura || !peso || !correo || !contraseña) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Verificar que el correo tenga el formato correcto
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    // Verificar que el usuario esté autenticado
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Guardar la información en la colección "users" con el UID del usuario
            db.collection("users").doc(user.uid).set({
                nombre: nombre,
                altura: altura,
                peso: peso,
                correo: correo,
            })
            .then(() => {
                alert("Información guardada exitosamente");
                window.location.href = "./Home.js"; // Redirigir a otra pantalla si deseas
            })
            .catch((error) => {
                console.error("Error al guardar la información: ", error);
            });
        } else {
            alert("Usuario no autenticado. Inicia sesión primero.");
            window.location.href = "index.html";
        }
    });
}
