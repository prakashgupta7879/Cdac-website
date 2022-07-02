var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    // facultyid: Number,
    // Department: String,
    // Designation: String,
    // MobileNo: mongoose.SchemaTypes.Phone,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Student', UserSchema);
