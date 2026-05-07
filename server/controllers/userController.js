import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/user.js";
import Student from "../models/student.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.status !== "approved" && user.role !== "admin") {
      res.status(403);
      throw new Error("Your account is pending approval. Please wait for an admin to approve it.");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      status: user.status,
      image: user.image,
      isAdmin: user.role === "admin",
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user (student)
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, address, course, city, fatherContact, roomNo, blockNo } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  if (mobile && mobile.length !== 10) {
    res.status(400);
    throw new Error("Mobile number must be exactly 10 digits");
  }

  if (fatherContact && fatherContact.length !== 10) {
    res.status(400);
    throw new Error("Father's contact number must be exactly 10 digits");
  }

  const user = await User.create({
    name,
    email,
    password,
    mobile,
    role: "student",
    status: "pending",
    registrationDetails: {
      address,
      course,
      city,
      fatherContact,
      roomNo,
      blockNo,
    },
  });

  if (user) {
    res.status(201).json({
      message: "Registration successful. Please wait for admin approval.",
      status: user.status,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Create staff account (Admin only)
// @route   POST /api/users/staff
// @access  Private/Admin
const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, permissions } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    mobile,
    role: "staff",
    permissions: permissions || [],
    status: "approved", // Staff created by admin are approved by default
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
  } else {
    res.status(400);
    throw new Error("Invalid staff data");
  }
});

// @desc    Get all pending student registrations
// @route   GET /api/users/pending
// @access  Private/Admin or Staff with permission
const getPendingStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student", status: "pending" });
  res.json(students);
});

// @desc    Approve/Reject user registration
// @route   PUT /api/users/:id/status
// @access  Private/Admin or Staff with permission
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const oldStatus = user.status;
    user.status = req.body.status || user.status;
    const updatedUser = await user.save();

    // If newly approved, create student record
    if (user.role === "student" && oldStatus === "pending" && updatedUser.status === "approved" && user.registrationDetails) {
      const { address, course, city, fatherContact, roomNo, blockNo } = user.registrationDetails;
      
      // Check if student record already exists to avoid duplicates
      const studentExists = await Student.findOne({ user: user._id });
      if (!studentExists) {
        // Generate unique student ID (e.g., ST-12345)
        const studentId = `ST-${Math.floor(10000 + Math.random() * 90000)}`;
        
        await Student.create({
          user: user._id,
          studentId,
          email: user.email,
          name: user.name,
          address,
          course,
          city,
          contact: user.mobile,
          fatherContact,
          roomNo,
          blockNo,
          image: "https://via.placeholder.com/150", // Default image
          status: "Hostel", // Default hostel status
        });
      }
    }

    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      status: user.status,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.image = req.body.image || user.image;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // If student, sync image with Student model
    if (user.role === 'student' && req.body.image) {
      await Student.findOneAndUpdate(
        { user: user._id },
        { image: req.body.image }
      );
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      image: updatedUser.image,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.email === 'admin@gmail.com') {
      res.status(400);
      throw new Error("Super Admin account cannot be deleted");
    }
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.email === 'admin@gmail.com' && req.user.email !== 'admin@gmail.com') {
        res.status(400);
        throw new Error("Only Super Admin can modify their own account");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.permissions = req.body.permissions !== undefined ? req.body.permissions : user.permissions;
    user.status = req.body.status || user.status;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  createStaff,
  getPendingStudents,
  updateUserStatus,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
