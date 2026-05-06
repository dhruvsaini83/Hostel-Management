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

### 2️⃣ Install Dependencies

Install the backend dependencies (from the root folder):

```bash
npm install
```

Install the frontend dependencies:

```bash
npm install --prefix frontend
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the **root** folder and add the following:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hostelmanagement
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Start the Application

You can start both the backend and frontend concurrently with a single command from the root folder:

```bash
npm run dev
```

- Frontend runs at: `http://localhost:3000`
- Backend runs at: `http://localhost:5000`

---

## 🌱 Optional: Seed Database

If you want to populate the database with dummy data, run the following command from the root folder:

```bash
node server/seeder.js
```

---

## 👤 Author

Dhruv Saini  
MCA Student

---

## 📜 License

This project is open-source and available under the MIT License.
