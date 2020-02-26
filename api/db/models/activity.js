const activitySchema = require('./../schemas/activity')

const mongoose = require('mongoose')

const activity = mongoose.model('activitys', activitySchema)

module.exports = activity
