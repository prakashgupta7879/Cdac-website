var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  // console.log(req.headers.authorization);
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isStudentLoggedIn = function(req, res, next) {
  // console.log(req.headers.authorization);
    if(req.isAuthenticated() && req.user.usertype == "student") {
        console.log("///////////");
        console.log(req.user);
        return next();
    }
    // console.log(req.user);
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isFacultyLoggedIn = function(req, res, next) {
  // console.log(req.headers.authorization);
    if(req.isAuthenticated() && req.user.usertype == "faculty") {
        console.log("///////////");
        console.log(req.user);
        return next();
    }
    // console.log(req.user);
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/faculty-login");
}

module.exports = middlewareObj;
