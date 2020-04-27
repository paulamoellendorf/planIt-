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


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});
 
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
 
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
 
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
 
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
 
    const newUser = new User({
      username,
      password: hashPass
    });
 
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
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

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("/private", { user: req.user });
});

/*router.get("/signup", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("/auth/signup", { user: req.user });
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
 
  if (username === "" || password === "") {
    res.render("/auth/signup", { message: "Indicate username and password" });
    return;
  }
 
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
 
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
 
    const newUser = new User({
      username,
      password: hashPass
    });
 
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/private");
      }
    });
  })
  .catch(error => {
    next(error)
  })
}); */

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});
 
module.exports = router;