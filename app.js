//imports
const port = 3000;
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var Student = require('./modules/student.js');
var flash=require('connect-flash');
var middlewareObj = require("./middleware/index.js");

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(require('express-session')({
    secret: 'Heyy',
    resave: false,
    saveUninitialize: false
}));

mongoose.connect("mongodb+srv://admin-cdac:Admin%40cdacsilchar@cdac.isrtcby.mongodb.net/cdac", {useNewUrlParser: true});




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded('extended: true'));
app.use(methodOverride('_method'));

app.use(express.static('public'));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

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
    // res.sendFile(__dirname + '/views/admin_cdac.html');
    res.render('admin_cdac.ejs');
});

//SIGNUP
app.get("/signup", function(req, res) {
    // res.sendFile(__dirname + '/views/signup.html');
    res.render('signup.ejs');
});

app.post("/signup", function(req, res) {
  console.log(req.body);
    var newUser = new Student({ username: req.body.username, email: req.body.email, firstname: req.body.firstname,
    lastname: req.body.lastname, MobileNo: req.body.MobileNo});

    Student.register(newUser, req.body.password, function(err, user) {
        if(err) {
            // console.log(err);
            if(newUser.username.length == 0) {
                req.flash("error", "Invalid username");
            } else if(req.body.password.length == 0) {
                req.flash("error", "Invalid password");
            } else {
                req.flash("error", "A user with the given username is already registered");
            }
            res.redirect("/signup");
        } else {
          passport.authenticate('local')(req, res, function() {
            req.flash("success", "Registered successfully!!");
            // res.render("dash_index.ejs",{id: user._id.toString()});
            res.redirect('/dash_index');
          });
        }
    });
});

//LOGIN
app.get("/login", function(req, res) {
    // res.sendFile(__dirname + '/views/login.html');
    res.render('login.ejs');
});

app.post("/login", passport.authenticate("local", {
        failureRedirect: "/login"
    }), function(req, res) {
      console.log(req.body);
      Student.find({username: req.body.username}, function(err,student){
        if(err){
          req.flash("error","Incorrect Username or Password.");
          res.redirect("/login");
        } else {
          // res.render("dash_index.ejs");
          res.redirect('/dash_index');
        }
      })
});

//LOGOUT
app.get('/logout', middlewareObj.isLoggedIn, function(req, res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
  });
});

//EDIT
app.get("/dash_index/edit", middlewareObj.isLoggedIn, function(req, res) {
    Student.findById(req.user._id, function(err, student) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/dash_index");
        } else {
            res.render("profile-edit", {student: student});
        }
    });
});

//UPDATE
app.put("/dash_index/edit", middlewareObj.isLoggedIn, function(req, res) {
  console.log(req.body);
    Student.findByIdAndUpdate(req.user._id, req.body, function(err, student) {
        if(err) {
          // console.log(err);
            req.flash("error","Something went wrong.");
            res.redirect("/dash_index");
        } else {
            console.log(student);
            res.redirect("/dash_index");
        }
    });
});

//ABOUT US
app.get('/about', function (req,res) {
  res.render('about.ejs');
})

//CONTACT US
app.get('/contact', function (req,res) {
  res.render('contact.ejs');
})

//COURSES
app.get('/courses', function (req,res) {
  res.render('courses.ejs');
})

//ABOUT COURSES
app.get('/about_course', middlewareObj.isLoggedIn, function (req,res) {
  res.render('about_course.ejs');
})

//COURSES ENROLLED
app.get('/enrolled_course', middlewareObj.isLoggedIn, function (req,res) {
  res.render('enrolled_course.ejs');
})

//STUDENT DASHBOARD
app.get('/dash_index', middlewareObj.isLoggedIn, function (req,res) {
  res.render('dash_index.ejs');
})

//listen on port 3000
app.listen(3000);
