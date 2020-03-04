const userSchema = require('./../schemas/users')

const mongoose = require('mongoose')

const users = mongoose.model('users', userSchema)

module.exports = users
