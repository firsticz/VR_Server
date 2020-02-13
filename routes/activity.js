var express = require('express');
var config = require('../config')
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var requestify = require('requestify');

const DATABASE_NAME = "strava";
var database, collection;

// refresh token
router.get('/refresh',(req,res)=>{
  requestify.post('https://www.strava.com/api/v3/oauth/token',{
    client_id:'38068',
    client_secret:'4b9ec55c89bd45ce828ae201b614c466f20765b6',
    grant_type:'refresh_token',
    refresh_token:'b7d842436216213e3fc77b8bb11508b990906ee5'
  }).then((response)=>{
    let res = JSON.parse(response.body)
    console.log(res)
  })
})


//get and update activity
router.get('/get/activity', (req, res)=>{
  if (req.session.token) {
    requestify.get('https://www.strava.com/api/v3/athletes/'+req.session.userid+'/activities?access_token='+req.session.token).then((response) => {
    let activities = JSON.parse(response.body); 
    MongoClient.connect(config.mongoDBUrl, (err, client) => {
      activities.forEach(element => {
        // const did = element.id.toFixed(1)
        database = client.db(DATABASE_NAME);
        database.collection('activity').findOne({ id: element.id }, (error, result) => {
          // if (error) {
          //   console.log(error);
          // }
          if(result == null){
            const newActivityObj = element; // eslint-disable-line
            database.collection('activity').insertOne(newActivityObj, () => {
            });
          }
          // console.log(result.id)
          // console.log(element.id+"\n")
            

          // db.close();
          // const resObj = {};
          // resObj.name = `${result.firstname} ${result.lastname}`;
          // resObj.username = result.username;
          // resObj.sex = result.sex;
          // resObj.id = result.id;
          // resObj.weight = result.weight;
          // resObj.logins = result.logins;
  
          // res.send(resObj);
        });
      });
      
    });
    res.send(activities)
    })

    
  }

})



module.exports = router;