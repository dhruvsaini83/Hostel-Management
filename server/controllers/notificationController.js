import asyncHandler from "express-async-handler";
import Notification from "../models/notification.js";

// @desc    Create a new broadcast notification
// @route   POST /notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, target } = req.body;

  const notification = await Notification.create({
    title,
    message,
    target,
    sender: req.user._id,
  });

  if (notification) {
    res.status(201).json(notification);
  } else {
    res.status(400);
    throw new Error("Invalid notification data");
  }
});

// @desc    Get notifications for logged in user
// @route   GET /notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  // Find notifications where target is 'all' or matches user role
  const notifications = await Notification.find({
    $or: [{ target: "all" }, { target: req.user.role }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name");

  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }
    res.json({ message: "Notification marked as read" });
  } else {
    res.status(404);
    throw new Error("Notification not found");
  }
});

export { createNotification, getNotifications, markAsRead };
