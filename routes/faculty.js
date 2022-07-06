
const express = require("express");
const app = express();
var router = express.Router({mergeParams:true});
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var Faculty = require('../modules/faculty.js');
var flash=require('connect-flash');
var middlewareObj = require("../middleware/index.js");


router.use(require('express-session')({
    secret: 'Heyy',
    resave: false,
    saveUninitialize: false
}));




router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(Faculty.authenticate()));
passport.serializeUser(Faculty.serializeUser());
passport.deserializeUser(Faculty.deserializeUser());





//FACULTY SIGNUP
router.get("/add", function(req, res) {
    // res.sendFile(__dirname + '/admin/html/index.html');
    res.render('form.ejs');
  });

router.post("/add", function(req, res) {
    console.log(req.body);
      var newUser = new Faculty({username: req.body.username , firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email});
  
      Faculty.register(newUser, req.body.password, function(err, user) {
          if(err) {
              // console.log(err);
              if(newUser.username.length == 0) {
                  req.flash("error", "Invalid Inputs");
              } else if(req.body.password.length == 0) {
                  req.flash("error", "Invalid password");
              } else {
                  req.flash("error", "A user with the given username is already registered");
              }
              res.redirect("/add");
          } else {
            passport.authenticate('local')(req, res, function() {
              req.flash("success", "Registered successfully!!");
              // res.render("dash_index.ejs",{id: user._id.toString()});
              res.redirect('/dash_index');
            });
          }
      });
  });
  

//FACULTY LOGIN
router.get("/faculty-login", function(req, res) {
    // res.sendFile(__dirname + '/views/login.html');
    res.render('faculty-login.ejs');
});

router.post("/faculty-login", passport.authenticate("local", {
        failureRedirect: "/faculty-login"
    }), function(req, res) {
      // console.log(req.body);
      Faculty.find({username: req.body.username}, function(err,student){
        if(err){
          req.flash("error","Incorrect Username or Password.");
          res.redirect("/faculty-login");
        } else {
          res.redirect('/');
        }
      })
});

//LOGOUT
router.get('/logout', middlewareObj.isLoggedIn, function(req, res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
  });
});

module.exports = router;