const mongoose = require('mongoose')
const requestify = require('requestify')

const { Schema } = mongoose
const events = require('../../db/models/event')

const DKey = 'role'
const enumUserType = {
  ADMIN: 'Admin',
  RUNNER: 'Runner',
}

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
  accesstoken:String,
  group: [String],
  password: { type: String },
  role: {
    type: String,
    require: true,
    enum: Object.keys(enumUserType),
  },
})



usersSchema.set('discriminatorKey', DKey)

usersSchema.static('refreshToken', async function refreshToken(userid) {
  const record = await this.findOne({ id: userid })
  const acc = requestify.post('https://www.strava.com/api/v3/oauth/token', {
    client_id: '38068',
    client_secret: '4b9ec55c89bd45ce828ae201b614c466f20765b6',
    grant_type: 'refresh_token',
    refresh_token: record.refreshToken,
  }).then(async(response) => {
    const res = JSON.parse(response.body)
    const accesstoken = res.access_token
    await this.findOneAndUpdate({ id: userid }, { accesstoken: accesstoken })
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
        sex: 1
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
        totaltime: {
          $sum: '$activityDetail.moving_time',
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
        sex: {
          $first: '$sex'
        }
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

usersSchema.static('joinGroupEvent', async function (groupid) {
  const user = this.find({
    group: { $all:[groupid]}
  })
  return user
//   const record = await this.aggregate([
//     {
//       $match
//     }
//   ])
})

usersSchema.static('groupleader', async function groupleader(eventId) {
  const recEvent = await events.find({eventId})
  const record = await this.aggregate([
    {
      $unwind: '$group'
    },
    {
      $group: {
        _id : '$group',
        user: {
          $push: {
            _id: '$_id',
            id: '$id',
            username: '$username',
            firstname: '$firstname',
            lastname: '$lastname'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'activitys',
        localField: 'user.id',
        foreignField: 'athlete.id',
        as: 'activities'
      }
    },
    {
      $lookup: {
        from: 'events',
        localField: 'user.id',
        foreignField: 'member',
        as: 'event'
      }
    },
    {
      $unwind: '$event'
    },
    {
      $match: {
        'event.eventId': eventId
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
    },
    {
      $group: {
        _id: '$_id',
        event: { $first: '$event' },
        user: { $first: '$user' },
        activities: { $push: '$activities' }
      }
    },
    {
      $lookup: {
      from: 'groups',
      localField: '_id',
      foreignField: 'groupId',
      as: 'groupDetail'
      }
    },
    {
      $unwind: '$groupDetail'
    },
    {
      $group: {
        _id: '$_id',
        event: { $first: '$event' },
        user: { $first: '$user' },
        activity: { $first: '$activities' },
        groupDetail: { $push: '$groupDetail' }
      }
    },
  ])

  // console.log(record)
  return record
})


usersSchema.static('list_member', async function list_member(){
  const record = await this.aggregate([
    {
      $unwind: '$group'
    },
    {
      $group : {
        _id: '$group',
        profile: {
          $push: {
            id: '$id',
            firstname: '$firstname',
            lastname: '$lastname'
          }
        }
        

      }
    }
  ])
  console.log(record)
  return record
})


module.exports = usersSchema
