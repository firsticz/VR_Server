const users = require('../../db/models/users')

const { composeWithMongoose } = require('graphql-compose-mongoose')

const customizationOptions = {}

const usersTC = composeWithMongoose(users, customizationOptions)
usersTC.addRelation('createdBy', {
  resolver: () => usersTC.getResolver('findOne'),
  prepareArgs: {
    filter: source => ({
      _id: source.createdById,
    }),
  },
  projection: { createdById: 1 },
})
usersTC.addRelation('updatedBy', {
  resolver: () => usersTC.getResolver('findOne'),
  prepareArgs: {
    filter: source => ({
      _id: source.updatedById,
    }),
  },
  projection: { updatedById: 1 },
})

module.exports = usersTC
