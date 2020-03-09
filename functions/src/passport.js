var passport = require("passport");
const StravaStrategy = require('passport-strava').Strategy;
require('dotenv').config()
const config = require('config')

// let config = {};

// try {
//   config = require('../config.js'); // eslint-disable-line
// } catch (e) { console.log('Configuration not found, resorting to ENV variables'); }

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new StravaStrategy({
  clientID: "38068",
  clientSecret: "4b9ec55c89bd45ce828ae201b614c466f20765b6",
  callbackURL: config.get('callback.url'),
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    const userProfile = profile;
    userProfile.accessToken = accessToken;
    userProfile.refreshToken = refreshToken;
    console.log(refreshToken);
    done(null, profile);
  });
}));
