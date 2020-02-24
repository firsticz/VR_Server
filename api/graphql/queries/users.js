const usersTC = require('../type-composers/users')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt,
  },
} = require('graphql-compose')

const users = {
  userById: usersTC.getResolver('findById'),
  userByIds: usersTC.getResolver('findByIds'),
  userOne: usersTC.getResolver('findOne'),
  userMany: usersTC.getResolver('findMany'),
  userCount: usersTC.getResolver('count'),
  userConnection: usersTC.getResolver('connection'),
  userPagination: usersTC.getResolver('pagination'),
}

module.exports = users
