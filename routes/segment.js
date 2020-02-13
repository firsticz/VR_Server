var express = require('express');
var config = require('../config');
var requestify = require('requestify');
var router = express.Router();

router.get('/search', (req, res)=>{
  if (req.session.token) {
    requestify.get('https://www.strava.com/api/v3/segments/explore?bounds=9.288560,99.819822,14.1233,101.2898&zoom=10&terrain=all&activity_type=running&access_token='+req.session.token).then((response)=>{
      let segment = JSON.parse(response.body);
      res.send(segment);
    })
  }
  
})

module.exports = router;