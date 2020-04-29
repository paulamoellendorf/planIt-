const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');


router.get('/private', (req, res, next) => {
  const user=req.user;
  console.log(req.user);
  res.render('private', {user:user});
});



module.exports = router;