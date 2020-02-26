import passwordHash from 'password-hash'

const userTC = require('../type-composers/users')

const users = require('../../db/models/users')

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
  },
  resolve: async ({ args }) => {
    const { id, password } = args
    const hashedPassword = passwordHash.generate(password)
    const user = await users.findOneAndUpdate({ id }, { password: hashedPassword })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  },
}, schemaComposer)

const user = {
  createUser: userTC.getResolver('createOne'),
  updateUser: userTC.getResolver('updateById'),
  removeUser: userTC.getResolver('removeById'),
  setPassword,
}

module.exports = user
