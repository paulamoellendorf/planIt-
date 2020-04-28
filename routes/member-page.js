const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');


router.get('/member-page', (req, res, next) => {


  res.render('member-page');
});

module.exports = router;