const eventTC = require('../type-composers/event')

const events = require('../../db/models/event')
const users = require('../../db/models/users')


const {
  schemaComposer, Resolver, graphql: {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat, GraphQL
  }, GraphQLDate
} = require('graphql-compose')
// import {
//   GraphQLDate,
// } from 'graphql-iso-date';


const registerEvent = new Resolver({
  name: 'registerEvent',
  type: eventTC.getType(),
  args: {
    eventid: GraphQLInt,
    userid: GraphQLInt
  },
  resolve: async ({ args }) => {
    const { eventid, userid } = args
    const listGroup = await users.find({id: userid}, { "group" : 1.0 })
    console.log(listGroup)
    let testg = []
    let listid = []
    let event = []
    listGroup[0].group.forEach( async element => {
      testg = await users.joinGroupEvent(element)
      testg.forEach(ele=>{
        listid.push(ele.id)
      })
      event = await events.findOneAndUpdate({ eventId: eventid }, { $push:{ member: { $each: listid } } })
    })
    // const testg = await users.joinGroupEvent("001")
    console.log(listid)
    if (!event) {
      throw new Error('can not register')
    }
    return event
  },
}, schemaComposer)


const UpdateEventResolver = new Resolver({
  name: 'updateEvent',
  type: eventTC.getType(),
  args: {
    eventId: GraphQLFloat,
    NameTH: GraphQLString,
    NameEN: GraphQLString,
    start_date: GraphQLDate,
    end_date: GraphQLDate,
    banner: GraphQLString
  },
  resolve: async ({ args }) => {
    const { eventId, NameTH, NameEN, start_date, end_date, banner } = args
    const event = await events.findOneAndUpdate({eventId}, { NameTH, NameEN, start_date, end_date, banner })
    if (!event) {
      throw new Error('can not update')
    }
    return event
  },
}, schemaComposer)


const event = {
  createEvent: eventTC.getResolver('createOne'),
  updateEvent: eventTC.getResolver('updateById'),
  removeEvent: eventTC.getResolver('removeById'),
  registerEvent,
  updateEvent: UpdateEventResolver
}

module.exports = event
