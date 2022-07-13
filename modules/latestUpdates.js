var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UpdateSchema = new mongoose.Schema({
    username: String,
    name: String,
    link: String
});

UpdateSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Update', UpdateSchema);
