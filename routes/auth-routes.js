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

router.get("/addmember",  (req, res) => {
    res.render('auth/addmember');
});

router.post("/addmember", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const birthday = req.body.birthday;
  const phone_Number = req.body.phone_Number;
  const e_mail = req.body.e_mail;
  const familyID = req.user._id;

  if (username === "" || password === "") {
    res.render("auth/addmember", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("auth/addmember", {
          message: "The username already exists",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass,
        name,
        birthday,
        phone_Number,
        e_mail,
        family: familyID,
      })
        .then((newUser) => {
          console.log(newUser)
          Family.updateOne( {_id: familyID }, { $push: { members: newUser._id } })
          .then(family => {

          res.redirect("/private");
          }).catch(err => console.log(err))
        })
        .catch((err) => {
          res.render("auth/addmember", { message: "Something went wrong" });
          next(err);
        });
    })
    .catch((error) => {
      next(error);
    });

}); 

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
 
module.exports = router;