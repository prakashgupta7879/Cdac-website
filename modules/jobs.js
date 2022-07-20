var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var JobSchema = new mongoose.Schema({
    username: String,
    link: String
});

JobSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Job', JobSchema);
