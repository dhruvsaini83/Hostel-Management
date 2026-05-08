import mongoose from 'mongoose';
import Attendance from './server/models/attendance.js';
import Student from './server/models/student.js';
import User from './server/models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelmanagement';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log('Creating 10 sample students...');
    const studentsData = [];
    const blocks = ['A', 'B', 'C'];
    const courses = ['MCA', 'BCA', 'B.Tech', 'MBA'];

    for (let i = 1; i <= 10; i++) {
      const studentId = `ST-${Math.floor(10000 + Math.random() * 90000)}`;
      studentsData.push({
        user: admin._id,
        studentId,
        name: `Sample Student ${i}`,
        email: `student${i}@example.com`,
        contact: `987654321${i-1}`,
        fatherContact: `999888777${i-1}`,
        address: `${i * 10} Main Street`,
        city: 'Sample City',
        course: courses[i % courses.length],
        roomNo: `${100 + i}`,
        blockNo: blocks[i % blocks.length],
        status: 'Hostel',
        image: `https://i.pravatar.cc/150?u=student${i}`
      });
    }

    const createdStudents = await Student.insertMany(studentsData);
    console.log(`✅ Added ${createdStudents.length} students.`);

    console.log('Seeding 15 days of attendance for these students...');
    const statuses = ['Present', 'Leave', 'Absent'];

    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Using localized YYYY-MM-DD format as fixed in the main code
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      for (const student of createdStudents) {
        // Randomly assign status, but weighted towards 'Present'
        const r = Math.random();
        const status = r > 0.3 ? 'Present' : (r > 0.1 ? 'Leave' : 'Absent');
        
        await Attendance.create({
          student: student._id,
          date: dateString,
          status: status,
          markedBy: admin._id,
          remarks: 'Sample attendance'
        });
      }
      console.log(`- Seeded: ${dateString}`);
    }

    console.log('✅ 10 students and 15 days of attendance seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
