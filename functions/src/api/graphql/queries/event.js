const eventsTC = require('../type-composers/event')
const events = require('../../db/models/event')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt,
  },
} = require('graphql-compose')


const event = {
  userById: eventsTC.getResolver('findById'),
  userByIds: eventsTC.getResolver('findByIds'),
  userOne: eventsTC.getResolver('findOne'),
  userMany: eventsTC.getResolver('findMany'),
  userCount: eventsTC.getResolver('count'),
  userConnection: eventsTC.getResolver('connection'),
  userPagination: eventsTC.getResolver('pagination'),
}
module.exports = event
