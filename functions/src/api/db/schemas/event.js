const mongoose = require('mongoose')

const { Schema } = mongoose
const users = require('../../db/models/users')

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

eventSchema.static('activityhasevent', async function activityhasevent(eventId){
  const recEvent = await this.find({eventId})
  const records = await this.aggregate([
    {
      $match: {
        eventId:eventId
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
            _id: '$_id', 
            eventId: '$eventId',
            NameTH: '$NameTH',
            NameEN: '$NameEN',
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
    }, 
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'id',
        as: 'profile'
      }
    }
  ])
  return records
})

eventSchema.static('myteamlead', async function myteamlead(eventId, listgroup){
  console.log('listgroup: '+ listgroup)
  const recEvent = await this.find({eventId})
  const records = await this.aggregate([
    {
      $match: {
        eventId:eventId
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
            _id: '$_id', 
            eventId: '$eventId',
            NameTH: '$NameTH',
            NameEN: '$NameEN',
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
    }, 
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'id',
        as: 'profile'
      }
    },
    {
      $match: {
        'profile.group': { $in: listgroup }
      }
    }
  ])
  // console.log(recEvent)
  console.log('start')
  console.log(records)
  return records
})

module.exports = eventSchema
