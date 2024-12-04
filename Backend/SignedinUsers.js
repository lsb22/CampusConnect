const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  usn: String,
  password: String,
});

const usersCollection = mongoose.model("user", userSchema);

module.exports = { usersCollection };
