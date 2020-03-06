const eventTC = require('../type-composers/event')

const events = require('../../db/models/event')

// const {
//   schemaComposer, Resolver, graphql: {
//     GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt,
//   },
// } = require('graphql-compose')


const event = {
  createEvent: eventTC.getResolver('createOne'),
  updateEvent: eventTC.getResolver('updateById'),
  removeEvent: eventTC.getResolver('removeById'),
}

module.exports = event
