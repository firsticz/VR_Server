import requestify from 'requestify'

const mongoose = require('mongoose')

const { Schema } = mongoose
const users = require('../../db/models/users')

const activitySchema = new Schema({
  athlete: {
    id: Number,
    resource_state: Number,
  },
  name: String,
  distance: Number,
  id: Number,
  start_date: Date,
  start_latlng: [Number],
  end_latlng: [Number],
  location_country: String,
  map: {
    id: String,
    summary_polyline: String,
    resource_state: Number,
  },
  average_speed: Number,
  max_speed: Number,
  elev_high: Number,
  elev_low: Number,
  moving_time: Number,
})

activitySchema.static('useractivity', function useractivity(userid) {
  const records = this.aggregate([{
    $lookup: {
      from: 'users',
      localField: 'athlete.id',
      foreignField: 'id',
      as: 'userdetail',
    },
  },
  // {
  //   $unwind: {
  //     path: '$userdetail',
  //     preserveNullAndEmptyArrays: true, // optional
  //   },
  // },
  ])
  console.log(records)
  return records
})

activitySchema.static('updateactivity', async function updateactivity(userid, token) {
  const url = `https://www.strava.com/api/v3/athletes/${userid}/activities?access_token=${token}`
  const records = await requestify.get(url).then(async (response) => {
    const activities = JSON.parse(response.body)
    await activities.forEach(async (element) => {
      const result = await this.findOne({ id: element.id })
      if (result == null) {
        await this.create(element)
      }
    })
    return activities
  })
  return records
})

activitySchema.static('updateAllActivity', async function updateAllActivity() {
  const alluser = await  users.find({}, {_id: 0, id: 1 })
  try {
    await alluser.forEach(async element => {
      await users.refreshToken(element.id)
    })
    const allaccuser = await  users.find({}, {_id: 0, id: 1, accesstoken: 1})
    await allaccuser.forEach(async element => {
      await this.updateactivity(element.id, element.accesstoken)
    })
    console.log("update all activity success")
    return true
  } catch (error) {
    console.log("cannot update all activity")
  }
  
  
}) 

module.exports = activitySchema
