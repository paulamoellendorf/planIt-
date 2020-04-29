const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');

router.get('/private', (req, res, next) => {
  const familyID=req.user._id;
  Family.findById(familyID).populate("members").then(family => {
    console.log(family.members);
    res.render('private', {family: family});
  })
});

// ../member/:id
// USER.findById(req.params.id).then(user..)
//href="/merber/{{this._id}}"
router.get('/private/:id', (req, res, next) => {
  const memberID=req.params.id;
  User.findById(memberID).populate("member").then(member => {
    res.render('member', {member: member});
  })
});
module.exports = router;