const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: false // Google users layi password optional
  },

  photo: {
    type: String
  },

  provider: {
    type: String,
    default: "local" // local | google
  },

  googleId: {
    type: String
  },

  darkMode: {
    type: Boolean,
    default: false
  },

  notifications: {
    type: Boolean,
    default: true
  },

  notifPrefs: {
    weeklyCheckin:    { type: Boolean, default: true },
    reflectionBased:  { type: Boolean, default: true },
    inactivity:       { type: Boolean, default: true },
    wellbeing:        { type: Boolean, default: true },
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("User", UserSchema);