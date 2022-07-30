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
var Application = require('./modules/applications.js');
var Course = require('./modules/courses.js');
var Query = require('./modules/queries.js');
var Update = require('./modules/latestUpdates.js');
var Program = require('./modules/program.js');
var Event = require('./modules/event.js');
var Job = require('./modules/jobs.js');
var Internship = require('./modules/internship.js');
var Guestfaculty = require('./modules/guestfaculty.js');
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
const request = require('request');
const { insertMany } = require("./modules/student.js");
const fetch = require("isomorphic-fetch");
// var todos = ["Add second page", "Add fourth page", "Add third page"];

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));

app.use(require('express-session')({
    secret: 'Heyy',
    resave: true,
saveUninitialized: true
}));

mongoose.connect("mongodb+srv://admin-cdac:Admin%40cdacsilchar@cdac.isrtcby.mongodb.net/cdac", {useNewUrlParser: true});



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

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


// PDF FILE STORAGE
const storagef = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./pdfs");
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomBytes(12).toString("hex")}-${file.originalname}`);
  },
});

const fileFilterf = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var pdfUpload = multer({
  storage: storagef,
  fileFilter: fileFilterf
});

app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));


// RESUME FILE STORAGE
const storager = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./resume");
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomBytes(12).toString("hex")}-${file.originalname}`);
  },
});

const fileFilterr = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var resumeUpload = multer({
  storage: storager,
  fileFilter: fileFilterr
});

app.use("/resume", express.static(path.join(__dirname, "resume")));


// SYLLABUS FILE STORAGE
const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./syllabus");
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomBytes(12).toString("hex")}-${file.originalname}`);
  },
});

const fileFilters = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var syllabusUpload = multer({
  storage: storages,
  fileFilter: fileFilters
});

app.use("/syllabus", express.static(path.join(__dirname, "syllabus")));


// EVENT FILE STORAGE
const storagee = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./event");
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomBytes(12).toString("hex")}-${file.originalname}`);
  },
});

const fileFiltere = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var eventUpload = multer({
  storage: storagee,
  fileFilter: fileFiltere
});

app.use("/event", express.static(path.join(__dirname, "event")));

// GUEST FACULTY FILE STORAGE
const storageg = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./guest_resume");
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomBytes(12).toString("hex")}-${file.originalname}`);
  },
});

const fileFilterg = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var guestUpload = multer({
  storage: storageg,
  fileFilter: fileFilterg
});

app.use("/guest_resume", express.static(path.join(__dirname, "guest_resume")));


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
    Update.find({}, function (err, update) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      } else {
        Program.find({}, function (err, program) {
          if(err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/");
          } else {
            Job.find({}, function (err, job) {
              if(err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/");
              } else {
                console.log(job);
                res.render('index', { update: update, program: program, job: job });
              }
            })
          }
        })
      }
    })
})

//ADMINISTRATION
app.get("/directorgeneral", function(req, res) {
  res.render('directorGeneral');
});

app.get("/centerhead", function(req, res) {
  res.render('centerHead');
});



app.get("/career",  function(req, res) {
  Job.find({}, function (err, job) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('career',{ job: job });
    }
  })
});


const itemsSchema = {
  name: String
};

const Item = mongoose.model("Todo", itemsSchema);

const item1 = new Item({
  name: "Welcome"
});

const item2 = new Item({
  name: "Namaste"
});

const item3 = new Item({
  name: "Kaustubh"
});

const defaultItems = [item1, item2, item3];


//ADMIN
app.post("/adminDash", function(req, res){
  const itemName = req.body.newToDo;

  const item = new Item ({
    name: itemName
  });

  item.save();

  res.redirect("/adminDash");

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Deleted ToDo Item");
      res.redirect("/adminDash");
    }
  });
});

app.get("/changeadminpassword", middlewareObj.isAdminLoggedIn,  function(req, res) {
  res.render('adminChangePassword');
});

app.post('/change-password-admin', middlewareObj.isAdminLoggedIn, function (req, res) {
  Student.find({username: req.body.username, usertype: "admin" }, function (err, stud) {
    console.log(stud);
    console.log(req.body);
    if(err) {
      req.flash("error","Please enter valid password.");
      res.redirect('/change-password');
    } else if(req.body.password != req.body.password1 || stud[0].password != req.body.oldPassword) {
      req.flash("error","Please enter valid password.");
      res.redirect('/changeadminpassword');
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
        profileImage: student.profileImage,
        certificates: student.certificates,
        password: req.body.password
      };

      Student.remove({ username: student.username }, function (err, student) {
        if(err) {
          console.log(err);
          req.flash("error","Something went wrong.");
          res.redirect('/changeadminpassword');
        } else {
          console.log(student);
          Student.register(newUser, req.body.password, function(err, user) {
              if(err) {
                // console.log("//////////**********");
                // console.log(err);
                req.flash("error","Something went wrong.");
                res.redirect('/changeadminpassword');
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
app.get("/addJob", middlewareObj.isAdminLoggedIn,  function(req, res) {
  res.render('addJob');
});

app.post("/addJob", middlewareObj.isAdminLoggedIn,  function(req, res) {
    Job.create(req.body, function (err, job) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/addJob");
      } else {
        req.flash("success", "Added a program successfully.");
        res.redirect("/addJob");
      }
    });
});


app.get("/addEvent", middlewareObj.isAdminLoggedIn,  function(req, res) {
  res.render('addEvent');
});

app.post("/addEvent", eventUpload.single('link'), middlewareObj.isAdminLoggedIn,  function(req, res) {
  if(!req.file) {
    req.flash("error", "Something went wrong.");
    res.redirect("/addEvent");
  } else {
    var add = {
      username: req.body.username,
      detaillink: req.body.detaillink ,
      link: req.file.filename
    }
    console.log(add);
    Event.create(add, function (err, event) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/addEvent");
      } else {
        req.flash("success", "Added a program successfully.");
        res.redirect("/addEvent");
      }
    });
  }
});

app.get("/guestfacultyreg", function(req, res) {
  res.render('guestfacultyreg');
});

app.post("/guestfacultyreg", guestUpload.single('resume'),  function(req, res) {
  var guest = {
    username: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    qualification: req.body.qualification,
    department: req.body.department[0],
    institute: req.body.institute,
    university: req.body.university,
    courses: req.body.courses,
    experience: req.body.experience,
    coursestaught: req.body.coursestaught,
    resume: req.file.filename,
  }
  console.log(guest);
  Guestfaculty.create(guest, function (err, guest) {
    if(err) {
      console.log(err);
      req.flash("error", "Something went wrong.");
      res.redirect("/guestfacultyreg");
    } else {
      req.flash("success", "Registered Succesfully.");
      res.redirect("/guestfacultyreg");
    }
  });
});

app.get("/addachievement", middlewareObj.isAdminLoggedIn,  function(req, res) {
  res.render('addAchievement');
});

app.get("/addprogram", middlewareObj.isAdminLoggedIn,  function(req, res) {
  res.render('addProgram');
});

app.post("/addprogram", middlewareObj.isAdminLoggedIn,  function(req, res) {
    Program.create(req.body, function (err, program) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/addprogram");
      } else {
        req.flash("success", "Added a program successfully.");
        res.redirect("/addprogram");
      }
    });
});

app.get("/latestUpdates", middlewareObj.isAdminLoggedIn,  function(req, res) {
  res.render('latestUpdate');
});

app.post("/latestUpdates", pdfUpload.single('image'), middlewareObj.isAdminLoggedIn,  function(req, res) {
  console.log(req.file);
  console.log(req.body);
  if(!req.file) {
    req.flash("error", "Something went wrong.");
    res.redirect("/latestUpdates");
  } else {
    var update = {
      username: uuidv4(),
      name: req.body.name,
      link: `${req.file.filename}`
    }
    Update.create(update, function (err, user) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/latestUpdates");
      } else {
        req.flash("success", "Latest Update uploaded successfully.");
        res.redirect("/latestUpdates");
      }
    });
  }
});

app.get('/event', function (req, res) {
  Event.find({}, function (err, event) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/event");
    } else {
      console.log(event);
      res.render('annualevents', { event: event });
    }
  })
})


app.get("/addInternship", middlewareObj.isAdminLoggedIn,  function(req, res){
  res.render('addInternship');
})

app.get("/adminDash", middlewareObj.isAdminLoggedIn,  function(req, res) {
  Student.count({ usertype: "student" }, function (err, student) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/adminDash");
    } else {
      Student.count({ usertype: "faculty" }, function (err, faculty) {
        if(err) {
          req.flash("error","Something went wrong.");
          res.redirect("/adminDash");
        } else {
          Course.count(function (err, course) {
            if(err) {
              req.flash("error","Something went wrong.");
              res.redirect("/adminDash");
            } else {
              Query.count(function (err, query) {
                if(err) {
                  req.flash("error","Something went wrong.");
                  res.redirect("/adminDash");
                } else {
                  Application.count(function (err, application) {
                    if(err) {
                      req.flash("error","Something went wrong.");
                      res.redirect("/adminDash");
                    } else {

                      Item.find({}, function(err, foundItems){

                        if(foundItems.length === 0){
                          Item.insertMany(defaultItems, function(err){
                            if(err){
                              console.log(err);
                            }
                            else{
                              console.log("Success!!");
                            }
                          });
                          res.redirect("/adminDash");
                        }
                        else{
                          Internship.count(function (err, internship) {
                            if(err) {
                              req.flash("error","Something went wrong.");
                              res.redirect("/adminDash");
                            } else {
                              Guestfaculty.count(function (err, guest) {
                                if(err) {
                                  req.flash("error","Something went wrong.");
                                  res.redirect("/adminDash");
                                } else {
                                    res.render('adminDash', { student: student, faculty: faculty, guest: guest, course: course, query: query, application: application, newListItems: foundItems, internship: internship });
                                  }
                                })
                              }
                            })

                        }

                      })



                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })

});

app.get("/admin", function(req, res) {
  // res.sendFile(__dirname + '/admin/html/index.html');
  res.render('admin_cdac.ejs');
});

app.post("/admin", passport.authenticate("local", {
      failureRedirect: "/admin"
  }), function(req, res) {
  const secretkey = '6LdHafogAAAAABx7lH22j_1Iooy7O2Qby6Ypo97_';
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
  fetch(verifyUrl, {
    method: "POST",
  })
  .then((response) => response.json())
  .then((google_response) => {
    // google_response is the object return by
    // google as a response
    console.log(google_response);
    if (google_response.success == true) {
      //   if captcha is verified
      Student.find({username: req.body.username, usertype: "admin"}, function(err,admin){
        if(err){
          req.flash("error","Incorrect Username or Password.");
          res.redirect("/admin");
        } else {
          // console.log(admin);
          res.redirect('/adminDash');
        }
      })
    } else {
      // if captcha is not verified
      req.flash("error","Please enter the captcha.");
      res.redirect("/admin");
    }
  })
  .catch((error) => {
      // Some error while verify captcha
      req.flash("error","Captcha verification failed.");
      res.redirect("/admin");
  });

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

app.get("/viewapplications", middlewareObj.isAdminLoggedIn, function(req, res) {
  Application.find({}, function (err, application) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('viewinternapplications',{ application: application });
    }
  })
});

app.get("/viewupdates", middlewareObj.isAdminLoggedIn, function(req, res) {
  Update.find({}, function (err, update) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('viewupdates',{ update: update });
    }
  })
});

app.post("/update-remove/:id", middlewareObj.isAdminLoggedIn, function (req, res) {
  Update.remove({ username: req.params.id }, function (err, update) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/viewupdates");
    } else {
      req.flash("success","Deleted latest update successfully.");
      res.redirect("/viewupdates");
    }
  })
})

app.get("/viewprograms", middlewareObj.isAdminLoggedIn, function(req, res) {
  Program.find({}, function (err, program) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('viewprograms',{ program: program });
    }
  })
});

app.post("/program-remove/:id", middlewareObj.isAdminLoggedIn, function (req, res) {
  Program.remove({ username: req.params.id }, function (err, program) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/viewprograms");
    } else {
      req.flash("success","Deleted program successfully.");
      res.redirect("/viewprograms");
    }
  })
})

app.get("/viewevents", middlewareObj.isAdminLoggedIn, function(req, res) {
  Event.find({}, function (err, event) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('viewevents',{ event: event });
    }
  })
});

app.post("/event-remove/:id", middlewareObj.isAdminLoggedIn, function (req, res) {
  Event.remove({ username: req.params.id }, function (err, event) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/viewevents");
    } else {
      req.flash("success","Deleted program successfully.");
      res.redirect("/viewevents");
    }
  })
})

app.get("/viewguestfaculty", middlewareObj.isAdminLoggedIn, function(req, res) {
  Guestfaculty.find({}, function (err, guestfaculty) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('viewguestfacultyapp',{ guestfaculty: guestfaculty });
    }
  })
});

app.post("/guestfaculty-remove/:id", middlewareObj.isAdminLoggedIn, function (req, res) {
  Guestfaculty.remove({ username: req.params.id }, function (err, guestfaculty) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/viewguestfaculty");
    } else {
      req.flash("success","Deleted Guest Faculty successfully.");
      res.redirect("/viewguestfaculty");
    }
  })
})

app.get("/viewjobs", middlewareObj.isAdminLoggedIn, function(req, res) {
  Job.find({}, function (err, job) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('viewjobs',{ job: job });
    }
  })
});

app.post("/job-remove/:id", middlewareObj.isAdminLoggedIn, function (req, res) {
  Job.remove({ username: req.params.id }, function (err, job) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/viewjobs");
    } else {
      req.flash("success","Deleted Job Application successfully.");
      res.redirect("/viewjobs");
    }
  })
})

app.get("/students", middlewareObj.isAdminLoggedIn, function(req, res) {
  // res.sendFile(__dirname + '/admin/html/index.html');
  Student.find({usertype: "student"}, function (err, student) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      res.render('studentTable',{student: student});
    }
  })
});

app.post("/student-remove/:id", middlewareObj.isAdminLoggedIn, function (req, res) {
  Student.remove({ _id: req.params.id }, function (err, user) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/students");
    } else {
      req.flash("success","Deleted student successfully.");
      res.redirect("/students");
    }
  })
})

app.get("/add", middlewareObj.isAdminLoggedIn, function(req, res) {
  // res.sendFile(__dirname + '/admin/html/index.html');
  res.render('form.ejs');
});

//DELETE FACULTY
app.post("/faculty-remove/:id", middlewareObj.isAdminLoggedIn, function (req, res) {
  Student.remove({ _id: req.params.id }, function (err, user) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/view");
    } else {
      req.flash("success","Deleted the faculty successfully");
      res.redirect("/view");
    }
  })
})

//FACULTY SIGNUP
app.post("/add", middlewareObj.isAdminLoggedIn, function(req, res) {
  console.log(req.body);
    var newUser = new Student({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, usertype: "faculty", password: req.body.password });

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
            res.redirect("/add");
        } else {
          // passport.authenticate('local')(req, res, function() {
          //   console.log(req);
          //   console.log("/////////////");
          //   console.log(user);
            req.flash("success", "Registered successfully!!");
            // res.render("dash_index.ejs",{id: user._id.toString()});
            res.redirect('/add');
          // });
        }
    });
});

app.get('/technicalstaff', function (req, res) {
  res.render('technicalstaff')
})

app.get('/nontechnicalstaff', function (req, res) {
  res.render('nontechnicalstaff');
})

//FACULTY LOGIN
app.get("/faculty-login", function(req, res) {
  // res.sendFile(__dirname + '/views/login.html');
  res.render('faculty-login.ejs');
});

app.post("/faculty-login", passport.authenticate("local", {
        failureRedirect: "/faculty-login"
    }), function(req, res) {
    const secretkey = '6LdHafogAAAAABx7lH22j_1Iooy7O2Qby6Ypo97_';
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    fetch(verifyUrl, {
      method: "POST",
    })
    .then((response) => response.json())
    .then((google_response) => {
      // google_response is the object return by
      // google as a response
      console.log(google_response);
      if (google_response.success == true) {
        //   if captcha is verified
        Student.find({ username: req.body.username, usertype: "faculty" }, function(err,faculty){
          if(err){
            req.flash("error","Incorrect Username or Password.");
            res.redirect("/faculty-login");
          } else {
            // res.render("dash_index.ejs");
            res.redirect('/facultyDash');
          }
        })
      } else {
        // if captcha is not verified
        req.flash("error","Please enter the captcha.");
        res.redirect("/faculty-login");
      }
    })
    .catch((error) => {
        // Some error while verify captcha
        req.flash("error","Captcha verification failed.");
        res.redirect("/faculty-login");
    });
});

//FACULTY DASHBOARD
app.get('/facultyDash', middlewareObj.isFacultyLoggedIn, function (req,res) {
  res.render('facultyDash');
})

//STUDENT SIGNUP
app.get("/signup", function(req, res) {
    // res.sendFile(__dirname + '/views/signup.html');
    res.render('signup.ejs');
});

app.post("/signup", function(req, res) {
  const secretkey = '6LdHafogAAAAABx7lH22j_1Iooy7O2Qby6Ypo97_';
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

  fetch(verifyUrl, {
    method: "POST",
  })
  .then((response) => response.json())
  .then((google_response) => {
    // google_response is the object return by
    // google as a response
    console.log(google_response);
    if (google_response.success == true) {
      //   if captcha is verified
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
              console.log(user);
              req.flash("success", "Registered successfully!!");
              res.redirect('/dash_index');
            });
          }
      });
    } else {
      // if captcha is not verified
      req.flash("error","Please enter the captcha.");
      res.redirect("/signup");
    }
  })
  .catch((error) => {
      // Some error while verify captcha
      req.flash("error","Captcha verification failed.");
      res.redirect("/signup");
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
    const secretkey = '6LeitwEhAAAAAC9zBhycFKckM1cQgebO2hM6fDMN';
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    fetch(verifyUrl, {
      method: "POST",
    })
    .then((response) => response.json())
    .then((google_response) => {
      // google_response is the object return by
      // google as a response
      console.log(google_response);
      if (google_response.success == true) {
        //   if captcha is verified
        Student.find({username: req.body.username, usertype: "student" }, function(err,student){
          if(err){
            req.flash("error","Incorrect Username or Password.");
            res.redirect("/login");
          } else {
            res.redirect('/dash_index');
          }
        })
      } else {
        // if captcha is not verified
        req.flash("error","Please enter the captcha.");
        res.redirect("/login");
      }
    })
    .catch((error) => {
      req.flash("error","Captcha verification failed.");
      res.redirect("/login");
    });
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
            res.redirect("/");
        } else {
            res.render("profile-edit", {student: student});
        }
    });
});

//UPDATE
app.put("/dash_index/edit", middlewareObj.isLoggedIn, function(req, res) {
  // console.log(req.body);
    Student.findByIdAndUpdate(req.user._id, req.body, function(err, student) {
        if(err) {
          // console.log(err);
            req.flash("error","Something went wrong.");
            res.redirect("/");
        } else {
            if(student.usertype == "faculty") {
              req.flash("success","Edited your profile successfully");
              res.redirect('/facultyDash');
            } else {
              req.flash("success","Edited your profile successfully");
              res.redirect("/dash_index");
            }
        }
    });
});

//INTERNSHIP
// app.get('/internships', function (req,res) {
//   Internship.find({}, function (err, internship) {
//     if(err) {
//       req.flash("error", "Something went wrong.");
//       res.redirect("/");
//     } else {
//       var done = [];
//       var notdone = [];
//       for(var i=0; i<internship.length; i++) {
//         var today = Date.now();
//         let date_ob = new Date(ts);
//         let date = date_ob.getDate();
//         let month = date_ob.getMonth() + 1;
//         let year = date_ob.getFullYear();
//
//       }
//     }
//   })
//   res.render('internship.ejs');
// })
//INTERNSHIP
app.get('/internships', function (req,res) {
  var done = [];
  var notdone = [];
  Internship.find({}, function(err,internship){
    if(err){
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      for(var i=0; i<internship.length; i++) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var today = year+ "-" + month + "-" + date;
        var beg = internship[i].begin;
        var en = internship[i].end;
        let date_ob1 = new Date(beg);
        var m1 = date_ob1.getMonth()+1;
        let date_ob2 = new Date(en);
        var m2 = date_ob2.getMonth()+1;
        var begin = date_ob1.getFullYear() + "-" + m1 + "-" + date_ob1.getDate();

        var end = date_ob2.getFullYear() + "-" + m2 + "-" + date_ob2.getDate();
        console.log(today);
        console.log(begin);
        console.log(end);
        if(today >= begin && today <=end) {
          notdone.push(internship[i]);
        } else {
          done.push(internship[i]);
        }
      }
      res.render('internship', { done: done, notdone: notdone });
    }
  })
})

//ENROLL NOW
app.get('/enroll', middlewareObj.isStudentLoggedIn, function (req,res) {
  var done = [];
  var notdone = [];
  Internship.find({}, function(err,internship){
    if(err){
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      for(var i=0; i<internship.length; i++) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var today = year+ "-" + month + "-" + date;
        var beg = internship[i].begin;
        var en = internship[i].end;
        let date_ob1 = new Date(beg);
        var m1 = date_ob1.getMonth()+1;
        let date_ob2 = new Date(en);
        var m2 = date_ob2.getMonth()+1;
        var begin = date_ob1.getFullYear() + "-" + m1 + "-" + date_ob1.getDate();

        var end = date_ob2.getFullYear() + "-" + m2 + "-" + date_ob2.getDate();
        if(today < begin || today > end) {
          notdone.push(internship[i]);
        }
      }
      res.render('enroll-now', { internship: notdone });
    }
  })
})

app.post('/enroll', resumeUpload.single('link'), middlewareObj.isStudentLoggedIn, function (req,res) {
  console.log(req.file);
  console.log(req.body);
  if(!req.file) {
    req.flash("error", "Something went wrong.");
    res.redirect("/enroll");
  } else {
    var app = {
      username: uuidv4()+":"+req.body.username,
      name: req.body.name,
      email: req.body.email,
      MobileNo: req.body.MobileNo,
      college: req.body.college,
      course: req.body.course,
      skills: req.body.skills,
      link: `${req.file.filename}`
    }
    Application.create(app, function (err, app) {
      if(err) {
        req.flash("error","Something went wrong.");
        res.redirect("/enroll");
      } else {
        req.flash("success", "Application submitted successfully!");
        res.redirect('/enroll');
      }
    })
  }
})

//ABOUT US
app.get('/about', function (req,res) {
  res.render('about');
})

//GALLERY
app.get('/gallery', function (req,res) {
  res.render('gallery2');
})

//CONTACT US
app.get('/contact', function (req,res) {
  res.render('contact');
})

app.post('/contact', middlewareObj.isLoggedIn, function (req,res) {
  Query.create(req.body, function (err, query) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/contact");
    } else {
      var query = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        text: req.body.message
      };
      var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'queries_cdac@outlook.com',
          pass: 'Cdac@2022'
        }
      });

      var mailOptions = {
        from: 'queries_cdac@outlook.com',
        to: 'c_dac@outlook.com',
        subject: 'Queries regarding CDAC',
        html: "Name: " + query.firstname + " " + query.lastname + '<br>Email: ' + query.email + '<br>' + query.text
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          req.flash("error","Something went wrong");
          res.redirect('/contact');
        } else {
          console.log('Email sent: ' + info.response);
          req.flash("success","Query sent successfully.");
          res.redirect('/contact');
        }
      });
    }
  })
})

//Events

app.get("/annualevents", function(req, res) {
  res.render('annualevents');
});


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


//STUDENTS TABLE
app.get('/student_table/:id', middlewareObj.isFacultyLoggedIn, function (req, res) {
  Course.find({ username: req.params.id }, function (err, course) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/give_certificate");
    } else {
      Student.find({ usertype: "student" }, function (err, student) {
        if(err) {
          req.flash("error","Something went wrong.");
          res.redirect('/give_certificate');
        } else {
          // console.log(course);
          var students = [];
          for(var i=0; i<student.length; i++) {
            for(var j=0; j<student[i].courses.length; j++) {
              if(student[i].courses[j].username == course[0].username) {
                students.push(student[i]);
                break;
              }
            }
          }
          // console.log(students);
          res.render('student_table', { student: students, courseid: req.params.id });
        }
      })
    }
  })
})

app.post('/student_table/:id', middlewareObj.isFacultyLoggedIn, function (req, res) {
  // console.log(req.body);
  Course.find({ username: req.params.id }, function (err, course) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect('/give_certificate');
    } else {
        Student.find({ usertype: "student" }, function (err, student) {
          if(err) {
            console.log(err);
            req.flash("error","Something went wrong.");
            res.redirect('/give_certificate');
          } else {
            var students = req.body.students;
            console.log(students);
            for(var k=0;k<students.length;k++) {
              for(var i=0; i<student.length; i++) {
                if(student[i].username == students[k][0]) {
                  for(var j=0; j<student[i].courses.length; j++) {
                    if(student[i].courses[j].username == course[0].username) {
                      student[i].courses[j].grades = students[k][1];
                      student[i].save();
                      console.log(student[i].courses[j]);
                      break;
                    }
                  }
                  break;
                }
              }
            }
            req.flash("success","Grades uploaded successfully.");
            res.redirect('/student_table/'+req.params.id);
            // console.log(student[0].courses);
          }
        })
      }
  })
})

// app.get('/faculty-dash', function (req, res) {
//   res.render('trial');
// })

//ABOUT COURSES
app.get('/about_course/:id', middlewareObj.isLoggedIn, function (req,res) {
  // console.log(req.params.id);
  Course.find({ username: req.params.id }, function (err, course) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/");
    } else {
      console.log(course[0].students);
      var array = course[0].students;
      var enroll = false;
      for(var i=0; i<array.length; i++) {
        if(array[i] == req.user._id) {
          enroll = true;
          break;
        }
      }
      if(enroll) {
        res.render('about_course.ejs',{ course: course[0], enrolled: true });
      } else {
        res.render('about_course.ejs',{ course: course[0], enrolled: false });
      }
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

//EDIT COURSE
app.get('/edit-course/:id', middlewareObj.isFacultyLoggedIn, function (req, res) {
  Course.find({ username: req.params.id }, function(err, course) {
      if(err) {
        // console.log(err);
          req.flash("error","Something went wrong.");
          res.redirect("/offered_courses");
      } else {
          console.log(course);
          res.render('edit-course', { course: course[0] });
      }
  });
})

app.post('/edit-course/:id', syllabusUpload.single('syllabus'), middlewareObj.isFacultyLoggedIn, function (req, res) {
  Course.find({ username: req.body.username }, function (err, course) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect("/offered_courses");
    } else {
      var username = req.body.username;
      var name = req.body.name;
      var syllabus;
      var description = req.body.description;
      var duration = req.body.duration;
      var deadline = req.body.deadline;
      var cert = req.body.cert;
      var language = req.body.language;
      var mode = req.body.mode;
      var students = course[0].students;
      var instructor = {
        name: req.body.instructor_name,
        designation: req.body.instructor_designation,
        college : req.body.instructor_college
      };
      if(req.file) {
        syllabus = req.file.filename;
      } else {
        syllabus = course[0].syllabus;
      }
      var newCourse = {username: username, name: name, syllabus: syllabus, description: description, deadline: deadline,
        cert: cert, language: language, mode: mode, students: students, instructor: instructor, duration: duration };

      Course.findOneAndUpdate({ username: req.params.id }, newCourse, function(err, course) {
          if(err) {
            // console.log(err);
              req.flash("error","Something went wrong.");
              res.redirect("/offered_courses");
          } else {
              Student.find({}, function (err, student) {
                console.log(student);
                for(var i=0; i<student.length; i++) {
                  for(var j=0; j<student[i].courses.length; j++) {
                    if(student[i].courses[j].username == course.username) {
                      student[i].courses[j] = newCourse;
                    }
                    console.log(student[i]);
                    student[i].save();
                  }
                }
                req.flash("success","Edited the course successfully");
                res.redirect("/offered_courses");
              })
          }
      });
    }
  })
})

//COURSES OFFERED
app.get('/offered_courses', middlewareObj.isFacultyLoggedIn, function (req,res) {
  res.render('offered_courses');
})


//STUDENT DASHBOARD
app.get('/dash_index', middlewareObj.isStudentLoggedIn, function (req,res) {
  res.render('dash_index.ejs');
})

//COURSE UPLOAD
app.get('/course-upload', middlewareObj.isFacultyLoggedIn, function (req,res) {
  res.render('course-upload');
})

app.post("/course-upload", syllabusUpload.single('syllabus'), middlewareObj.isFacultyLoggedIn, function (req, res) {
  console.log(req.file);
  if(!req.file) {
    req.flash("error", "Something went wrong");
    res.redirect('/course-upload');
  } else {
    var username = uuidv4();
    var name = req.body.name;
    var syllabus = req.file.filename;
    var description = req.body.description;
    var duration = req.body.duration;
    var deadline = req.body.deadline;
    var cert = req.body.cert;
    var language = req.body.language;
    var mode = req.body.mode;
    var students = [];
    var instructor = {
      name: req.body.instructor_name,
      designation: req.body.instructor_designation,
      college : req.body.instructor_college
    };
    var newCourse = {username: username, name: name, syllabus: syllabus, description: description, deadline: deadline,
      cert: cert, language: language, mode: mode, students: students, instructor: instructor, duration: duration };
      console.log("/////////");
    console.log(newCourse);
    console.log("/////////");

    Course.create(newCourse, function(err, allCourse) {
        if(err) {
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('/course-upload');
        } else {
            Student.findById(req.user._id, function (err, user) {
              if(err) {
                req.flash("error", "Something went wrong");
                res.redirect('/course-upload');
              } else {
                user.courses.push(newCourse);
                user.save();
                req.flash("success", "Course uploaded successfully.");
                res.redirect("/courses");
              }
            })
        }
    });
  }
});

//ENROLL COURSE
app.post('/:id/course/:courseid', middlewareObj.isStudentLoggedIn, function (req, res) {
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
                    course.students.push(req.params.id);
                    course.save();
                    console.log(course);
                    req.flash("success","Enrolled in a course successfully");
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
          req.flash("error","Something went wrong");
          res.redirect('/send-email');
        } else {
          console.log('Email sent: ' + info.response);
          req.flash("success","A link is sent to your mail. Please check your mail.");
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
          courses: student.courses,
          profileImage: student.profileImage,
          certificates: student.certificates,
          password: req.body.password
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
        profileImage: student.profileImage,
        certificates: student.certificates,
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
app.post("/upload-profile", upload.single('image'),  middlewareObj.isLoggedIn, function(req, res) {
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
    if(user.usertype == "faculty") {
      res.redirect('/facultyDash');
    } else {
      res.redirect("/dash_index");
    }
  });
});

//VIEW IDS
app.get('/view-ids',  middlewareObj.isStudentLoggedIn,  function (req, res) {
  res.render('view-photos');
})

//DOWNLOAD CERTIFICATE
app.get('/certificate_download', middlewareObj.isStudentLoggedIn,  function (req, res) {
  console.log(req.user.certificates);
  res.render('certificate_download');
})

//VIEW CERTIFICATE
app.get('/view_certificate/:id', middlewareObj.isStudentLoggedIn,  function (req, res) {
  var course;
  var currentUser = req.user;
  console.log(currentUser);
  for(var i=0; i<currentUser.certificates.length; i++) {
    if(req.user.certificates[i].username == req.params.id) {
      course = req.user.certificates[i];
      break;
    }
  }
  res.render('view_certificate', { course: course });
})

//GIVE CERTIFICATE
app.get('/give_certificate', middlewareObj.isFacultyLoggedIn,  function (req, res) {
  res.render('give_certificate');
})

app.get('/send_certificate/:id', middlewareObj.isFacultyLoggedIn,  function (req, res) {
  Course.find({ username: req.params.id }, function (err, course) {
    if(err) {
      req.flash("error","Something went wrong.");
      res.redirect('/give_certificate');
    } else {
      Student.find({ usertype: "student" }, function (err, student) {
        if(err) {
          req.flash("error","Something went wrong.");
          res.redirect('/give_certificate');
        } else {
          var students = [];
          for(var i=0; i<student.length; i++) {
            var array = course[0].students;
            var enroll = false;
            for(var ii=0; ii<array.length; ii++) {
              if(array[ii] == student[i]._id) {
                enroll = true;
                break;
              }
            }
            if(enroll) {
              for(var j=0; j<student[i].courses.length; j++) {
                if(student[i].courses[j].username == course[0].username) {
                  students.push(student[i]);
                  break;
                }
              }
            }
          }
          res.render('send_certificate',{ student: students, courseid: req.params.id });
        }
      })
    }
  })
})

app.post('/send_certificate/:id', middlewareObj.isFacultyLoggedIn,  function (req, res) {
  console.log(req.body);
  Course.find({ username: req.params.id }, function (err, course) {
    if(err) {
      // console.log(err);
      req.flash("error","Something went wrong.");
      res.redirect('/give_certificate');
    } else {
      Student.find({ usertype: "student" }, function (err, student) {
        if(err) {
          // console.log(err);
          req.flash("error","Something went wrong.");
          res.redirect('/give_certificate');
        } else {
          var students = req.body.students;
          // console.log(students);
          for(var k=0; k<students.length; k++) {
            for(var i=0; i<student.length; i++) {
              if(students[k] == student[i].username) {
                for(var j=0; j<student[i].courses.length; j++) {
                  if(student[i].courses[j].username == course[0].username) {
                    student[i].certificates.push({
                      username: course[0].username,
                      name: course[0].name,
                      grades: student[i].courses[j].grades,
                      faculty: course[0].instructor.name,
                      date: Date.now()
                    });
                    student[i].save();
                    var index = course[0].students.indexOf(student[i]._id);
                    console.log(course[0]);
                    if (index !== -1) {
                      course[0].students.splice(index, 1);
                      course[0].save();
                    }
                    console.log(course[0]);
                    break;
                  }
                }
                break;
              }
            }
          }
          req.flash("sucess","Sucessfully sent the certificates.");
          res.redirect('/send_certificate/'+req.params.id);
        }
      })
    }
  })
})

//listen on port 3000
app.listen(3000);
