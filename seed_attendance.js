import mongoose from 'mongoose';
import Attendance from './server/models/attendance.js';
import Student from './server/models/student.js';
import User from './server/models/user.js';

const seedAttendance = async () => {
  try {
    // Attempting to connect to local MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/hostelmanagement', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('MongoDB Connected to "hostel" database...');

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

    console.log(`Found ${students.length} students. Seeding 15 days of data...`);

    const statuses = ['Present', 'Leave', 'Absent'];

    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      for (const student of students) {
        // Random status for variety
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        await Attendance.findOneAndUpdate(
          { student: student._id, date: dateString },
          {
            student: student._id,
            date: dateString,
            status: randomStatus,
            markedBy: admin._id,
            remarks: 'Sample data seeded for testing'
          },
          { upsert: true, new: true }
        );
      }
      console.log(`Done seeding: ${dateString}`);
    }

    console.log('✅ 15 days of attendance seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedAttendance();
