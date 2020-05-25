const mongoose = require('mongoose')

const { Schema } = mongoose

const eventSchema = new Schema({
  groupId: String,
  name: String,
  banner: String
})


module.exports = eventSchema
