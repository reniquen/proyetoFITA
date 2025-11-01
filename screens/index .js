// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// Protege las funciones: solo usuarios con custom claim `admin:true` pueden ejecutar
function requireAdmin(context) {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Debe iniciar sesión.');
  if (!context.auth.token || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'No tiene permisos de administrador.');
  }
}

exports.updateUser = functions.https.onCall(async (data, context) => {
  try {
    requireAdmin(context);

    const { uid, docId, newEmail, newName } = data;
    if (!uid || !docId) {
      throw new functions.https.HttpsError('invalid-argument', 'Faltan uid o docId.');
    }

    // 1) Actualizar email en Auth (si viene)
    if (newEmail) {
      await admin.auth().updateUser(uid, { email: newEmail });
    }

    // 2) Actualizar datos en Firestore (nombre y correo)
    const updates = {};
    if (newName) updates.nombre = newName;
    if (newEmail) updates.correo = newEmail;

    if (Object.keys(updates).length > 0) {
      await db.collection('usuarios').doc(docId).update(updates);
    }

    return { success: true, message: 'Usuario actualizado correctamente.' };
  } catch (err) {
    console.error('updateUser error:', err);
    if (err instanceof functions.https.HttpsError) throw err;
    throw new functions.https.HttpsError('internal', err.message || 'Error interno');
  }
});

exports.deleteUser = functions.https.onCall(async (data, context) => {
  try {
    requireAdmin(context);

    const { uid, docId } = data;
    if (!uid || !docId) {
      throw new functions.https.HttpsError('invalid-argument', 'Faltan uid o docId.');
    }

    // 1) Eliminar del Auth
    await admin.auth().deleteUser(uid);

    // 2) Eliminar documento en Firestore
    await db.collection('usuarios').doc(docId).delete();

    return { success: true, message: 'Usuario eliminado correctamente.' };
  } catch (err) {
    console.error('deleteUser error:', err);
    if (err instanceof functions.https.HttpsError) throw err;
    throw new functions.https.HttpsError('internal', err.message || 'Error interno');
  }
});
