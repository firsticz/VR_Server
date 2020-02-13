var express = require('express');
var config = require('../config')
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;


const DATABASE_NAME = "strava";

router.get('/getgroup', (req, res)=>{
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection("group").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  });
})


router.get('/checkmember/:userid/:eventid', (req, res) => {
  const userid = ('' + req.params.userid)
  const eventid = ('' + req.params.eventid)
  console.log(userid)
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);

    dbo.collection("event").find({id:eventid, member: userid}).toArray(function(err, result) {
      if (err) throw err;
      if(result.length === 1){
        res.send(true)
      }
      else{
        res.send(false)
      }
      db.close();
    });

  });

})

router.get('/getmember', (req, res)=>{
  const userid =(''+req.query.userid) 
  const eventid =(''+req.query.eventid) 
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    // dbo.collection("event").find({ id :eventid, member:userid}).toArray(function(err, result) {
    //   if (err) throw err;
    //   res.send(result);
    //   if(result.length == 1){
    //     res.send(true);
    //   }else{
    //     res.send(false);
    //   }
      
    //   db.close();
    // });
    dbo.collection("event").aggregate([
      { $unwind: "$member" },
      {
        $lookup:
        {
          from: 'users',
          localField: 'member',
          foreignField : 'id',
          as: 'eventDetail'
        }
      },
      {
        $project:{_id : 0,id:1, member: 1}
      },
      {
        $group:
        {
          _id : "$id",
          member : {$push : "$member"}
        }
      }
    ]).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });

  });
})

router.get('/getgroupdetail', (req, res)=>{
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection("group").aggregate([
      { $unwind: "$event" },
      {
        $lookup:
        {
          from: 'event',
          localField: 'event',
          foreignField : 'id',
          as: 'eventDetail'
        }
      },
      { $unwind: "$eventDetail" },
      { 
        $group: {
          _id: "$_id",
          "id": {$first : "$id"} ,
          "name": {$first : "$name"},
          "discription":{$first : "$discription"},
          "event": { "$push": "$eventDetail" }
        }
      }
    ]).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  });
})

router.get('/eventactivity',(req, res)=>{
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo.collection("event").aggregate([
      { $unwind : "$member" },
      {
        $group:{
          _id: "$member",
          event : 
          {
            $push:
            {
              id: "$id",
              name : "$name",
              start_date : "$start_date",
              end_date : "$end_date"
            }
          }
        }
      },
      {
        $lookup:
        {
          from: 'activity',
          let :{ userid : "$_id", st_date : "$event.start_date" },
          pipeline : [
            {
              $group:{
                _id : "$athlete.id",
                activity : {
                  $push:
                  {
                    name : "$name", start_date :"$start_date", distance : "$distance"
                  }
                }
              }
            },
            { $unwind : "$activity" },
            {
              $match:
              {
                $expr :{
                  $and : 
                  [
                    { $eq : ["$$userid", { "$toString": "$_id" }] },
                    { $gte :[ "$activity.start_date", "2019-09-14T08:52:40.481Z" ]}
                  ]
                }
              }
            },
            {
              $project :{_id: 1, activity : 1, start_date : 1 }
            }
          ],
          as: 'eventactivityDetail'
        }
      }
    ]).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  });
})

router.put('/joingroup/:userid/:groupid',(req, res)=>{
  const userid = req.params.userid;
  const groupid = req.params.groupid;
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var myquery = { id: userid };
    var newvalues = { $push: {'groups':groupid} };
    dbo.collection("users").update({ id: Number(userid) }, { $push: {'group':groupid} }, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
  res.status(200).send(true);
})


router.put('/joinevent/:userid/:eventid',(req, res)=>{
  const userid = req.params.userid;
  const eventid = req.params.eventid
  console.log(userid)
  console.log(eventid)
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var myquery = { id: eventid };
    var newvalues = { $push: {member:userid} };
    dbo.collection("event").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
  res.status(200).send(true);
})

module.exports = router;