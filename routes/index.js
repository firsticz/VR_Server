const express = require('express')

const router = express.Router()
const passport = require('passport')

const config = require('../config')

const { MongoClient } = require('mongodb')

let sess = ''
const DATABASE_NAME = 'strava'
let database; let
  collection
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

/* GET Google Authentication API. */
// router.get(
// 	"/auth/strava",
// 	passport.authenticate("google", { scope: ["profile", "email"] })
// );

router.get('/auth/strava', passport.authenticate('strava', { scope: ['read_all,profile:read_all,activity:read_all'] }), () => { })

router.get(
  '/auth/strava/callback',
  passport.authenticate('strava', { failureRedirect: 'http://localhost:3000', session: false }),
  (req, res) => {
    const token = req.user.accessToken
    const { refreshToken } = req.user
    MongoClient.connect(config.mongoDBUrl, (err, client) => {
      if (err) {
        console.log(err)
      }
      database = client.db(DATABASE_NAME)
      database.collection('users').findOne({ id: req.user.id }, (error, result) => {
        let logins = 0
        if (result === null) {
          const newUserObj = req.user._json; // eslint-disable-line
          newUserObj.ridesFilter = false
          newUserObj.logins = 0
          newUserObj.api = {}
          newUserObj.refreshToken = refreshToken

          database.collection('users').insertOne(newUserObj, () => {
          })
        } else if (result.logins !== undefined) {
          logins = result.logins
        }
        const newVal = { $set: { logins: logins + 1, refreshToken } }
        database.collection('users').updateOne({ id: req.user.id }, newVal, () => {
          database.close()
        })
      })
    })
    req.session.save(() => {
      sess = req.session
      sess.token = token
      sess.userid = req.user.id
      res.redirect(`http://localhost:3000/callback?token=${token}&userid=${req.user.id}`)
    })
  }
)

router.get('/callback', (req, res, next) => {
  const { token, userid } = req.query
  const obj = { token, userid }
  console.log(req.isAuthenticated())
  if (!req.isAuthenticated()) {
    res.send(obj)
  } else {
    res.send('error')
  }
})

module.exports = router
