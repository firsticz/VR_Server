const activityTC = require('../type-composers/activity')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt,
  },
} = require('graphql-compose')

const activity = {
  activityById: activityTC.getResolver('findById'),
  activityByIds: activityTC.getResolver('findByIds'),
  activityOne: activityTC.getResolver('findOne'),
  activityMany: activityTC.getResolver('findMany'),
  activityCount: activityTC.getResolver('count'),
  activityConnection: activityTC.getResolver('connection'),
  activityPagination: activityTC.getResolver('pagination'),
}

module.exports = activity
