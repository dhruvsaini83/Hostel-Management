# 🏨 RegiTrack - Hostel Management System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

RegiTrack is a comprehensive, enterprise-grade **Hostel Management System** designed to streamline administrative tasks, enhance security, and provide real-time data insights. Built with the **MERN Stack**, it offers a premium, mobile-responsive experience for Administrators, Staff, and Students.

---

## ✨ Visual Preview

<div align="center">
  <img src="C:\Users\dhruv\.gemini\antigravity\brain\43ab66e1-1170-457d-9a79-933479dc08c4\hostel_dashboard_mockup_1778178906322.png" alt="RegiTrack Dashboard Mockup" width="800">
  <br>
  <em>Premium Dashboard with real-time analytics and Glassmorphism design.</em>
</div>

<br>

<div align="center">
  <img src="C:\Users\dhruv\.gemini\antigravity\brain\43ab66e1-1170-457d-9a79-933479dc08c4\hostel_mobile_mockup_1778178925053.png" alt="RegiTrack Mobile Mockup" width="300">
  <br>
  <em>Mobile-optimized interface for on-the-go management.</em>
</div>

---

## 🚀 Key Features

### 👑 Role-Based Control (RBAC)
- **Admin Dashboard:** Full control over users, staff, and student records. Approve registrations and manage system settings.
- **Staff Dashboard:** Specialized tools for daily attendance, room management, and student check-ins.
- **Student Portal:** Students can view their profile, attendance history, and status in real-time.

### 🛡️ Advanced Security & Validation
- **Secure Authentication:** JWT-based login system with Bcrypt password hashing.
- **Protected Routes:** Middleware-enforced access control ensuring only authorized users reach sensitive data.
- **Data Integrity:** Strict validation for inputs, including 10-digit mobile number checks and email verification.

### 📊 Intelligence & Reporting
- **Dynamic Analytics:** Visual representation of student distribution (Hostel vs. Home vs. Outside).
- **Attendance Tracking:** Daily logs with instant synchronization across all user dashboards.
- **Report Export:** Generate and download comprehensive CSV reports for offline auditing.

### 📱 Premium UI/UX
- **Modern Design:** Glassmorphism elements, sleek transitions, and a curated color palette.
- **Fully Responsive:** Seamless experience across Desktop, Tablet, and Mobile devices.
- **Smart Search:** Lightning-fast, case-insensitive search for students and rooms.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Redux (State Management), React-Bootstrap, Vanilla CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).
- **Authentication:** JSON Web Tokens (JWT).
- **File Uploads:** Multer for profile image management.

---

## 📁 Project Structure

```bash
Hostel-Management/
├── frontend/          # React Single Page Application
│   ├── src/actions    # Redux Actions
│   ├── src/components # Reusable UI Components
│   └── src/screens    # Page-level Views
├── server/            # Node.js & Express REST API
│   ├── controllers    # Request Handlers
│   ├── middleware     # Auth & Error Middleware
│   └── models         # MongoDB Schemas
└── .env               # Environment Configuration
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/dhruvsaini83/Hostel-Management
cd Hostel-Management
```

### 2️⃣ Install Dependencies
```bash
# Install server dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3️⃣ Environment Configuration
Create a `.env` file in the **root** directory and add the following:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 4️⃣ Run the Application
```bash
# Run both Frontend & Backend concurrently
npm run dev
```
- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:3000`

---

## 👥 Author

**Dhruv Saini**  
*MCA Student | Full Stack Developer*  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin)](https://linkedin.com/in/dhruv-saini)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?logo=github)](https://github.com/dhruvsaini83)

---

## 📜 License

This project is open-source and licensed under the **MIT License**.
