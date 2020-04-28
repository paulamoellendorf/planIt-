const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Family = require('../models/Family');


router.get('/:id', (req, res, next) => {
  //get individual celeb
    User.findById(req.params.id).then(user => {
      //render each celeb view with the data
        res.render('members', {user: user});
    }).catch((error) => {
    console.log(error);
    next();
});
});
module.exports = router;