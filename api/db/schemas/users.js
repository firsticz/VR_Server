const mongoose = require('mongoose')

const { Schema } = mongoose

const usersSchema = new Schema({
  id: Number,
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
  password: { type: String },
})

module.exports = usersSchema
