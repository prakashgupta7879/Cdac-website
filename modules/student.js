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
    profileImage: {
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
    id_card: {
      type: String,
      default: ''
    },
    address_proof: {
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
},
    courses : [
      {
          username: String,
          name: String,
          description: String,
          syllabus: String,
          duration: String,
          grades: {
            type: String,
            default: ''
          },
          deadline: String,
          cert: String,
          language: String,
          mode: String,
          instructor: {
            name: String,
            designation: String,
            college: String,
          }
      }
    ],
    certificates : [
      {
          username: String,
          name: String,
          grades: String,
          faculty: String,
          date: Date
      }
    ]
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
