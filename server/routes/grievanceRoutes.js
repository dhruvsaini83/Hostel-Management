import express from "express";
const router = express.Router();
import {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  updateGrievanceStatus,
} from "../controllers/grievanceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, createGrievance).get(protect, admin, getAllGrievances);
router.route("/my").get(protect, getMyGrievances);
router.route("/:id").put(protect, admin, updateGrievanceStatus);

export default router;
