import asyncHandler from "express-async-handler";
import Attendance from "../models/attendance.js";
import Student from "../models/student.js";

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private/Admin or Staff with permission
// Mark daily attendance
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
// Fetch student history
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
// Calculate attendance percentage
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
// Mark multiple records
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

// @desc    Get attendance analysis for last 7 days
// @route   GET /api/attendance/analysis
// @access  Private/Admin
// Get 7-day analytics
const getAttendanceAnalysis = asyncHandler(async (req, res) => {
  const days = [];
  const results = [];
  
  // Get last 7 days dates
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    days.push(`${year}-${month}-${day}`);
  }

  for (const date of days) {
    const present = await Attendance.countDocuments({ date, status: "Present" });
    const leave = await Attendance.countDocuments({ date, status: "Leave" });
    const absent = await Attendance.countDocuments({ date, status: "Absent" });
    
    const d = new Date(date);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const label = `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;

    results.push({
      name: label,
      present,
      leave,
      absent,
      date
    });
  }

  res.json(results);
});

// @desc    Get detailed attendance analysis for a specific date
// @route   POST /api/attendance/getAnalysis
// @access  Private/Admin
const getAnalysisByDate = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const attendanceList = await Attendance.find({ date }).populate("student", "name contact roomNo blockNo");
  
  const dataMap = {};
  const detailsMap = {};
  
  attendanceList.forEach(a => {
    if (a.student) {
      // Map backend statuses to frontend expected statuses
      const status = a.status === "Present" ? "Hostel" : a.status === "Absent" ? "Outside" : "Home";
      dataMap[a.student._id] = status;
      detailsMap[a.student._id] = a.student;
    }
  });

  res.json({
    data: dataMap,
    details: detailsMap
  });
});

export {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getStudentStats,
  bulkMarkAttendance,
  getAttendanceAnalysis,
  getAnalysisByDate,
};
