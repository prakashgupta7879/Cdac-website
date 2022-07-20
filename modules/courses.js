var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var CourseSchema = new mongoose.Schema({
    username: String,
    name: String,
    description: String,
    syllabus: String,
    duration: String,
    deadline: String,
    cert: String,
    language: String,
    mode: String,
    students: [
      
    ],
    instructor: {
      name: String,
      designation: String,
      college: String,
    }
});

CourseSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Course', CourseSchema);
