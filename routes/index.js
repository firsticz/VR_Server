var express = require("express");
var router = express.Router();
var passport = require("passport");
var config = require('../config')
const MongoClient = require('mongodb').MongoClient;
var sess = ""
const DATABASE_NAME = "strava";
var database, collection;
/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", { title: "Express" });
});

/* GET Google Authentication API. */
// router.get(
// 	"/auth/strava",
// 	passport.authenticate("google", { scope: ["profile", "email"] })
// );

router.get('/auth/strava', passport.authenticate('strava', { scope: ['read_all,profile:read_all,activity:read_all'] }), () => { });

router.get(
	"/auth/strava/callback",
	passport.authenticate("strava", { failureRedirect: "http://localhost:3000", session: false }),
	function(req, res) {
    var token = req.user.accessToken;
    var refreshToken = req.user.refreshToken;
		MongoClient.connect(config.mongoDBUrl, (err, client) => {
      if (err) {
        console.log(err);
      }
      database = client.db(DATABASE_NAME);
      database.collection('users').findOne({ id: req.user.id }, (error, result) => {
        let logins = 0;
        if (result === null) {
          const newUserObj = req.user._json; // eslint-disable-line
          newUserObj.ridesFilter = false;
          newUserObj.logins = 0;
          newUserObj.api = {};
          newUserObj.refreshToken = refreshToken;
          
          database.collection('users').insertOne(newUserObj, () => {
          });
        } else if (result.logins !== undefined) {
          logins = result.logins;
        }
        const newVal = { $set: { logins: logins + 1, refreshToken: refreshToken } };
        database.collection('users').updateOne({ id: req.user.id }, newVal, () => {
          database.close();
        });
      });
		});
		req.session.save(() => {
      sess = req.session;
      sess.token = token;
      sess.userid = req.user.id;
      res.redirect("http://localhost:3000/callback?token=" + token +"&userid="+req.user.id);
    })
		
	}
);

router.get("/callback", function(req, res, next) {
  const {token, userid} = req.query
  const obj = {token,userid}
  console.log(req.isAuthenticated())
  if (!req.isAuthenticated()) {
    res.send(obj)
  } else{
    res.send("error")
  }
});

module.exports = router;
