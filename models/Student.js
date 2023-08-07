const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  payment_date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  comments:{type: String, required: true}
});

const studentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  second_name: { type: String, required: true },
  third_name: { type: String, required: true },
  forth_name: { type: String, required: true },
  class_name: { type: String, required: true },
  address: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  father_phone_number: { type: String, required: true },
  mother_phone_number: { type: String, required: true },
  fee: { type: Number, default: 0, required: true },
  payments: [paymentSchema],
});

const Student = mongoose.model('Student', studentSchema);
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
  Student,
  Payment,
};
