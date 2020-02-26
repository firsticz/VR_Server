const mongoose = require('mongoose')

const { Schema } = mongoose

const activitySchema = new Schema({
  athlete: {
    id: Number,
    resource_state: Number,
  },
  name: String,
  distance: Number,
  id: Number,
  start_date: String,
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

module.exports = activitySchema
