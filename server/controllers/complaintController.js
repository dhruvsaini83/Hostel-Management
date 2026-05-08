import asyncHandler from "express-async-handler";
import Complaint from "../models/complaint.js";
import Notification from "../models/notification.js";

// @desc    Create a new complaint
// @route   POST /complaints
// @access  Private/Student
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, roomNo, image } = req.body;

  const complaint = await Complaint.create({
    student: req.user._id,
    title,
    description,
    category,
    roomNo,
    image,
  });

  if (complaint) {
    res.status(201).json(complaint);
  } else {
    res.status(400);
    throw new Error("Invalid complaint data");
  }
});

// @desc    Get logged in student complaints
// @route   GET /complaints/my
// @access  Private/Student
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(complaints);
});

// @desc    Get all complaints for admin/staff
// @route   GET /complaints
// @access  Private/Admin/Staff
const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({})
    .populate("student", "name email")
    .sort({ createdAt: -1 });
  res.json(complaints);
});

// @desc    Update complaint status
// @route   PUT /complaints/:id
// @access  Private/Admin/Staff
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (complaint) {
    const { status, adminComment } = req.body;
    complaint.status = status || complaint.status;
    complaint.adminComment = adminComment || complaint.adminComment;

    const updatedComplaint = await complaint.save();

    // Create notification (broadcast to students for now, as model is broadcast-based)
    await Notification.create({
      sender: req.user._id,
      target: "student",
      title: `Complaint Update: ${complaint.title}`,
      message: `Complaint for Room ${complaint.roomNo} has been updated to ${status}. ${adminComment ? `Admin Note: ${adminComment}` : ""}`,
    });

    res.json(updatedComplaint);
  } else {
    res.status(404);
    throw new Error("Complaint not found");
  }
});

export { createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus };
