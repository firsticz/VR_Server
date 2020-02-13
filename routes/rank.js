var express = require('express');
var config = require('../config')
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = "strava";

router.get('/', (req, result)=>{
  if (req.session.token) {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      db.collection('users').aggregate([
        {
          $lookup:
          {
            from: 'activity',
            localField: 'id',
            foreignField : 'athlete.id',
            as: 'activityDetail'
          }
        }
      ]).toArray(function(err, res) {
        if (err) throw err;
        // console.log(JSON.stringify(res));
        result.send(JSON.stringify(res));
        db.close();
      });
    });
    // res.send(activityDetailObj)
    
  }

})


router.get('/getrank', (req, result)=>{
  // if (req.session.token) {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      var dbo = db.db(DATABASE_NAME);
      dbo.collection('users').aggregate([
        {
          $lookup:
          {
            from: 'activity',
            localField: 'id',
            foreignField : 'athlete.id',
            as: 'activityDetail'
          }
        },
        {
          $project:
          {
            'id' : 1,
            'activityDetail' : 1,
            'firstname': 1,
            'lastname': 1,
            'profile_medium': 1
          }
        },
        {
          $unwind : { path: "$activityDetail", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$id",
            totaldistance: { $sum : "$activityDetail.distance"},
            firstname: {$first: "$firstname"},
            lastname: {$first: "$lastname"},
            profile_medium: {$first: "$profile_medium"}
          }
        },
        {
          $sort: { "totaldistance": -1 }
        }
        
      ]).toArray(function(err, res) {
        if (err) throw err;
        // console.log(JSON.stringify(res));
        result.send(JSON.stringify(res));
        dbo.close();
      });
    });
    // res.send(activityDetailObj)
    
  // }

})

module.exports = router;