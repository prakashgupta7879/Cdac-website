var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var GuestfacultySchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    mobile: String,
    qualification: [],
    department: String,
    institute: String,
    university: String,
    courses: [],
    experience: [],
    coursestaught: String,
    resume: String,

});

GuestfacultySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Guestfaculty', GuestfacultySchema);
