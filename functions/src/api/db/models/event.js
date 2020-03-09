const eventSchema = require('./../schemas/event')

const mongoose = require('mongoose')

const events = mongoose.model('events', eventSchema)

module.exports = events
