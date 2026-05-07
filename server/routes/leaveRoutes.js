import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { protect, checkPermission, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, authorize("student"), applyLeave)
  .get(protect, checkPermission("Leave Management"), getAllLeaves);

router.get("/my", protect, authorize("student"), getMyLeaves);

router.route("/:id")
  .put(protect, checkPermission("Leave Management"), updateLeaveStatus);

export default router;
