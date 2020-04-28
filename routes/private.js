const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;