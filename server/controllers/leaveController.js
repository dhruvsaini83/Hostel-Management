import asyncHandler from "express-async-handler";
import Leave from "../models/leave.js";
import Student from "../models/student.js";

// @desc    Apply for leave
// @route   POST /api/leave
// @access  Private/Student
const applyLeave = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body;

  // Find student record for this user
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const leave = await Leave.create({
    student: student._id,
    user: req.user._id,
    startDate,
    endDate,
    reason,
  });

  res.status(201).json(leave);
});

// @desc    Get leave history for a student
// @route   GET /api/leave/my
// @access  Private/Student
const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(leaves);
});

// @desc    Get all leave requests
// @route   GET /api/leave
// @access  Private/Admin or Staff with permission
const getAllLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({})
    .populate("student", "name roomNo")
    .sort({ createdAt: -1 });
  res.json(leaves);
});

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leave/:id
// @access  Private/Admin or Staff with permission
const updateLeaveStatus = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);

  if (leave) {
    leave.status = req.body.status || leave.status;
    leave.approvedBy = req.user._id;
    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } else {
    res.status(404);
    throw new Error("Leave request not found");
  }
});

export {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
};
