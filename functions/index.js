const functions = require('firebase-functions');
const admin = require('firebase-admin')

const connect = require('./dist/api/database')

admin.initializeApp()
connect()
const { app } = require('./dist/index')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.app = functions.runWith({ memory: '512MB', timeoutSeconds: 60 }).https.onRequest(app)
