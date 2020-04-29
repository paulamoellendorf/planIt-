// routes/auth-routes.js
const express = require("express");
const router = express.Router();
 
// User model
const User = require("../models/User.js");
const Family = require("../models/Family.js");
 
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
// Require session
const session = require("express-session");


router.get("/familysignup", (req, res, next) => {
  res.render("auth/familysignup");
});

 
router.post("/familysignup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const familyName = req.body.familyName;
 
  if (username === "" || password === "") {
    res.render("auth/familysignup", { message: "Indicate username and password" });
    return;
  }
 
  Family.findOne({ username })
  .then(family => {
    if (family !== null) {
      res.render("auth/familysignup", { message: "The username already exists" });
      return;
    }
 
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
 
    const newFamily = new Family({
      username,
      password: hashPass,
      familyName
    });
 
    newFamily.save((err) => {
      if (err) {
        res.render("auth/familysignup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});



router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});
 
router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/private', (req, res, next) => {
  const familyID=req.user._id;
  Family.findById(familyID).populate("members").then(family => {
    console.log(family.members);
    res.render('private');
  })
 
});

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

router.get('/addmember', (req, res) => {
  //create new celeb page
  res.render('auth/addmember');
});

router.post('/addmember', (req, res) => {
  //post form for new celeb
  const { name, birthday, phone_Number, e_mail} = req.body;
  User.create({
    name: name,
    birthday: birthday,
    phone_Number: phone_Number,
    e_mail: e_mail
  }).then(user => {
    //render view for new celeb
    console.log(`Success ${user} was added to the database`);
    res.redirect(`/private`);
  }).catch(err => {
    console.log(err);
    // logs the error to the console
    next(err);
  });
});

router.post('/:id/delete', (req, res) => {
  User.findByIdAndRemove({ _id: req.params.id })
    .then(() => {
      res.redirect('/private');
    })
    .catch(err => {
      next(err);
    });
});





router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
 
module.exports = router;