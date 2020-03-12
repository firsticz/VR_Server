const eventsTC = require('../type-composers/event')
const events = require('../../db/models/event')
const activityTC = require('../type-composers/activity')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, Gr
  },
} = require('graphql-compose')

const activityhasevent = new Resolver({
  name: 'activityhasevent',
  type: new GraphQLList(new GraphQLObjectType({
    name: 'activityhaseventType',
    fields: {
      _id: {
        type: GraphQLString,
      },
      event: {
        type: new GraphQLList(eventsTC.getType())
      },
      activities: {
        type: new GraphQLList(activityTC.getType())
      }
    }
  })),
  resolve: async () => {
    const data = await events.activityhasevent()
    return data
  },
},schemaComposer)


const event = {
  eventById: eventsTC.getResolver('findById'),
  eventByIds: eventsTC.getResolver('findByIds'),
  eventOne: eventsTC.getResolver('findOne'),
  eventMany: eventsTC.getResolver('findMany'),
  eventCount: eventsTC.getResolver('count'),
  eventConnection: eventsTC.getResolver('connection'),
  eventPagination: eventsTC.getResolver('pagination'),
  activityhasevent,
}
module.exports = event
