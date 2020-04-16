const eventTC = require('../type-composers/event')

const events = require('../../db/models/event')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt,
  },
} = require('graphql-compose')

const registerEvent = new Resolver({
  name: 'registerEvent',
  type: eventTC.getType(),
  args: {
    eventid: GraphQLInt,
    userid: GraphQLInt
  },
  resolve: async ({ args }) => {
    const { eventid, userid } = args
    const event = await events.findOneAndUpdate({ eventId: eventid }, { $push:{ member: userid } })

    if (!event) {
      throw new Error('can not register')
    }
    return event
  },
}, schemaComposer)


const event = {
  createEvent: eventTC.getResolver('createOne'),
  updateEvent: eventTC.getResolver('updateById'),
  removeEvent: eventTC.getResolver('removeById'),
  registerEvent,
}

module.exports = event
