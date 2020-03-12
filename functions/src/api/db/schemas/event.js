const mongoose = require('mongoose')

const { Schema } = mongoose

const eventSchema = new Schema({
  id: Number,
  eventId: Number,
  NameTH: String,
  NameEN: String,
  city: String,
  country: String,
  start_date: Date,
  end_date: Date,
  member: [Number]
})

eventSchema.static('activityhasevent', async function activityhasevent(){
  const recEvent = await this.find({eventId: 100})
  const records = await this.aggregate([
    {
      $match: {
        eventId: 100
      }
    },
    {
      $unwind: '$member'
    },
    {
      $group: {
        _id: '$member',
        event: {
          $push: {
            eventId: '$eventId',
            nameTH: '$nameTH',
            start_date : '$start_date',
            end_date : '$end_date'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'activitys',
        localField: '_id',
        foreignField: 'athlete.id',
        as: 'activities'
      }
    },
    {
      $unwind: '$activities'
    },
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [{$toDate:'$activities.start_date'},
              {$toDate: recEvent[0].start_date}]
            },{
              $lte: [{$toDate:'$activities.start_date'},
              {$toDate: recEvent[0].end_date}]
            }
          ]
        }
      }
    },{
      $group: {
        _id: '$_id',
        event: {$first: '$event'},
        activities: {$push: '$activities'}
      }
    }
  ])
  // console.log(recEvent)
  // console.log('start')
  // console.log(records)
  return records
})


module.exports = eventSchema
