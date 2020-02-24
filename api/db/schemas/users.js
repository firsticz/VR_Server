const mongoose = require('mongoose')

const { Schema } = mongoose

const usersSchema = new Schema({
  id: String,
  username: String,
  firstname: String,
  lastname: String,
  city: String,
  state: String,
  country: String,
  sex: String,
  profile: String,
  refreshToken: String,
  group: Array,
})

module.exports = usersSchema
