const express = require('express');
const router  = express.Router();
const User = require('../models/User');


router.get('/private', (req, res, next) => {

  
  res.render('private');
});


module.exports = router;