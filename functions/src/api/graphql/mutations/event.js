const eventTC = require('../type-composers/event')

const events = require('../../db/models/event')
const users = require('../../db/models/users')

const {
  schemaComposer, Resolver, graphql: {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt,
  },
} = require('graphql-compose')

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


const event = {
  createEvent: eventTC.getResolver('createOne'),
  updateEvent: eventTC.getResolver('updateById'),
  removeEvent: eventTC.getResolver('removeById'),
  registerEvent,
}

module.exports = event
