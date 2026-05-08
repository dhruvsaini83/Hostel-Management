import express from "express";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import path from "path";
import morgan from "morgan";

import dotenv from "dotenv";
import connectDB from "./config/mongoDBConfig.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
dotenv.config();
// Connect to database
connectDB();
// Initialize express app
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Define API routes
app.use("/users", userRoutes);
app.use("/student", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/leave", leaveRoutes);
app.use("/notifications", notificationRoutes);
app.use("/grievances", grievanceRoutes);
app.use("/complaints", complaintRoutes);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
// Custom error handling
app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

// Start backend server
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
