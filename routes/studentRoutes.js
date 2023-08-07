const express = require("express");
const {
  createStudent,
  getStudents,
  createPayment,
  getStudentById,
  updateStudent,
  deleteStudent,
  getPaymentsForStudent,
  updatePayment,
  getPaymentById,
  deletePayment,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.post("/:studentId/payments", createPayment);

// Get a single student by ID
router.get("/:studentId", getStudentById);

// Update a student
router.put("/:studentId", updateStudent);

// Delete a student
router.delete("/:studentId", deleteStudent);

// Get all payments for a student
router.get("/:studentId/payments", getPaymentsForStudent);

// Update a payment for a student
router.put("/:studentId/payments/:paymentId", updatePayment);

// Get a single payment for a student
router.get("/:studentId/payments/:paymentId", getPaymentById);

// Delete a payment for a student
router.delete("/:studentId/payments/:paymentId", deletePayment);


module.exports = router;
