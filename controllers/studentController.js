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

    const deletedAcademicYear = await AcademicYear.findByIdAndDelete(academicYearId);

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

    // Find the academic year document by its ID
    const academicYear = await AcademicYear.findById(academicYearId);

    if (!academicYear) {
      return res.status(404).json({ error: 'Academic year not found' });
    }

    // Create an array to store the new student objects
    const newStudents = [];

    // Loop through the studentIds array and create new student objects
    for (const studentId of studentIds) {
      // Retrieve the student document by its ID
      const student = await Student.findById(studentId);

      if (!student) {
        // If the student with the given ID is not found, skip adding it to the academic year
        continue;
      }

      // Check if the student is already in the academic year's students array
      if (!academicYear.students.some(existingStudent => existingStudent.equals(student._id))) {
        // Add the student to the newStudents array
        newStudents.push(student);
      }
    }

    if (newStudents.length === 0) {
      return res.json({ message: 'No new students to add to the academic year' });
    }

    // Push the newStudents array into the students array of the academic year document
    academicYear.students.push(...newStudents);

    // Save the updated academic year document
    await academicYear.save();

    res.json({ message: 'Students added to the academic year successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove students from an academic year
// removeStudentsFromAcademicYear was started
exports.removeStudentsFromAcademicYear = async (req, res) => {
  try {
    const { academicYearId, studentIds } = req.body;

    // Find the academic year document by its ID
    const academicYear = await AcademicYear.findById(academicYearId);

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    // Remove the specified student IDs from the academic year's students array
    academicYear.students = academicYear.students.filter(
      (studentId) => !studentIds.includes(studentId)
    );

    // Save the updated academic year document
    await academicYear.save();

    // Clear the academicYear field for the removed students
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { academicYear: null }
    );

    res.json({ message: "Students removed from the academic year successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all students in the academic year with pagination
exports.getStudentsInCurrentYear = async (req, res) => {
  try {
    const { yearId } = req.params; // Extract the yearId from the URL parameter

    // Find the academic year document by its ID
    const academicYear = await AcademicYear.findById(yearId);

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    const { page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };

    const students = await Student.find(
      { academicYear: academicYear._id },
      null,
      options
    );

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all Orchard students in the academic year with pagination
exports.getOrchardStudentsInCurrentYear = async (req, res) => {
  try {
    const { yearId } = req.params; // Extract the yearId from the URL parameter

    // Find the academic year document by its ID
    const academicYear = await AcademicYear.findById(yearId);

    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    const { page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };

    const students = await Student.find(
      {
        academicYear: academicYear._id,
        class_level: "Orchard",
      },
      null,
      options
    );

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Introductory students in the academic year with pagination

exports.getIntroductoryStudentsInCurrentYear = async (req, res) => {
  try {
    const { yearId } = req.params;
    const currentYear = await AcademicYear.findById(yearId);

    if (!currentYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    const { page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };

    const students = await Student.find(
      {
        academicYear: currentYear._id,
        class_level: "Introductory",
      },
      null,
      options
    );

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all Orchard students with pagination
exports.getAllOrchardStudents = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };

    const students = await Student.find(
      { class_level: "Orchard" },
      null,
      options
    );

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Introductory students with pagination
exports.getAllIntroductoryStudents = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const options = {
      skip: (page - 1) * perPage,
      limit: parseInt(perPage),
    };

    const students = await Student.find(
      { class_level: "Introductory" },
      null,
      options
    );

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Import Orchard students to a new academic year
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

    // Find Orchard students in the source academic year
    const orchardStudents = await Student.find({
      academicYear: sourceYearId,
      class_level: "Orchard level",
    });

    // Update each Orchard student's academicYear field
    const studentIds = orchardStudents.map((student) => student._id);
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { academicYear: targetYearId }
    );

    // Update the target academic year's students array
    targetYear.students = [...targetYear.students, ...studentIds];
    await targetYear.save();

    res.json({ message: "Orchard students imported to the new year successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//***************************************************************************************************************
// ------------------------------------------

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const student = new Student(studentData);

    // Check if an academicYear is specified
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
      return res.status(400).json({ error: "Payment amount exceeds student's fee" });
    }

    // Create a payment
    const payment = new Payment({ student: studentId, amount, comments });
    await payment.save();

    // Add payment's ID to student's payments array
    student.payments.push(payment._id);

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

    // Remove the payment's ID from the student's payments array
    student.payments = student.payments.filter(pid => !pid.equals(paymentId));
    await student.save();

    // Delete the payment
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

