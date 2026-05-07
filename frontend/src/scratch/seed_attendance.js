import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from '../../server/models/attendance.js';
import Student from '../../server/models/student.js';
import User from '../../server/models/user.js';

dotenv.config({ path: '../../.env' });

const seedAttendance = async () => {
  try {
    await mongoose.connect('mongodb://localhost/hostel'); // Using the local DB found in logs

    console.log('MongoDB Connected...');

    const students = await Student.find({});
    const admin = await User.findOne({ role: 'admin' });

    if (!students.length) {
      console.log('No students found to seed attendance.');
      process.exit();
    }

    if (!admin) {
      console.log('No admin user found to use as markedBy.');
      process.exit();
    }

    console.log(`Seeding attendance for ${students.length} students for the last 15 days...`);

    const statuses = ['Present', 'Leave', 'Absent'];

    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      for (const student of students) {
        // Random status for variety
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Update or Create
        await Attendance.findOneAndUpdate(
          { student: student._id, date: dateString },
          {
            student: student._id,
            date: dateString,
            status: randomStatus,
            markedBy: admin._id,
            remarks: 'Sample data seeded'
          },
          { upsert: true, new: true }
        );
      }
      console.log(`Seeded date: ${dateString}`);
    }

    console.log('Attendance seeding complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAttendance();
