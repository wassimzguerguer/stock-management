// models/User.js
const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },

  role: {
    type: String,
    default: 'member',
  },
  // permissions: {
  //   type: [String],
  //   default: ['All'],
  // },
});

const User = mongoose.model ('User', userSchema);

module.exports = User;
