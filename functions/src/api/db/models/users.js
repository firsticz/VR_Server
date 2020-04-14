const userSchema = require('./../schemas/users')
const mongoose = require('mongoose')

const { Schema } = mongoose

const enumUserType = {
  ADMIN: 'Admin',
  RUNNER: 'Runner',
}



const AdminUserSchema = new Schema({ })
const RunnerUserSchema = new Schema({ })

const users = mongoose.model('users', userSchema)


export const AdminUserModel = users.discriminator(enumUserType.ADMIN, AdminUserSchema)
export const RunnerUserModel = users.discriminator(enumUserType.RUNNER, RunnerUserSchema)


module.exports = users
