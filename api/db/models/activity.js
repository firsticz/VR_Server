const activitySchema = require('./../schemas/activity')

const mongoose = require('mongoose')

const activity = mongoose.model('activity', activitySchema)

module.exports = activity
