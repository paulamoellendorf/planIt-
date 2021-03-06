const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Family= require('../models/Family');
const User=require('../models/User');

router.get('/addgoal', (req,res) =>{
  let loggedIn = req.user ? true : false;
  res.render('goals/addgoal', { loggedIn });
});


router.get('/goalsList', (req,res, next) =>{

  let loggedIn = req.user ? true : false;
  Goal.find({ family: req.user._id })
    .then(goals=> {
    
     Family.findById(req.user._id).populate("members").then(family => {
     // console.log(family.members);
      res.render('goals/goalsList', { goalsList:goals, family:family, loggedIn })
    })
    
    .catch(err => {
      next(err);
    });
})
})



router.post('/addgoal', (req,res,next) =>{


  Goal.create({
   goal:req.body.goal,
   description:req.body.description,
   limit:req.body.limit,
   family:req.user._id
  })
  .then(goal =>{
    res.redirect('/private');
  })

  .catch(err =>{
    next(err);
  });
});

router.post('/addGoalToMember', (req,res,next) =>{
  //res.send(req.body);
  Goal.findById(req.body.goal)
  .then(goal=>{
    //console.log(`Success ${goal} got deleted`);
  User.findByIdAndUpdate(req.body.member, {
    $push:{goals:goal.goal},
  })
  .then(user =>{
    Goal.findByIdAndDelete(req.body.goal).then(()=>{
      console.log(`Success ${user} got updated`);
      res.redirect('/private')
      
    })
  
    })
  }).catch(err =>{
    console.log(err);
    next(err);
  });
  
});




module.exports = router;

