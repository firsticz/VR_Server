const usersTC = require('../type-composers/users')
const users = require('../../db/models/users')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt,
  },
} = require('graphql-compose')

const leaderboardResolver = new Resolver({
  name: 'leaderboard',
  type: new GraphQLList(new GraphQLObjectType({
    name: 'leaderboardType',
    fields: {
      _id: {
        type: GraphQLString,
      },
      totaldistance: {
        type: GraphQLFloat,
      },
      firstname: {
        type: GraphQLString,
      },
      lastname: {
        type: GraphQLString,
      },
      profile: {
        type: GraphQLString,
      },
      sex: {
        type: GraphQLString,
      },
    },
  })),
  resolve: async () => {
    const data = await users.leaderboard()
    return data
  },
}, schemaComposer)

const user = {
  userById: usersTC.getResolver('findById'),
  userByIds: usersTC.getResolver('findByIds'),
  userOne: usersTC.getResolver('findOne'),
  userMany: usersTC.getResolver('findMany'),
  userCount: usersTC.getResolver('count'),
  userConnection: usersTC.getResolver('connection'),
  userPagination: usersTC.getResolver('pagination'),
  leaderboard: leaderboardResolver,
}

module.exports = user
