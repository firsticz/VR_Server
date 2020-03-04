module.exports = {
  apps: [{
    name: 'strava',
    script: 'src/index.js',
    interpreter: './node_modules/.bin/babel-node',
    watch: true,
  }],
}
