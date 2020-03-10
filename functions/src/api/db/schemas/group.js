const mongoose = require('mongoose')

const { Schema } = mongoose

const eventSchema = new Schema({
  id: Number,
  groupId: Number,
  Name: String,
})


module.exports = eventSchema
