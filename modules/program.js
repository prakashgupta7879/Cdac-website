var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var ProgramSchema = new mongoose.Schema({
    username: String,
    link: String
});

ProgramSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Program', ProgramSchema);
