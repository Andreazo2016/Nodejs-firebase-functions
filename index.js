// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const createApp = require('./src/app')
const firebaseConfig = require('./src/config/firebase.config')
const serviceAccount = require("./firebase-admin-config.json");


const userRouters = require('./src/routes/users.routes')
const sessionsRouters = require('./src/routes/sessions.routes')

exports.users = functions.https.onRequest(createApp({ routes: userRouters }))
exports.sessions = functions.https.onRequest(createApp({ routes: sessionsRouters }))


// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const firebase = require('firebase');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

firebase.initializeApp({ ...firebaseConfig })