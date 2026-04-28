# 🏨 Hostel Management System

A simple Hostel Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

This project helps manage hostel activities like student records and attendance in a digital way.

---

## 📌 Features

- User Login & Authentication (JWT)
- Add / Update / Delete Students
- Attendance Management
- Admin Dashboard
- Pagination for student list
- Protected Routes

---

## 🛠 Tech Stack

- Frontend: React.js, Redux, Bootstrap
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

---

## 📁 Project Structure

```
Hostel-Management/
├── frontend/   → React application
├── server/     → Backend API (Node + Express)
```

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dhruvsaini83/Hostel-Management
cd Hostel-Management
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside `server/`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hostelmanagement
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm start server
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🌱 Optional: Seed Database

```bash
cd server
node seeder.js
```

---

## 👤 Author

Dhruv Saini  
MCA Student

---

## 📜 License

This project is open-source and available under the MIT License.
