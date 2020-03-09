const users = require('./users')
const auth = require('./auth')
const events = require('./event')

const mutations = Object.assign({},
  users,
  events,
  auth)

module.exports = mutations
