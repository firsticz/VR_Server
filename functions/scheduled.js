const functions = require('firebase-functions')
const mongoose = require('mongoose')
const Activitys = mongoose.model('activitys')
const Promise = require('bluebird')


exports.scheduled = functions
  .runWith({ memory: '512MB', timeoutSeconds: 60 })
  .region('asia-east2')
  .pubsub
  // .schedule('*/5 * * * *') // every 5 minutes
  .schedule('every 1 hours') // every 5 minutes
  .timeZone('Asia/Bangkok') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {
    // console.log('RUNNGING schedulted', new Date())
    return Promise.each([
      'updateAllActivity',
    ], (resource) => {
      return Activitys.updateAllActivity()
    })
    // console.log('running', context)
    // return null
    // const status = Activitys.updateAllActivity()
    if(status){
      console.log("success")
    }
  })
