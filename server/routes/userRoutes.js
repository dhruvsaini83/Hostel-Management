import express from "express";
const router = express.Router();
import {
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
} from "../controllers/userController.js";
import { protect, admin, authorize, checkPermission } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router.post("/staff", protect, admin, createStaff);
router.get("/pending", protect, checkPermission("Student Registration Approval"), getPendingStudents);
router.put("/:id/status", protect, checkPermission("Student Registration Approval"), updateUserStatus);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
