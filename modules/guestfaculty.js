var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
// const AdminBroMongoose = require('admin-bro-mongoose')

// AdminBro.registerAdapter(AdminBroMongoose)

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    institute: String,
    university: String,
    experience: String,
    
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Guestfaculty', UserSchema);
