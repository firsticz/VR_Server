require('dotenv').config()
const cachegoose = require('cachegoose')
const config = require('config')
const mongoose = require('mongoose')
const CachemanMongo = require('cacheman-mongo')

const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

const cacheEngine = new CachemanMongo(config.get('database.uri'), mongoOptions)

cachegoose(mongoose, { engine: cacheEngine })
// console.dir({ cacheEngine }, { depth: null })
module.exports = () => mongoose.connect(config.get('database.uri'), mongoOptions, (err, db) => {
  // console.log({ db })
  if (err) console.error(err)
  // const cacheEngine = new CachemanMongo(db)
  // // cachegoose(mongoose)
  // cachegoose(mongoose, { engine: cacheEngine })
})
