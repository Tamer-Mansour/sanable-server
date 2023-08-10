const { Student, Payment, AcademicYear } = require("../models/Student");

// Create a new academic year
exports.createAcademicYear = async (req, res) => {
  try {
    const academicYearData = req.body;
    const academicYear = new AcademicYear(academicYearData);
    await academicYear.save();
    res.status(201).json({ message: "Academic year created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an academic year by ID
exports.updateAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;
    const academicYearData = req.body;

    const updatedAcademicYear = await AcademicYear.findByIdAndUpdate(
      academicYearId,
      academicYearData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAcademicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    res.json(updatedAcademicYear);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an academic year by ID
exports.deleteAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;

    const deletedAcademicYear = await AcademicYear.findByIdAndDelete(
      academicYearId
    );

    if (!deletedAcademicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    res.json({ message: "Academic year deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Add students to an academic year
exports.addStudentsToAcademicYear = async (req, res) => {
  try {
    const { academicYearId, studentIds } = req.body;
    const academicYear = await AcademicYear.findById(academicYearId);

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }
    const newStudents = [];

    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);

      if (!student) {
        continue;
      }

      if (
        !academicYear.students.some((existingStudent) =>
          existingStudent.equals(student._id)
        )
      ) {
        newStudents.push(student);
      }
    }

    if (newStudents.length === 0) {
      return res.json({
        message: "No new students to add to the academic year",
      });
    }

    academicYear.students.push(...newStudents);

    await academicYear.save();
    for (const student of newStudents) {
      student.academicYear = academicYear._id;
      await student.save();
    }

    res.json({ message: "Students added to the academic year successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove students from an academic year
exports.removeStudentsFromAcademicYear = async (req, res) => {
  try {
    const { academicYearId, studentIds } = req.body;
    const academicYear = await AcademicYear.findById(academicYearId);

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    const studentIdsAsStrings = studentIds.map((id) => id.toString());

    academicYear.students = academicYear.students.filter(
      (studentId) => !studentIdsAsStrings.includes(studentId.toString())
    );

    await academicYear.save();

    await Student.updateMany(
      { _id: { $in: studentIds } },
      { academicYear: null }
    );

    res.json({
      message: "Students removed from the academic year successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students in the academic year with pagination
exports.getStudentsInAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;

    const academicYear = await AcademicYear.findById(academicYearId).populate(
      "students"
    );

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    const students = academicYear.students;

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrchardStudentsInAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;

    const academicYear = await AcademicYear.findById(academicYearId).populate(
      "students"
    );

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    const orchardStudents = academicYear.students.filter(
      (student) => student.class_level === "Orchard"
    );

    res.json(orchardStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIntroductoryStudentsInAcademicYear = async (req, res) => {
  try {
    const { academicYearId } = req.params;

    const academicYear = await AcademicYear.findById(academicYearId).populate(
      "students"
    );

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    const introductoryStudents = academicYear.students.filter(
      (student) => student.class_level === "Introductory"
    );

    res.json(introductoryStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrchardStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const skip = (page - 1) * perPage;

    const orchardStudents = await Student.find({ class_level: "Orchard" })
      .skip(skip)
      .limit(perPage);

    res.json(orchardStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Introductory students with pagination
exports.getAllIntroductoryStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const skip = (page - 1) * perPage;

    const introductoryStudents = await Student.find({
      class_level: "Introductory",
    })
      .skip(skip)
      .limit(perPage);

    res.json(introductoryStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.importOrchardStudentsToNewYear = async (req, res) => {
  try {
    const { sourceYearId, targetYearId } = req.body;

    const sourceYear = await AcademicYear.findById(sourceYearId);
    if (!sourceYear) {
      return res.status(404).json({ error: "Source academic year not found" });
    }

    const targetYear = await AcademicYear.findById(targetYearId);
    if (!targetYear) {
      return res.status(404).json({ error: "Target academic year not found" });
    }

    const orchardStudents = await Student.find({
      academicYear: sourceYearId,
      class_level: "Orchard level",
    });

    const studentIds = orchardStudents.map((student) => student._id);
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { academicYear: targetYearId }
    );

    targetYear.students = [...targetYear.students, ...studentIds];
    await targetYear.save();

    res.json({
      message: "Orchard students imported to the new year successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const student = new Student(studentData);

    if (student.academicYear) {
      const academicYear = await AcademicYear.findById(student.academicYear);
      if (!academicYear) {
        return res.status(404).json({ error: "Academic year not found" });
      }
      academicYear.students.push(student._id);
      await academicYear.save();
    }

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
        new: true,
        runValidators: true,
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
    const { amount, amountInWords, comments } = req.body; // Include amountInWords

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (amount > student.fee) {
      return res
        .status(400)
        .json({ error: "Payment amount exceeds student's fee" });
    }

    // Calculate remaining amount
    const remainingAmount = student.fee - amount;

    const payment = new Payment({
      student: studentId,
      amount,
      amountInWords,
      comments,
      remainingAmount,
    }); // Include amountInWords and remainingAmount
    await payment.save();

    student.payments.push(payment._id);
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
    const { amount, amountInWords, comments } = req.body; // Include amountInWords

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const paymentDiff = amount - payment.amount;

    payment.amount = amount;
    payment.amountInWords = amountInWords; // Update amountInWords
    payment.comments = comments;
    await payment.save();

    // Update remaining amount
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

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    student.fee += payment.amount;
    await student.save();

    student.payments = student.payments.filter((pid) => !pid.equals(paymentId));
    await student.save();

    await Payment.deleteOne({ _id: paymentId });

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search for students based on attributes
exports.searchStudents = async (req, res) => {
  try {
    const { query, page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };

    let searchQuery = {
      $or: [
        { first_name: { $regex: query, $options: "i" } },
        { second_name: { $regex: query, $options: "i" } },
        { third_name: { $regex: query, $options: "i" } },
        { forth_name: { $regex: query, $options: "i" } },
        { class_name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { father_phone_number: { $regex: query, $options: "i" } },
        { mother_phone_number: { $regex: query, $options: "i" } },
      ],
    };

    const students = await Student.find(searchQuery, null, options);

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
exports.upload = upload;

exports.importStudentsFromExcel = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const studentData = xlsx.utils.sheet_to_json(sheet);
    const newStudents = await Student.create(studentData);

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Students imported from Excel sheet successfully",
      newStudents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};