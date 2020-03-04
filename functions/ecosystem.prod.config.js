module.exports = {
  apps: [{
    name: 'strava',
    script: 'dist/index.js',
  }],

  // deploy: {
  //   production: {
  //     user: 'app',
  //     host: 'hooks.chat.thai.run',
  //     ref: 'origin/master',
  //     repo: 'git@bitbucket.org:Thairun/photo-messenger-bot.git',
  //     path: '/home/app/production',
  //     'post-deploy': 'npm install && npm run build && npm run start',
  //   },
  //   development: {
  //     user: 'dev',
  //     host: '',
  //     ref: 'origin/develop',
  //     repo: 'git@bitbucket.org:Thairun/photo-messenger-bot.git',
  //     path: '/home/dev/development',
  //     'post-deploy': 'npm install && npm run build && npm run start',
  //   },
  // },
}

