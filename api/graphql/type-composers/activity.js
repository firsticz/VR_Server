const activity = require('../../db/models/activity')

const { composeWithMongoose } = require('graphql-compose-mongoose')

const customizationOptions = {}

const activityTC = composeWithMongoose(activity, customizationOptions)

module.exports = activityTC
