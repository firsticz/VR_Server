const path = require('path')

require('dotenv').config()
const indexRouter = require('./routes/index')

const usersRouter = require('./routes/users')

const graphql = require('./api/graphql')

const config = require('config')

const logger = require('morgan')

const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const passport = require('passport')
const createError = require('http-errors')
const graphqlHTTP = require('express-graphql')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
require('./passport')

app.use(passport.session())

app.use(cors())

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: graphql,
  rootValue: graphql,
}))





const listen = config.get('system.listen')

if (listen) {
  const port = process.env.PORT || 1337
  app.listen(port, () => {
    console.log(`webhook is listening ${port} 😂`)
  })
}

module.exports = {
  app,
}
