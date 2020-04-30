const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');

router.get('/private', (req, res, next) => {
  const familyID=req.user._id;
  Family.findById(familyID).populate("members").then(family => {
    let membersGoals=[];
    let countGoals = 0;
    family.members.forEach((member)=>{
      countGoals += member.goals.length;
      membersGoals.push({
        name: member.name,
        goals:member.goals.length
      });
    })
    membersGoals.forEach(member => member.percent = Math.floor((member.goals / countGoals) * 100))
   // console.log(membersGoals, "MEMBERSGOALS");
  //  console.log(countGoals, "COUNTGOALS");
   // console.log(family.members);
    res.render('private', {family: family, chartInfo: membersGoals});
  })
});


router.get('/private/:id', (req, res, next) => {
  const memberID=req.params.id;
  User.findById(memberID).populate("member").then(member => {
    res.render('member', {member: member});
  })
});



module.exports = router;