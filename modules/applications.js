var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ApplicationSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    MobileNo: String,
    college: String,
    course: String,
    skills: String,
    link: String
});

ApplicationSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Application', ApplicationSchema);
