const users = require('./users')
const auth = require('./auth')

const mutations = Object.assign({},
  users,
  auth)

module.exports = mutations
