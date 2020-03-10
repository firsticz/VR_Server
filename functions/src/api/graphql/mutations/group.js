const groupTC = require('../type-composers/group')

const groups = require('../../db/models/group')

// const {
//   schemaComposer, Resolver, graphql: {
//     GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt,
//   },
// } = require('graphql-compose')


const group = {
  createGroup: groupTC.getResolver('createOne'),
  updateGroup: groupTC.getResolver('updateById'),
  removeGroup: groupTC.getResolver('removeById'),
}

module.exports = group
