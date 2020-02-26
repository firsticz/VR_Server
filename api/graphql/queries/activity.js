const activityTC = require('../type-composers/activity')
const activitys = require('../../db/models/activity')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt,
  },
} = require('graphql-compose')

const activityuserResolver = new Resolver({
  name: 'activityuser',
  args: { userid: GraphQLString },
  type: new GraphQLList(new GraphQLObjectType({
    name: 'activityuserType',
    fields: {
      _id: {
        type: GraphQLString,
      },
    },
  })),
  resolve: async ({ args: { userid } }) => {
    const data = await activitys.useractivity(userid)
    console.log(data)
    return data
  },
}, schemaComposer)

const activity = {
  activityById: activityTC.getResolver('findById'),
  activityByIds: activityTC.getResolver('findByIds'),
  activityOne: activityTC.getResolver('findOne'),
  activityMany: activityTC.getResolver('findMany'),
  activityCount: activityTC.getResolver('count'),
  activityConnection: activityTC.getResolver('connection'),
  activityPagination: activityTC.getResolver('pagination'),
  activityuser: activityuserResolver,
}

module.exports = activity
