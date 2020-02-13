var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var session = require('express-session')
var cors = require('cors')
const MongoClient = require('mongodb').MongoClient;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var activityRouter = require("./routes/activity");
var rankRouter = require("./routes/rank");
var segmentRouter = require("./routes/segment")
var groupRouter = require("./routes/group")

var app = express();
app.set('trust proxy', 1)
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// const DATABASE_NAME = "strava";
// const CONNECTION_URL = "mongodb+srv://firstloving:0831736368@strava-cx7jn.gcp.mongodb.net/test?retryWrites=true&w=majority";
// MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
// 	if(error) {
// 			throw error;
// 	}
// 	database = client.db(DATABASE_NAME);
// 	collection = database.collection("people");
// 	console.log("Connected to `" + DATABASE_NAME + "`!");
// });

app.use(session({
	key: 'user_sid',
  secret: 'keyboard cat',
	resave: false,
	cookie: { maxAge: 8*60*60*1000 },
  saveUninitialized: true,
  // cookie: {
	// 	expires: 600000
	// }
}))

app.use(passport.initialize());
require("./config/passport");
app.use(passport.session());

app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/activity", activityRouter);
app.use("/rank", rankRouter);
app.use("/segment", segmentRouter);
app.use("/group", groupRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
