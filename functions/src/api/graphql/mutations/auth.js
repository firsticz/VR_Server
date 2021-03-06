import { jwtSign } from '../../utils'

import { UserInputError } from 'apollo-server-express'
import passwordHash from 'password-hash'

const userTC = require('../type-composers/users')

const users = require('../../db/models/users')
const activity = require('../../db/models/activity')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt,
  },
} = require('graphql-compose')

const loginResolver = new Resolver({
  name: 'login',
  type: new GraphQLObjectType({
    name: 'loginType',
    fields: {
      token: {
        type: GraphQLString,
      },
    },
  }),
  args: {
    username: 'String!',
    password: 'String!',
  },
  resolve: async ({ args }) => {
    const { username, password } = args
    const user = await users.findOne({ username })
    if (!user) {
      throw new UserInputError(`${username} ไม่ตรงกับผู้ใช้ใดๆ`)
    }
    const valid = passwordHash.verify(password, user.password)
    if (!valid) {
      throw new UserInputError('รหัสผ่านไม่ถูกต้อง')
    }
    const accesstoken = await users.refreshToken(user.id)
    const update = await activity.updateactivity(user.id, accesstoken)
    const token = jwtSign({
      _id: user._id, id: user.id, name: user.firstname, accesstoken, profile: user.profile, role: user.role
    })
    return { token }
  },
}, schemaComposer)

const authMutations = {
  login: loginResolver,
}

module.exports = authMutations
