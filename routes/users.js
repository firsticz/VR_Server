var express = require('express');
var config = require('../config')
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = "strava";
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/get/user-data', (req, res) => {
  if (req.session.token) {
    res.send(req.session.token)

  } else {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      db.collection('users').findOne({ id: req.user.id }, (error, result) => {
        if (error) {
          console.log(error);
        }
        db.close();
        const resObj = {};
        resObj.name = `${result.firstname} ${result.lastname}`;
        resObj.username = result.username;
        resObj.sex = result.sex;
        resObj.id = result.id;
        resObj.weight = result.weight;
        resObj.logins = result.logins;

        res.send(resObj);
      });
    });
  }
});

router.get('/checkregis/:userid', function(req, res) {
  const userid = Number(req.params.userid)
  MongoClient.connect(config.mongoDBUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);

    dbo.collection("users").find({id:userid}).toArray(function(err, result) {
      if (err) throw err;
      if(result[0].password === null || result[0].password === undefined){
        res.send(false)
      }
      else{
        res.send(true)
      }
      db.close();
    });

  });

})

module.exports = router;
