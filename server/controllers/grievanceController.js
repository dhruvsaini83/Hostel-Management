import asyncHandler from "express-async-handler";
import Grievance from "../models/grievance.js";
import Attendance from "../models/attendance.js";
import Student from "../models/student.js";

// @desc    Create a new grievance
// @route   POST /grievances
// @access  Private/Student
const createGrievance = asyncHandler(async (req, res) => {
  const { date, correctStatus, reason, proof } = req.body;

  const grievance = await Grievance.create({
    student: req.user._id,
    date,
    correctStatus,
    reason,
    proof,
  });

  if (grievance) {
    res.status(201).json(grievance);
  } else {
    res.status(400);
    throw new Error("Invalid grievance data");
  }
});

// @desc    Get logged in user grievances
// @route   GET /grievances/my
// @access  Private/Student
const getMyGrievances = asyncHandler(async (req, res) => {
  const grievances = await Grievance.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(grievances);
});

// @desc    Get all grievances for admin
// @route   GET /grievances
// @access  Private/Admin
const getAllGrievances = asyncHandler(async (req, res) => {
  const grievances = await Grievance.find({})
    .populate("student", "name email")
    .sort({ createdAt: -1 });
  res.json(grievances);
});

// @desc    Update grievance status
// @route   PUT /grievances/:id
// @access  Private/Admin
const updateGrievanceStatus = asyncHandler(async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);

  if (grievance) {
    const { status, adminComment } = req.body;
    grievance.status = status || grievance.status;
    grievance.adminComment = adminComment || grievance.adminComment;

    const updatedGrievance = await grievance.save();

    // If approved, update the attendance record
    if (status === "Approved") {
      // Find the student profile linked to this user
      const studentProfile = await Student.findOne({ user: grievance.student });

      if (studentProfile) {
        const attendance = await Attendance.findOne({
          student: studentProfile._id,
          date: grievance.date,
        });

        if (attendance) {
          attendance.status = grievance.correctStatus;
          await attendance.save();
        } else {
          // If no attendance record exists, create one
          await Attendance.create({
            student: studentProfile._id,
            date: grievance.date,
            status: grievance.correctStatus,
            markedBy: req.user._id, // Admin who approved
            remarks: `Approved via Grievance: ${grievance.reason}`
          });
        }

        // Sync the current status on the Student profile as well
        studentProfile.status = grievance.correctStatus;
        await studentProfile.save();
      }
    }

    res.json(updatedGrievance);
  } else {
    res.status(404);
    throw new Error("Grievance not found");
  }
});

export { createGrievance, getMyGrievances, getAllGrievances, updateGrievanceStatus };
