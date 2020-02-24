import { schemaComposer } from 'graphql-compose'

const qorey = require('./queries/index')

schemaComposer.Query.addFields(qorey)

// const mutaion = require('./mutations/index')

// schemaComposer.Mutation.addFields(mutaion)

const graphqlSchema = schemaComposer.buildSchema()
module.exports = graphqlSchema
