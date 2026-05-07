import dotenv from "dotenv";
import students from "./data/students.js";
import Student from "./models/student.js";
import User from "./models/user.js";
import Attendance from "./models/attendance.js";
import Leave from "./models/leave.js";
import connectDB from "./config/mongoDBConfig.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Student.deleteMany();
    await User.deleteMany();
    await Attendance.deleteMany();
    await Leave.deleteMany();

    // Create Super Admin
    await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin123", // Will be hashed by pre-save hook
      role: "admin",
      status: "approved",
      isAdmin: true,
    });

    if (students && students.length > 0) {
      await Student.insertMany(students);
    }

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Student.deleteMany();
    await User.deleteMany();
    await Attendance.deleteMany();
    await Leave.deleteMany();
    
    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
