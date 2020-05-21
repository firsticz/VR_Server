const usersTC = require('../type-composers/users')
const users = require('../../db/models/users')
const eventsTC = require('../type-composers/event')
const activitiesTC = require('../type-composers/activity')
const groupsTC = require('../type-composers/group')

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
      totaltime: {
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

const groupleaderResolver = new Resolver({
  name: 'groupleader',
  type: new GraphQLList(new GraphQLObjectType({
    name: 'groupleaderType',
    fields: {
      _id: {
        type: GraphQLString,
      },
      user: {
        type: new GraphQLList(usersTC.getType())
      },
      activity: {
        type: new GraphQLList(activitiesTC.getType())
      },
      groupDetail: {
        type: new GraphQLList(groupsTC.getType())
      },
    }
  })),
  args: {
    eventId: 'Float',
  },
  resolve: async ({args}) => {
    const { eventId } = args
    const data = await users.groupleader(eventId)
    return data
  },
},schemaComposer)

const listemberResolver = new Resolver({
  name: 'listember',
  type: new GraphQLList(new GraphQLObjectType({
    name: 'listemberType',
    fields: {
      _id: {
        type: GraphQLString,
      },
      profile: {
        type: new GraphQLList(usersTC.getType())
      },

      
    }
  })),

  resolve: async () => {
    const data = await users.list_member()
    console.log(data)
    return data
  },
},schemaComposer)

const user = {
  userById: usersTC.getResolver('findById'),
  userByIds: usersTC.getResolver('findByIds'),
  userOne: usersTC.getResolver('findOne'),
  userMany: usersTC.getResolver('findMany'),
  userCount: usersTC.getResolver('count'),
  userConnection: usersTC.getResolver('connection'),
  userPagination: usersTC.getResolver('pagination'),
  leaderboard: leaderboardResolver,
  groupleader: groupleaderResolver,
  listgroup: listemberResolver
}

module.exports = user
