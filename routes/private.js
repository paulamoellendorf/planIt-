const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');

const loginCheck = () => {
  return (req, res, next) => {
    // passport method req.isAuthenticated()
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  };
}

router.get('/private', loginCheck(), (req, res, next) => {
  const familyID=req && req.user && req.user._id;
  console.log(familyID)
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
   let loggedIn = req.user ? true : false;
    res.render('private', {family: family, chartInfo: membersGoals, loggedIn });
  })
});


router.get('/private/:id', loginCheck(), (req, res, next) => {
  const memberID=req.params.id;
  let loggedIn = req.user ? true : false;
  User.findById(memberID).populate("member").then(member => {
    res.render('member', {member: member, loggedIn});
  })
});



module.exports = router;