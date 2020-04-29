const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');

router.get('/private', (req, res, next) => {
  const familyID=req.user._id;
  Family.findById(familyID).populate("members").then(family => {
    console.log(family.members);
    res.render('private');
  })
 
});
module.exports = router;