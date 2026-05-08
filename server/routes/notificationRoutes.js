import express from "express";
const router = express.Router();
import {
  createNotification,
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { protect, admin, checkPermission } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, checkPermission("Send Broadcast"), createNotification)
  .get(protect, getNotifications);

router.route("/:id/read").put(protect, markAsRead);

export default router;
