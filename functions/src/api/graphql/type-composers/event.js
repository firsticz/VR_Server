const events = require('../../db/models/event')

const { composeWithMongoose } = require('graphql-compose-mongoose')

const customizationOptions = {}

const eventsTC = composeWithMongoose(events, customizationOptions)


module.exports =eventsTC
