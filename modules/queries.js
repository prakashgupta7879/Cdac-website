var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var QuerySchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    MobileNo: String,
    course: String,
    skills: String,
    hobbies: String,
    link: String
});

QuerySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Query', QuerySchema);
