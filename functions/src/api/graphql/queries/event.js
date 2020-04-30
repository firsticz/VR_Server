const eventsTC = require('../type-composers/event')
const events = require('../../db/models/event')
const activityTC = require('../type-composers/activity')
const userTC = require('../type-composers/users')
const users = require('../../db/models/users')

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
      },
      profile: {
        type: new GraphQLList(userTC.getType())
      }
    }
  })),
  args: {
    eventId: 'Float',
  },
  resolve: async ({args}) => {
    const { eventId } = args
    const data = await events.activityhasevent(eventId)
    return data
  },
},schemaComposer)

const myteamleadResolver = new Resolver({
  name: 'myteamlead',
  type: new GraphQLList(new GraphQLObjectType({
    name: 'myteamleadType',
    fields: {
      _id: {
        type: GraphQLString,
      },
      event: {
        type: new GraphQLList(eventsTC.getType())
      },
      activities: {
        type: new GraphQLList(activityTC.getType())
      },
      profile: {
        type: new GraphQLList(userTC.getType())
      }
    }
  })),
  args: {
    eventId: 'Float',
    userId: 'Float'
  },
  resolve: async ({args}) => {
    const { eventId, userId } = args
    let listgroup= []
    const user = await  users.find({"id" : userId})
    user.forEach(element => {
      listgroup = element.group
    })
    const data = await events.myteamlead(eventId, listgroup)
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
  MyteamLead: myteamleadResolver
}
module.exports = event
