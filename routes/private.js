const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');


router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;