var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var EventSchema = new mongoose.Schema({
    username: String,
    link: String
});

EventSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Event', EventSchema);
