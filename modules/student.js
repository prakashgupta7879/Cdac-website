var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    dob: Date,
    scholarid: Number,
    email: String,
    InstituteName: String,
    Address: String,
    MobileNo: mongoose.SchemaTypes.Phone,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
