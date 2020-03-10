const users = require('./users')
const auth = require('./auth')
const events = require('./event')
const groups = require('./group')

const mutations = Object.assign({},
  users,
  events,
  auth,
  groups)

module.exports = mutations
