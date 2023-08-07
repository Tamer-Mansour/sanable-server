const { Student, Payment } = require("../models/Student");

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const student = new Student(studentData);
    await student.save();
    res.status(201).json({ message: "Student created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students with pagination
exports.getStudents = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };
    const students = await Student.find({}, null, options);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a student's information
exports.updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentData = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      studentData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validations on the update
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------------------------

// Create a new payment for a student
exports.createPayment = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { amount, comments } = req.body;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the payment amount exceeds the student's fee
    if (amount > student.fee) {
      return res
        .status(400)
        .json({ error: "Payment amount exceeds student's fee" });
    }

    // Create a payment
    const payment = new Payment({ student: studentId, amount, comments });
    await payment.save();

    // Update student's fee
    student.fee -= amount;
    await student.save();

    res.status(201).json({ message: "Payment created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments for a student with pagination
exports.getPaymentsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };
    const payments = await Payment.find({ student: studentId }, null, options);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update a payment for a student
exports.updatePayment = async (req, res) => {
  try {
    const { studentId, paymentId } = req.params;
    const { amount, comments } = req.body;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Calculate the difference between the new payment amount and the original payment amount
    const paymentDiff = amount - payment.amount;

    // Update the payment
    payment.amount = amount;
    payment.comments = comments;
    await payment.save();

    // Update student's fee by subtracting the paymentDiff
    student.fee -= paymentDiff;
    await student.save();

    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single payment for a student
exports.getPaymentById = async (req, res) => {
  try {
    const { studentId, paymentId } = req.params;

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a payment for a student
exports.deletePayment = async (req, res) => {
  try {
    const { studentId, paymentId } = req.params;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Update student's fee
    student.fee += payment.amount;
    await student.save();

    // Delete the payment
    await payment.remove();

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
