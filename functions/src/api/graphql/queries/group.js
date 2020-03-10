const groupsTC = require('../type-composers/group')
const groups = require('../../db/models/group')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLString, GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt,
  },
} = require('graphql-compose')


const group = {
  groupById: groupsTC.getResolver('findById'),
  groupByIds: groupsTC.getResolver('findByIds'),
  groupOne: groupsTC.getResolver('findOne'),
  groupMany: groupsTC.getResolver('findMany'),
  groupCount: groupsTC.getResolver('count'),
  groupConnection: groupsTC.getResolver('connection'),
  groupPagination: groupsTC.getResolver('pagination'),
}
module.exports = group
