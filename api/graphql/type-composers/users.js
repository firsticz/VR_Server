const users = require('../../db/models/users')

const { composeWithMongoose } = require('graphql-compose-mongoose')

const customizationOptions = {}

const usersTC = composeWithMongoose(users, customizationOptions)

module.exports = usersTC
