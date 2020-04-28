const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');




router.get('/addgoal', (req,res,next) =>{
  res.render('goals/addgoal');
});


router.get('/goalsList', (req,res, next) =>{

  Goal.find({ family: req.user._id })
    .then(goals=> {
      res.render('goals/goalsList', { goalsList:goals });
    })
    .catch(err => {
      next(err);
    });
});



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




module.exports = router;
