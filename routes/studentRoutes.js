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
  searchStudents,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  addStudentsToAcademicYear,
  removeStudentsFromAcademicYear,
  getStudentsInCurrentYear,
  getOrchardStudentsInCurrentYear,
  getAllOrchardStudents,
  getAllIntroductoryStudents,
  importOrchardStudentsToNewYear,
  getIntroductoryStudentsInCurrentYear,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/students", createStudent);
router.get("/students", getStudents);
router.post("/students/:studentId/payments", createPayment);

// Get a single student by ID
router.get("/students/:studentId", getStudentById);

// Update a student
router.put("/students/:studentId", updateStudent);

// Delete a student
router.delete("/students/:studentId", deleteStudent);

// Get all payments for a student
router.get("/students/:studentId/payments", getPaymentsForStudent);

// Update a payment for a student
router.put("/students/:studentId/payments/:paymentId", updatePayment);

// Get a single payment for a student
router.get("/students/:studentId/payments/:paymentId", getPaymentById);

// Delete a payment for a student
router.delete("/students/:studentId/payments/:paymentId", deletePayment);

// search for a students
router.get("/students/search/students", searchStudents);

// search for payment for a student
router.post("/academic-years", createAcademicYear);

// Update an academic year by ID
router.put("/academic-years/:academicYearId", updateAcademicYear);

// Delete an academic year by ID
router.delete("/academic-years/:academicYearId", deleteAcademicYear);

// Add students to an academic year
router.post(
  "/academic-years/:academicYearId/add-students",
  addStudentsToAcademicYear
);

// Remove students from an academic year
router.post(
  "/academic-years/:academicYearId/remove-students",
  removeStudentsFromAcademicYear
);

/// Get all students in the current academic year with pagination
router.get("/students/:yearId", getStudentsInCurrentYear);

// Get all Orchard students in the current academic year with pagination
router.get("/students/orchard/:yearId", getOrchardStudentsInCurrentYear);

router.get("/students/introductory/:yearId", getIntroductoryStudentsInCurrentYear);

// Get all Orchard students with pagination
router.get("/students/orchard", getAllOrchardStudents);

// Get all Introductory students with pagination
router.get("/students/introductory", getAllIntroductoryStudents);


// Import Orchard students to a new academic year
router.post(
  "/students/import-orchard-students",
  importOrchardStudentsToNewYear
);

module.exports = router;
