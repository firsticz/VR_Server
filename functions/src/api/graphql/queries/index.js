const users = require('./users')
const activity = require('./activity')
const event = require('./event')
const group = require('./group')

const queries = Object.assign({},
  users,
  activity,
  event,
  group,)

module.exports = queries
