//imports
const port = 3000;
const express = require("express");
const app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var Student = require('./modules/student.js');
var Faculty = require('./modules/faculty.js');
var Course = require('./modules/courses.js');
var flash=require('connect-flash');
var middlewareObj = require("./middleware/index.js");
const {v4 : uuidv4} = require('uuid');
var nodemailer = require('nodemailer');
var MongoStore = require("connect-mongodb-session")(session);
var auth = require('passport-local-authenticate');
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
const sharp = require('sharp');
const fs = require('fs');

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


// IMAGE FILE STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomBytes(12).toString("hex")}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

app.use("/images", express.static(path.join(__dirname, "images")));

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

//HOME PAGE
app.get("/",(req, res) => {
    // res.sendFile(__dirname + '/views/index.html')
    res.render('index.ejs')
})

//ADMIN

app.get("/adminDash", function(req, res) {
  // res.sendFile(__dirname + '/admin/html/index.html');
  res.render('adminDash.ejs');
});




app.get("/admin", function(req, res) {
  // res.sendFile(__dirname + '/admin/html/index.html');
  res.render('admin_cdac.ejs');
});

app.post("/admin", passport.authenticate("local", {
      failureRedirect: "/admin"
  }), function(req, res) {
    // console.log(req.body);
    Student.find({username: req.body.username, usertype: "admin"}, function(err,admin){
      if(err){
        req.flash("error","Incorrect Username or Password.");
        res.redirect("/admin");
      } else {
        // console.log(admin);
        res.redirect('/add');
      }
    })
});

app.get("/view", middlewareObj.isAdminLoggedIn, function(req, res) {
  // res.sendFile(__dirname + '/admin/html/index.html');
  Student.find({usertype: "faculty"}, function (err, faculty) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('table',{faculty: faculty});
    }
  })
});

app.get("/add", middlewareObj.isAdminLoggedIn, function(req, res) {
  // res.sendFile(__dirname + '/admin/html/index.html');
  res.render('form.ejs');
});

//FACULTY SIGNUP
app.post("/add", middlewareObj.isAdminLoggedIn, function(req, res) {
  console.log(req.body);
    var newUser = new Student({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, usertype: "faculty", password: req.body.password });

    Student.create(newUser, function (err, faculty) {
         if(err) {
             // console.log(err);
             req.flash("success", "Successfully added a Faculty.");
             res.redirect('/add');
         } else {
           req.flash("success", "Successfully added a Faculty.");
           res.redirect('/add');
         }
     });
});

//FACULTY LOGIN
app.get("/faculty-login", function(req, res) {
  // res.sendFile(__dirname + '/views/login.html');
  res.render('faculty-login.ejs');
});

app.post("/faculty-login", function(req, res) {
    console.log(req.body);
    Student.find({username: req.body.username, password: req.body.password, usertype: "faculty"}, function(err,student){
      if(err){
        req.flash("error","Incorrect Username or Password.");
        res.redirect("/faculty-login");
      } else {
        res.redirect('/');
      }
    })
});

//STUDENT SIGNUP
app.get("/signup", function(req, res) {
    // res.sendFile(__dirname + '/views/signup.html');
    res.render('signup.ejs');
});

app.post("/signup", function(req, res) {
  console.log(req.body);
    var newUser = new Student({ username: req.body.username, email: req.body.email, firstname: req.body.firstname,
    lastname: req.body.lastname, MobileNo: req.body.MobileNo, usertype: "student", password: req.body.password });

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
            console.log(req);
            console.log("/////////////");
            console.log(user);
            req.flash("success", "Registered successfully!!");
            // res.render("dash_index.ejs",{id: user._id.toString()});
            res.redirect('/dash_index');
          });
        }
    });
});

//STUDENT LOGIN
app.get("/login", function(req, res) {
    // res.sendFile(__dirname + '/views/login.html');
    res.render('login.ejs');
});

app.post("/login", passport.authenticate("local", {
        failureRedirect: "/login"
    }), function(req, res) {
      console.log(req.body);
      Student.find({username: req.body.username, usertype: "student" }, function(err,student){
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
app.get("/dash_index/edit", middlewareObj.isStudentLoggedIn, function(req, res) {
    Student.findById(req.user._id, function(err, student) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/dash_index");
        } else {
          console.log("/////");
          console.log(student.password);
          console.log("///");
            res.render("profile-edit", {student: student});
        }
    });
});

//UPDATE
app.put("/dash_index/edit", middlewareObj.isStudentLoggedIn, function(req, res) {
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

//INTERNSHIP
app.get('/internships', function (req,res) {
  res.render('internship.ejs');
})

app.get('/enroll', function (req,res) {
  res.render('enroll-now.ejs');
})

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
  Course.find({}, function (err, courses) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      console.log("/////");
      console.log(courses);
      res.render('courses.ejs', {courses: courses});
    }
  })
})

app.get('/faculty-dash', function (req, res) {
  res.render('trial');
})

//ABOUT COURSES
app.get('/about_course/:id', middlewareObj.isLoggedIn, function (req,res) {
  // console.log(req.params.id);
  Course.findById(req.params.id, function (err, course) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
        // console.log(req.user);
        res.render('about_course.ejs',{ course: course });
    }
  })
})

//FACULTY TABLE
app.get('/view', middlewareObj.isAdminLoggedIn, function (req,res) {
  // console.log(req.params.id);
  Student.find({usertype: "faculty"}, function (err, faculty) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      console.log(faculty);
      res.render('table.ejs',{ faculty: faculty});
    }
  })
})

//COURSES ENROLLED
app.get('/enrolled_course', middlewareObj.isStudentLoggedIn, function (req,res) {
  res.render('enrolled_course');
})

//STUDENT DASHBOARD
app.get('/dash_index', middlewareObj.isStudentLoggedIn, function (req,res) {
  res.render('dash_index.ejs');
})

//COURSE UPLOAD
app.get('/course-upload', middlewareObj.isFacultyLoggedIn, function (req,res) {
  res.render('course-upload');
})

app.post("/course-upload", middlewareObj.isFacultyLoggedIn, function (req, res) {
        var username = uuidv4();
        var name = req.body.name;
        var syllabus = req.body.syllabus;
        var description = req.body.description;
        var duration = req.body.duration;
        var instructor = {
          name: req.body.instructor_name,
          designation: req.body.instructor_designation,
          college : req.body.instructor_college
        };
        var newCourse = {username: username, name: name, syllabus: syllabus, description: description, instructor: instructor, duration: duration };
        console.log(newCourse);
        Course.create(newCourse, function(err, allCourse) {
            if(err) {
                console.log(err);
                req.flash("error", "Something went wrong");
                res.redirect('/course-upload');
            } else {
                console.log(allCourse);
                req.flash("success", "Course uploaded successfully.");
                res.redirect("/courses");
            }
        });
    //   }
    // });
});

//ENROLL COURSE
app.post('/:id/course/:courseid', function (req, res) {
  Student.findById(req.params.id, function(err, student) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/courses");
        } else {
            Course.findById(req.params.courseid, function (err, course) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    res.redirect('/courses');
                } else {
                    student.courses.push(course);
                    student.save();
                    res.redirect("/enrolled_course");
                }
            });
        }
    });
})

//SEND EMAIL
app.get('/send-email', function (req, res) {
  res.render('send-email');
})

app.post('/send-email', function (req, res) {
  Student.find({ email: req.body.email }, function (err, student) {
    if(err) {
      req.flash("error","Invalid email.");
      res.redirect('/send-email');
    } else {
      var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'c_dac@outlook.com',
          pass: 'Cdac@2022'
        }
      });

      var mailOptions = {
        from: 'c_dac@outlook.com',
        to: req.body.email,
        subject: 'Reset Password link',
        text: 'http://localhost:3000/reset-password'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.redirect('/login');
        } else {
          console.log('Email sent: ' + info.response);
          res.redirect('/send-email');
        }
      });
    }
  })
});

//RESET PASSWORD
app.get('/reset-password', function (req, res) {
  res.render('reset-password');
})

app.post('/reset-password', function (req, res) {
    Student.find({username: req.body.username}, function (err, stud) {
      if(err || req.body.password != req.body.password1) {
        req.flash("error","Please enter valid password.");
        res.redirect('/reset-password');
      } else {
        // console.log(student);
        var student = stud[0];
        var newUser = {
          username: student.username,
          firstname: student.firstname,
          lastname: student.lastname,
          dob: student.dob,
          qualification: student.qualification,
          Designation: student.Designation,
          Department: student.Department,
          AreaOfSpecialization: student.AreaOfSpecialization,
          Institute: student.Institute,
          address: student.address,
          state: student.state,
          district: student.district,
          pincode: student.pincode,
          email: student.email,
          MobileNo: student.MobileNo,
          usertype: student.usertype,
          courses: student.courses
        };
        Student.remove({ username: student.username }, function (err, student) {
          if(err) {
            console.log(err);
            req.flash("error","Something went wrong.");
            res.redirect('/reset-password');
          } else {
            console.log(student);
            Student.register(newUser, req.body.password, function(err, user) {
                if(err) {
                  // console.log("//////////**********");
                  // console.log(err);
                  req.flash("error","Something went wrong.");
                  res.redirect('/reset-password');
                } else {
                  passport.authenticate('local')(req, res, function() {
                    req.flash("success", "Password changed successfully!!");
                    res.redirect('/logout');
                  });
                }
            });
          }
        })
      }
    });
})

//CHANGE PASSWORD
app.get('/change-password', middlewareObj.isLoggedIn, function (req, res) {
  res.render('change-password');
})

app.post('/change-password', middlewareObj.isLoggedIn, function (req, res) {
  Student.find({username: req.body.username}, function (err, stud) {
    if(err) {
      req.flash("error","Please enter valid password.");
      res.redirect('/change-password');
    } else if(req.body.password != req.body.password1 || stud[0].password != req.body.oldPassword || req.body.captcha != req.body.inputCaptcha) {
      req.flash("error","Please enter valid password.");
      res.redirect('/change-password');
    } else {
      var student = stud[0];
      var newUser = {
        username: student.username,
        firstname: student.firstname,
        lastname: student.lastname,
        dob: student.dob,
        qualification: student.qualification,
        Designation: student.Designation,
        Department: student.Department,
        AreaOfSpecialization: student.AreaOfSpecialization,
        Institute: student.Institute,
        address: student.address,
        state: student.state,
        district: student.district,
        pincode: student.pincode,
        email: student.email,
        MobileNo: student.MobileNo,
        usertype: student.usertype,
        courses: student.courses,
        password: req.body.password
      };
      
      Student.remove({ username: student.username }, function (err, student) {
        if(err) {
          console.log(err);
          req.flash("error","Something went wrong.");
          res.redirect('/change-password');
        } else {
          console.log(student);
          Student.register(newUser, req.body.password, function(err, user) {
              if(err) {
                // console.log("//////////**********");
                // console.log(err);
                req.flash("error","Something went wrong.");
                res.redirect('/change-password');
              } else {
                passport.authenticate('local')(req, res, function() {
                  req.flash("success", "Password changed successfully!!");
                  res.redirect('/logout');
                });
              }
          });
        }
      })
    }
  });
})

//UPLOAD INSTITUTE ID
app.get('/upload-id', middlewareObj.isStudentLoggedIn, function (req, res) {
  res.render('upload');
})

app.post("/upload-id", upload.single('image'), middlewareObj.isStudentLoggedIn, function(req, res) {
  Student.findById(req.user._id, function (err, user) {
    let imageUrl;
    console.log(req.file);
    if(req.file) {
        imageUrl = `${req.file.filename}`;
    } else {
        imageUrl = '';
    }
    user.Institute.id_card = imageUrl;
    user.save();
    req.flash("success", "Institute ID uploaded successfully.");
    res.redirect("/upload-id");
  });
});

//UPLOAD ADDRESS PROOF
app.post("/upload-address", upload.single('image1'),  middlewareObj.isStudentLoggedIn, function(req, res) {
  Student.findById(req.user._id, function (err, user) {
    let imageUrl;
    console.log(req.file);
    if(req.file) {
        imageUrl = `${req.file.filename}`;
    } else {
        imageUrl = '';
    }
    user.Institute.address_proof = imageUrl;
    user.save();
    req.flash("success", "Address proof uploaded successfully.");
    res.redirect("/upload-id");
  });
});

//UPLOAD PROFILE
app.post("/upload-profile", upload.single('image'),  middlewareObj.isStudentLoggedIn, function(req, res) {
  Student.findById(req.user._id, function (err, user) {
    let imageUrl;
    console.log(req.file);
    if(req.file) {
        imageUrl = `${req.file.filename}`;
    } else {
        imageUrl = '';
    }
    user.profileImage = imageUrl;
    user.save();
    // console.log(user);
    req.flash("success", "Profile photo uploaded successfully.");
    res.redirect("/dash_index");
  });
});

//listen on port 3000
app.listen(3000);
