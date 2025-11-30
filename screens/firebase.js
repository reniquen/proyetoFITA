
const auth = firebase.auth();
const db = firebase.firestore();


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

    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    
    auth.onAuthStateChanged((user) => {
        if (user) {
            
            db.collection("users").doc(user.uid).set({
                nombre: nombre,
                altura: altura,
                peso: peso,
                correo: correo,
            })
            .then(() => {
                alert("Información guardada exitosamente");
                window.location.href = "./Home.js"; 
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
