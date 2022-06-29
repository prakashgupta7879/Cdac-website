//imports
const port = 3000;
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var Faculty = require('./modules/faculty.js');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(require('express-session')({
    secret: 'Heyy',
    resave: false,
    saveUninitialize: false
}));

app.use(function(req, res, next) {
    res.locals.newUser = req.user;
    next();
});

mongoose.connect("mongodb://localhost/cdac");
// mongoose.connect("mongodb+srv://cdac:cdac2022@cluster0.cvr5pyu.mongodb.net/?retryWrites=true&w=majority");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded('extended: true'));
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Faculty.authenticate()));
passport.serializeUser(Faculty.serializeUser());
passport.deserializeUser(Faculty.deserializeUser());









//Static  Files
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.get("/",(req, res) => {
    // res.sendFile(__dirname + '/views/index.html')
    res.render('index.ejs')
})

//ADMINLOGIN
app.get("/admin_cdac", function(req, res) {
    res.sendFile(__dirname + '/views/admin_cdac.html');
});

//SIGNUP
app.get("/signup", function(req, res) {
    // res.sendFile(__dirname + '/views/signup.html');
    res.render('signup.ejs');
});

app.post("/signup", function(req, res) {
    var newUser = new Faculty({ username: req.body.username, email: req.body.email});
    console.log(req.body);
    Faculty.register(newUser, req.body.password, function(err, user) {
        if(err) {
          console.log(err);
            res.redirect("/signup");
        }
        console.log("jj");
        passport.authenticate('local')(req, res, function() {
          console.log("user");
          // res.send();
          // res.sendFile(__dirname + '/views/index.html');
            res.redirect('/');
        });
    });
});

//LOGIN
app.get("/login", function(req, res) {
    // res.sendFile(__dirname + '/views/login.html');
    res.render('login.ejs');
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res) {
      console.log(res);
});

//LOGOUT
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
  });
});


//listen on port 3000
app.listen(3000);
