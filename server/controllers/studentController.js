import asyncHandler from "express-async-handler";
import Student from "../models/student.js";
import Attendance from "../models/attendance.js";

// @desc    Get attendance list with search and total counts
// @route   GET /api/student/attendance/list
// @access  Private/Staff
const getAttendanceList = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { roomNo: { $regex: req.query.keyword, $options: "i" } },
          { contact: { $regex: req.query.keyword, $options: "i" } },
          { course: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const students = await Student.find({ ...keyword });

  // Fetch today's attendance data to show current state
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = await Attendance.find({ date: today });
  
  const attendanceMap = {};
  todayAttendance.forEach(a => {
    attendanceMap[a.student] = a.status;
  });

  // Calculate total attendance (Present count) for each student
  const studentsWithStats = await Promise.all(
    students.map(async (student) => {
      const presentCount = await Attendance.countDocuments({
        student: student._id,
        status: "Present",
      });
      
      return {
        ...student._doc,
        totalAttendance: presentCount,
        todayStatus: attendanceMap[student._id] || "Absent",
      };
    })
  );

  res.json({
    students: studentsWithStats,
    attendance: { data: attendanceMap }
  });
});

const addStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    address,
    course,
    city,
    contact,
    fatherContact,
    image,
    roomNo,
    blockNo,
    status,
  } = req.body;

  const studentExist = await Student.findOne({ email });

  if (studentExist) {
    res.status(400);
    throw new Error("Student with this email already exists");
  }

  // Generate unique student ID (e.g., ST-12345)
  const studentId = `ST-${Math.floor(10000 + Math.random() * 90000)}`;

  const student = await Student.create({
    user: req.user._id,
    studentId,
    email,
    name,
    address,
    course,
    city,
    contact,
    fatherContact,
    image,
    roomNo,
    blockNo,
    status,
  });

  if (student) {
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      address: student.address,
      course: student.course,
      city: student.city,
      contact: student.contact,
      fatherContact: student.fatherContact,
      image: student.image,
      roomNo: student.roomNo,
      blockNo: student.blockNo,
      status: student.status,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Student data");
  }
});

const updateStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.body._id);

  if (student) {
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.address = req.body.address || student.address;
    student.course = req.body.course || student.course;
    student.city = req.body.city || student.city;
    student.contact = req.body.contact || student.contact;
    student.fatherContact = req.body.fatherContact || student.fatherContact;
    student.image = req.body.image || student.image;
    student.roomNo = req.body.roomNo || student.roomNo;
    student.blockNo = req.body.blockNo || student.blockNo;
    const oldStatus = student.status;
    student.status = req.body.status || student.status;

    const updatedStudent = await student.save();

    // If status was changed, also mark/update today's attendance
    if (req.body.status && req.body.status !== oldStatus) {
      const today = new Date().toISOString().split('T')[0];
      let attendance = await Attendance.findOne({ student: student._id, date: today });
      
      const attendanceStatus = req.body.status === "Hostel" ? "Present" : 
                               req.body.status === "Outside" ? "Absent" : "Leave";

      if (attendance) {
        attendance.status = attendanceStatus;
        attendance.markedBy = req.user._id;
        await attendance.save();
      } else {
        await Attendance.create({
          student: student._id,
          date: today,
          status: attendanceStatus,
          markedBy: req.user._id,
        });
      }
    }

    res.json(updatedStudent);
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

const getStudents = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Student.countDocuments({ ...keyword });
  const students = await Student.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ students, page, pages: Math.ceil(count / pageSize) });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    await student.remove();
    res.json({ message: "Student removed" });
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (student) {
    res.json(student);
  } else {
    res.status(404);
    throw new Error("Students not found");
  }
});

const getStudentByRoomNo = asyncHandler(async (req, res) => {
  const students = await Student.find({ 
    roomNo: { $regex: `^${req.params.roomId}$`, $options: "i" } 
  });
  
  const today = new Date().toISOString().split('T')[0];
  const attendance = await Attendance.find({ date: today });
  const attendanceMap = {};
  attendance.forEach(a => {
    attendanceMap[a.student] = a.status;
  });

  if (students) {
    res.json({ students: students, attendance: { data: attendanceMap } });
  } else {
    res.status(404);
    throw new Error("Students not found");
  }
});

export {
  getAttendanceList,
  addStudent,
  updateStudentProfile,
  getStudents,
  deleteStudent,
  getStudentById,
  getStudentByRoomNo,
};
