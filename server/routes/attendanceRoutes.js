import express from "express";
import {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getStudentStats,
  bulkMarkAttendance,
} from "../controllers/attendanceController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, checkPermission("Manage Attendance"), markAttendance);

router.route("/bulk")
  .post(protect, checkPermission("Manage Attendance"), bulkMarkAttendance);

router.route("/student/:studentId")
  .get(protect, getStudentAttendance);

router.route("/stats/:studentId")
  .get(protect, getStudentStats);

router.route("/date/:date")
  .get(protect, checkPermission("View Students"), getAttendanceByDate);

export default router;
