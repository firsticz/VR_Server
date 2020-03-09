const mongoose = require('mongoose')
const requestify = require('requestify')

const { Schema } = mongoose

const eventSchema = new Schema({
  id: Number,
  NameTH: String,
  NameEN: String,
  city: String,
  country: String,
  start_date: Date,
  end_date: Date
})


module.exports = eventSchema
