const groups = require('../../db/models/group')

const { composeWithMongoose } = require('graphql-compose-mongoose')

const customizationOptions = {}

const groupsTC = composeWithMongoose(groups, customizationOptions)


module.exports = groupsTC
