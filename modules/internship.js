var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var InternshipSchema = new mongoose.Schema({
    username: String,
    description: String,
    duration: String,
    mentor: String,
    begin: Date,
    end: Date
});

InternshipSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Internship', InternshipSchema);
