var express = require('express');
var router = express.Router();

router.post('/test', function (req, res) {

  console.log('router works')
  res.sendStatus(200);
});

module.exports = router;