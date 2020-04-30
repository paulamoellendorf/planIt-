//Chantel's branch
const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  let loggedIn = req.user ? true : false;
  console.log("waddup!")
 res.render('index', { loggedIn });
});


module.exports = router;



