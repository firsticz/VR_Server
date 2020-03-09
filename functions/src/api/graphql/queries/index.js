const users = require('./users')
const activity = require('./activity')
const event = require('./event')

const queries = Object.assign({},
  users,
  activity,
  event,)

module.exports = queries
