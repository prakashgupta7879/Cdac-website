var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var GuestfacultySchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    qualification: String,
    institute: String,
    university: String,
    experience: String,
    coursestaught: String,
    resume: String,
    
});

GuestfacultySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Guestfaculty', GuestfacultySchema);
