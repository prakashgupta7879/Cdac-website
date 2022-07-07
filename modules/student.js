var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    firstname: {
    type: String,
    default: ''
},
    lastname: {
    type: String,
    default: ''
},
    dob: {
    type: String,
    default: ''
},
    qualification: {
    type: String,
    default: ''
},
    Designation: {
    type: String,
    default: ''
},
    Department: {
    type: String,
    default: ''
},
    AreaOfSpecialization: {
    type: String,
    default: ''
},
    Institute: {
      name: {
    type: String,
    default: ''
},
      place: {
    type: String,
    default: ''
},
      state: {
    type: String,
    default: ''
},
      nature: {
    type: String,
    default: ''
},
      type: {
    type: String,
    default: ''
}
    },
    address: {
    type: String,
    default: ''
},
    state: {
    type: String,
    default: ''
},
    district: {
    type: String,
    default: ''
},
    pincode: {
    type: String,
    default: ''
},
    username: {
    type: String,
    default: ''
},
    email: {
    type: String,
    default: ''
},
    MobileNo: {
    type: String,
    default: ''
},
    password: {
    type: String,
    default: ''
},
    usertype: {
    type: String,
    default: ''
}
}
// faculty: {
//   username: {
//   type: String,
//   default: ''
// },
//   firstname: {
//   type: String,
//   default: ''
// },
//   lastname: {
//   type: String,
//   default: ''
// },
//   email: {
//   type: String,
//   default: ''
// },
//   password: {
//   type: String,
//   default: ''
// },
// }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Student', UserSchema);
