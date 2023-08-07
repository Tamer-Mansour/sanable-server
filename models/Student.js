const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  payment_date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  comments: { type: String, required: true }
});

const studentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  second_name: { type: String, required: true },
  third_name: { type: String },
  forth_name: { type: String },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  identityNumber: { type: String, required: true },
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  class_level: { type: String, enum: ['Orchard', 'Introductory'], required: true },
  address: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  father_phone_number: { type: String, required: true },
  mother_phone_number: { type: String, required: true },
  fee: { type: Number, default: 0, required: true },
  payments: [paymentSchema],
});

const academicYearSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

const Student = mongoose.model('Student', studentSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const AcademicYear = mongoose.model('AcademicYear', academicYearSchema);

module.exports = {
  Student,
  Payment,
  AcademicYear,
};
