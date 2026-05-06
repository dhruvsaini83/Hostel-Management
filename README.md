# 🏨 RegiTrack - Premium Hostel Management System

RegiTrack is a modern, enterprise-grade Hostel Management System built with the MERN stack. It features a premium UI/UX, advanced security, and seamless cross-device synchronization designed for efficient hostel administration.

---

## 🚀 Key Features

### 💎 Premium UI/UX
- **Modern Dashboard:** Intuitive analysis with progress bars and metric cards.
- **Glassmorphism Design:** Beautiful semi-transparent mobile navigation and dropdowns.
- **Micro-Animations:** Smooth fade-in transitions and hover effects.
- **Responsive Layout:** Perfectly optimized for Desktop, Tablet, and Mobile devices.

### 🛡️ Advanced Security
- **Secure Admin Gates:** Admin-only routes for sensitive data like user management and student records.
- **JWT Authentication:** Robust token-based authentication system.
- **Protected Routes:** Unauthorized users are automatically redirected to secure login screens.

### ⚙️ Core Functionality
- **Attendance Management:** Daily tracking with real-time synchronization between modules.
- **Student Profiles:** Detailed student records with automated status updates.
- **Data Analysis:** Visual reports on student locations (Hostel, Home, Outside).
- **Export Reports:** One-click CSV downloads for offline record-keeping.
- **Smart Search:** Case-insensitive searching for rooms and students.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Redux (State Management), React-Bootstrap, Vanilla CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).
- **Security:** JSON Web Tokens (JWT), Bcrypt password hashing.

---

## 📁 Project Structure

```
Hostel-Management/
├── frontend/   → Modern React SPA
├── server/     → Robust REST API (Node + Express)
```

---

## ⚙️ Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/dhruvsaini83/Hostel-Management
cd Hostel-Management
```

### 2️⃣ Install Dependencies
```bash
npm install
npm install --prefix frontend
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the **root** folder:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hostelmanagement
JWT_SECRET=your_secret_key
```

### 4️⃣ Launch System
```bash
npm run dev
```
- Access System: `http://localhost:3000`

---

## 👤 Author

**Dhruv Saini**  
*MCA Student | Full Stack Developer*

---

## 📜 License
This project is open-source and available under the MIT License.
