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

const updateActivityResolver = new Resolver({
  name: 'updateActivity',
  args: {
    userid: 'String',
    token: 'String',
  },
  type: new GraphQLList(activityTC.getType()),
  resolve: async ({ args: { userid, token } }) => {
    const data = await activitys.updateactivity(userid, token)
    console.log(data)
    return data
  },
}, schemaComposer)

const getActivitiesResolver = new Resolver({
  name: 'getActivity',
  args: {
    userid: 'Int'
  },
  type: new GraphQLList(activityTC.getType()),
  resolve: async ({ args: { userid }}) => {
    const data = await activitys.find({'athlete.id' : userid})
    return data
  }
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
  updateActivity: updateActivityResolver,
  getActivity: getActivitiesResolver,
}

module.exports = activity
