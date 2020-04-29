const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Family= require('../models/Family');
const User=require('../models/User');

router.get('/addgoal', (req,res) =>{
  res.render('goals/addgoal');
});


router.get('/goalsList', (req,res, next) =>{

  Goal.find({ family: req.user._id })
    .then(goals=> {
    
     Family.findById(req.user._id).populate("members").then(family => {
      console.log(family.members);
      res.render('goals/goalsList', { goalsList:goals, family:family })
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
  User.findByIdAndUpdate(req.body.member, {
    goals:req.body.goal,
  })
  .then(user =>{
    console.log(`Success ${user} got updated`);
    Goal.findByIdAndDelete(req.body.goal)
    .then(goal=>{
      console.log(`Success ${goal} got deleted`);
      res.redirect('/private')
    })
    
  }).catch(err =>{
    console.og(err);
    next(err);
  });
  
});




module.exports = router;

