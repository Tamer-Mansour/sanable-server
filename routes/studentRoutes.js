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
  getStudentsInAcademicYear,
  getOrchardStudentsInAcademicYear,
  getAllOrchardStudents,
  getAllIntroductoryStudents,
  importOrchardStudentsToNewYear,
  getIntroductoryStudentsInAcademicYear,
  importStudentsFromExcel,
  upload,
} = require("../controllers/studentController");
const authMiddleware = require("../authMiddleware");

const router = express.Router();

router.post("/students", authMiddleware, createStudent);
router.get("/students", authMiddleware, getStudents);
router.post(
  "/import-students",
  authMiddleware,
  upload.single("file"),
  importStudentsFromExcel
);
router.get("/students/orchard", authMiddleware, getAllOrchardStudents);
router.get(
  "/students/introductory",
  authMiddleware,
  getAllIntroductoryStudents
);
router.post("/students/:studentId/payments", authMiddleware, createPayment);
router.get("/students/:studentId", authMiddleware, getStudentById);
router.put("/students/:studentId", authMiddleware, updateStudent);
router.delete("/students/:studentId", authMiddleware, deleteStudent);
router.get(
  "/students/:studentId/payments",
  authMiddleware,
  getPaymentsForStudent
);
router.put(
  "/students/:studentId/payments/:paymentId",
  authMiddleware,
  updatePayment
);
router.get(
  "/students/:studentId/payments/:paymentId",
  authMiddleware,
  getPaymentById
);
router.delete(
  "/students/:studentId/payments/:paymentId",
  authMiddleware,
  deletePayment
);
router.get("/students/search/students", authMiddleware, searchStudents);
router.post("/academic-years", authMiddleware, createAcademicYear);
router.put(
  "/academic-years/:academicYearId",
  authMiddleware,
  updateAcademicYear
);
router.delete(
  "/academic-years/:academicYearId",
  authMiddleware,
  deleteAcademicYear
);
router.post(
  "/academic-years/:academicYearId/add-students",
  authMiddleware,
  addStudentsToAcademicYear
);
router.post(
  "/academic-years/:academicYearId/remove-students",
  authMiddleware,
  removeStudentsFromAcademicYear
);
router.get(
  "/academic-years/:academicYearId/students",
  authMiddleware,
  getStudentsInAcademicYear
);
router.get(
  "/academic-years/:academicYearId/orchard-students",
  authMiddleware,
  getOrchardStudentsInAcademicYear
);
router.get(
  "/academic-years/:academicYearId/introductory-students",
  authMiddleware,
  getIntroductoryStudentsInAcademicYear
);
router.post(
  "/students/import-orchard-students",
  authMiddleware,
  importOrchardStudentsToNewYear
);

module.exports = router;
