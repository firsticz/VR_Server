const groupSchema = require('./../schemas/group')

const mongoose = require('mongoose')

const groups = mongoose.model('groups', groupSchema)

module.exports = groups
