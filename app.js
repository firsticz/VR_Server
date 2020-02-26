const path = require('path')

const config = require('./config')

const indexRouter = require('./routes/index')

const usersRouter = require('./routes/users')

const activityRouter = require('./routes/activity')

const rankRouter = require('./routes/rank')

const segmentRouter = require('./routes/segment')

const groupRouter = require('./routes/group')

const graphql = require('./api/graphql')

const createError = require('http-errors')
const express = require('express')

const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const graphqlHTTP = require('express-graphql')
const mongo = require('mongoose')

const options = {
  port: process.env.PORT || '4000',
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}

const app = express()
app.set('trust proxy', 1)
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

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
  cookie: { maxAge: 8 * 60 * 60 * 1000 },
  saveUninitialized: true,
  // cookie: {
  // 	expires: 600000
  // }
}))

app.use(passport.initialize())
require('./config/passport')

app.use(passport.session())

app.use(cors())
mongo.connect(config.mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongo.connection.once('open', () => {
  console.log('connected to database')
})

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: graphql,
  rootValue: graphql,
}))
// app.listen(8080, () => {
//   console.log('Server running succefully...')
// })

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/activity', activityRouter)
app.use('/rank', rankRouter)
app.use('/segment', segmentRouter)
app.use('/group', groupRouter)
// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404))
// })

// // error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

const port = process.env.PORT || 4500
app.listen(port, () => {
  console.log(`webhook is listening ${port} 😂`)
})

module.exports = app
// module.exports.app = functions.https.onRequest(app)
