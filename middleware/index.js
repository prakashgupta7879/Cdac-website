var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  // console.log(req.headers.authorization);
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isAdminLoggedIn = function(req, res, next) {
  // console.log(req.headers.authorization);
    if(req.isAuthenticated() && req.user.usertype == "admin") {
        return next();
    }
    // console.log(req.user);
    req.flash("error", "Unauthorized to do that.");
    res.redirect("/");
}

middlewareObj.isStudentLoggedIn = function(req, res, next) {
  // console.log(req.headers.authorization);
    if(req.isAuthenticated() && req.user.usertype == "student") {
          return next();
    }
    // console.log(req.user);
    req.flash("error", "Unauthorized to do that.");
    res.redirect("/login");
}

middlewareObj.isFacultyLoggedIn = function(req, res, next) {
  // console.log(req.headers.authorization);
    if(req.isAuthenticated() && req.user.usertype == "faculty") {
      return next();
    }
    // console.log(req.user);
    req.flash("error", "Unauthorized to do that.");
    res.redirect("/faculty-login");
}

module.exports = middlewareObj;
