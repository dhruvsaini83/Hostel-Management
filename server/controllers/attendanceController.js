import asyncHandler from "express-async-handler";
import Attendance from "../models/attendance.js";
import Student from "../models/student.js";

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private/Admin or Staff with permission
const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, date, status, remarks } = req.body;

  // Check if attendance already exists for this student and date
  let attendance = await Attendance.findOne({ student: studentId, date });

  if (attendance) {
    attendance.status = status;
    attendance.remarks = remarks;
    attendance.markedBy = req.user._id;
    await attendance.save();
  } else {
    attendance = await Attendance.create({
      student: studentId,
      date,
      status,
      remarks,
      markedBy: req.user._id,
    });
  }

  // Update Student model current status
  await Student.findByIdAndUpdate(studentId, { status: status });

  res.status(201).json(attendance);
});

// @desc    Get attendance for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getStudentAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ student: req.params.studentId })
    .populate("markedBy", "name")
    .sort({ date: -1 });
  res.json(attendance);
});

// @desc    Get attendance for all students on a date
// @route   GET /api/attendance/date/:date
// @access  Private/Admin or Staff
const getAttendanceByDate = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ date: req.params.date }).populate("student", "name roomNo blockNo");
  res.json(attendance);
});

// @desc    Get attendance statistics for a student
// @route   GET /api/attendance/stats/:studentId
// @access  Private
const getStudentStats = asyncHandler(async (req, res) => {
  const allAttendance = await Attendance.find({ student: req.params.studentId })
    .populate("markedBy", "name")
    .sort({ date: -1 });

  // Filter for last 30 days specifically
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const lastMonthAttendance = allAttendance.filter(a => {
    const recordDate = new Date(a.date);
    return recordDate >= thirtyDaysAgo;
  });

  const total = lastMonthAttendance.length;
  const present = lastMonthAttendance.filter((a) => a.status === "Present").length;
  const absent = lastMonthAttendance.filter((a) => a.status === "Absent").length;
  const leave = lastMonthAttendance.filter((a) => a.status === "Leave").length;

  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

  res.json({
    total,
    present,
    absent,
    leave,
    percentage,
    history: allAttendance.slice(0, 30), // Still show last 30 marked records
  });
});

// @desc    Bulk mark attendance
// @route   POST /api/attendance/bulk
// @access  Private/Admin or Staff
const bulkMarkAttendance = asyncHandler(async (req, res) => {
  const { date, attendanceData } = req.body; // attendanceData: [{studentId, status, remarks}]

  const results = [];
  for (const entry of attendanceData) {
    let attendance = await Attendance.findOne({ student: entry.studentId, date });

    if (attendance) {
      attendance.status = entry.status;
      attendance.remarks = entry.remarks;
      attendance.markedBy = req.user._id;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        student: entry.studentId,
        date,
        status: entry.status,
        remarks: entry.remarks,
        markedBy: req.user._id,
      });
    }
    await Student.findByIdAndUpdate(entry.studentId, { status: entry.status });
    results.push(attendance);
  }

  res.json(results);
});

export {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getStudentStats,
  bulkMarkAttendance,
};
