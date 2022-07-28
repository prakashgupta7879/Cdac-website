var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var JobSchema = new mongoose.Schema({
    username: String,
    advertisement: String,
    link: String,
    lastdate: String
});

JobSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Job', JobSchema);
