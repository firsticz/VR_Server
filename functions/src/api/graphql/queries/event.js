const eventsTC = require('../type-composers/event')
const events = require('../../db/models/event')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt,
  },
} = require('graphql-compose')


const event = {
  eventById: eventsTC.getResolver('findById'),
  eventByIds: eventsTC.getResolver('findByIds'),
  eventOne: eventsTC.getResolver('findOne'),
  eventMany: eventsTC.getResolver('findMany'),
  eventCount: eventsTC.getResolver('count'),
  eventConnection: eventsTC.getResolver('connection'),
  eventPagination: eventsTC.getResolver('pagination'),
}
module.exports = event
