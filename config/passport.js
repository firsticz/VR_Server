var passport = require("passport");
const StravaStrategy = require('passport-strava').Strategy;

let config = {};

try {
  config = require('../config.js'); // eslint-disable-line
} catch (e) { console.log('Configuration not found, resorting to ENV variables'); }

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: "GOOGLE_CLIENT_ID",
// 			clientSecret: "GOOGLE_CLIENT_SECRET",
// 			callbackURL: "http://localhost:4500/auth/google/callback"
// 		},
// 		function(accessToken, refreshToken, profile, done) {
// 			var userData = {
// 				email: profile.emails[0].value,
// 				name: profile.displayName,
// 				token: accessToken
// 			};
// 			done(null, userData);
// 		}
// 	)
// );

passport.use(new StravaStrategy({
  clientID: "38068",
  clientSecret: "4b9ec55c89bd45ce828ae201b614c466f20765b6",
  callbackURL: 'http://localhost:4500/auth/strava/callback',
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    const userProfile = profile;
    userProfile.accessToken = accessToken;
    userProfile.refreshToken = refreshToken;
    console.log(refreshToken);
    // elasticsearchdatahandler.userRefresh(accessToken, userProfile.id);
    done(null, profile);
  });
}));
