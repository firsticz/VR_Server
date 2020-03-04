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
// const cacheEngine = new CachemanMongo('mongodb://bot:wWZNiUeGJTuKW49V@production-shard-00-00-qdden.gcp.mongodb.net:27017,production-shard-00-01-qdden.gcp.mongodb.net:27017,production-shard-00-02-qdden.gcp.mongodb.net:27017/bot?replicaSet=rs0&authSource=admin&retryWrites=true')
// cachegoose(mongoose)
cachegoose(mongoose, { engine: cacheEngine })
// console.dir({ cacheEngine }, { depth: null })
module.exports = () => mongoose.connect(config.get('database.uri'), mongoOptions, (err, db) => {
  // console.log({ db })
  if (err) console.error(err)
  // const cacheEngine = new CachemanMongo(db)
  // // cachegoose(mongoose)
  // cachegoose(mongoose, { engine: cacheEngine })
})
