const mongoose = require('mongoose')
const requestify = require('requestify')

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

usersSchema.static('refreshToken', async function refreshToken(userid) {
  const record = await this.findOne({ id: userid })
  const acc = requestify.post('https://www.strava.com/api/v3/oauth/token', {
    client_id: '38068',
    client_secret: '4b9ec55c89bd45ce828ae201b614c466f20765b6',
    grant_type: 'refresh_token',
    refresh_token: record.refreshToken,
  }).then((response) => {
    const res = JSON.parse(response.body)
    const accesstoken = res.access_token
    return accesstoken
  })
  return acc
})

usersSchema.static('leaderboard', async function leaderboard() {
  const record = await this.aggregate([
    {
      $lookup: {
        from: 'activitys',
        localField: 'id',
        foreignField: 'athlete.id',
        as: 'activityDetail',
      },
    },
    {
      $project: {
        id: 1,
        activityDetail: 1,
        firstname: 1,
        lastname: 1,
        profile_medium: 1,
      },
    },
    {
      $unwind: {
        path: '$activityDetail',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$id',
        totaldistance: {
          $sum: '$activityDetail.distance',
        },
        firstname: {
          $first: '$firstname',
        },
        lastname: {
          $first: '$lastname',
        },
        profile: {
          $first: '$profile_medium',
        },
      },
    },
    {
      $sort: {
        totaldistance: -1,
      },
    },
  ])
  return record
})

module.exports = usersSchema