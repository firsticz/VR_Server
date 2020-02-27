module.exports = {
  cors: {
    origin: [/localhost/],
    credentials: true,
  },
  session: {
    secret: 'defaultsecret',
    cookie: {},
    proxy: true,
  },
  graphiql: {
    enabled: true,
  },
  jwt: {
    secret: 'defaultsecret',
  },
}
