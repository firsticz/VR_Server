const functions = require('firebase-functions');
const admin = require('firebase-admin')

const connect = require('./dist/api/database')

admin.initializeApp()
connect()
const { app } = require('./dist/index')
const { scheduled } = require('./scheduled')


exports.app = functions.runWith({ memory: '512MB', timeoutSeconds: 60 }).https.onRequest(app)
exports.scheduled = scheduled