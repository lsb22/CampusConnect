const mongoose = require("mongoose");

const AllowedStudentSchema = mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const AllowedStudents = mongoose.model("AllowedStudent", AllowedStudentSchema);

module.exports = { AllowedStudents };
