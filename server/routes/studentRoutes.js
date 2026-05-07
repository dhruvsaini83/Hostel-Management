import express from "express";
import {
  addStudent,
  deleteStudent,
  getStudents,
  getStudentById,
  updateStudentProfile,
  getStudentByRoomNo,
  getAttendanceList,
} from "../controllers/studentController.js";
import { protect, checkPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/all").get(protect, getStudents);
router.route("/attendance/list").get(protect, checkPermission("Manage Attendance"), getAttendanceList);
router.route("/addStudent").post(protect, checkPermission("Add Students"), addStudent);

router
  .route("/:id")
  .get(protect, getStudentById)
  .delete(protect, checkPermission("Edit Students"), deleteStudent)
  .put(protect, checkPermission("Edit Students"), updateStudentProfile);

router.route("/room/:roomId").get(protect, checkPermission("Manage Attendance"), getStudentByRoomNo);

export default router;
