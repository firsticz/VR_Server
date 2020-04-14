import passwordHash from 'password-hash'

const userTC = require('../type-composers/users')

const users = require('../../db/models/users')
const activity = require('../../db/models/activity')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt,
  },
} = require('graphql-compose')

const setPassword = new Resolver({
  name: 'setPassword',
  type: userTC.getType(),
  args: {
    id: GraphQLInt,
    password: GraphQLString,
    username: GraphQLString,
    token: GraphQLString,
    groupid: GraphQLString
  },
  resolve: async ({ args }) => {
    const { id, password, username, token, groupid } = args
    const hashedPassword = passwordHash.generate(password)
    const user_name = await users.findOne({ $and:[ { id }, { username } ] })
    if(user_name){
      throw new Error('Username already')
    }
    const user = await users.findOneAndUpdate({ id }, { password: hashedPassword, username, $push:{ group: groupid } })
    const update = await activity.updateactivity(id, token)
    if(update){
      console.log('true')
    }
    if (!user) {
      throw new Error('User not found')
    }
    return user
  },
}, schemaComposer)

const refreshToken = new Resolver({
  name: 'refreshToken',
  type: new GraphQLObjectType({
    name: 'refreshTokenType',
    fields: {
      accesstoken: {
        type: GraphQLString,
      },
    },
  }),
  args: {
    id: 'Int',
  },
  resolve: async ({ args }) => {
    const { id } = args
    const accesstoken = await users.refreshToken(id)
    return { accesstoken }
  },
}, schemaComposer)

const user = {
  createUser: userTC.getResolver('createOne'),
  updateUser: userTC.getResolver('updateById'),
  removeUser: userTC.getResolver('removeById'),
  setPassword,
  refreshToken,
}

module.exports = user
