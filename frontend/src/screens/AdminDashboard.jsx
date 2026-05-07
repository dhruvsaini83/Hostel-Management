import React, { useEffect } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Loader from "../components/loader";
import Message from "../components/message";
import { listUsers } from "../actions/userActions";
import { listStudents } from "../actions/studentActions";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading: loadingUsers, error: errorUsers, users } = userList;

  const studentList = useSelector((state) => state.studentsList);
  const { loading: loadingStudents, error: errorStudents, students } = studentList || {};

  useEffect(() => {
    dispatch(listUsers());
    dispatch(listStudents());
  }, [dispatch]);

  const totalStudentsCount = students ? students.length : 0;
  const totalStaffCount = users ? users.filter((u) => u.role === "staff").length : 0;
  const pendingApprovalsCount = users ? users.filter((u) => u.role === "student" && u.status === "pending").length : 0;

  const getWeeklyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = [];
    const baseCount = totalStudentsCount || 9;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      
      const present = Math.floor(baseCount * (Math.random() * 0.4 + 0.5));
      const leave = Math.floor((baseCount - present) * Math.random());
      const absent = baseCount - present - leave;
      
      data.push({
        name: `${dayName} (${dateStr})`,
        present,
        leave,
        absent,
      });
    }
    return data;
  };

  const attendanceData = getWeeklyData();

  const roleData = [
    { name: "Students", value: totalStudentsCount },
    { name: "Staff", value: totalStaffCount },
    { name: "Admins", value: users ? users.filter(u => u.role === 'admin').length : 0 },
  ];

  const COLORS = ["#38a169", "#3182ce", "#e53e3e"];

  // Calculate today's mock attendance % based on real student count
  const todayStats = attendanceData[attendanceData.length - 1];
  const todayAttendanceRate = totalStudentsCount > 0 
    ? Math.round((todayStats.present / totalStudentsCount) * 100) 
    : 0;

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      {loadingUsers || loadingStudents ? (
        <Loader />
      ) : errorUsers || errorStudents ? (
        <Message variant="danger">{errorUsers || errorStudents}</Message>
      ) : (
        <>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-primary text-white h-100">
                <Card.Body>
                  <Card.Title>Total Students</Card.Title>
                  <Card.Text className="display-4 font-weight-bold">{totalStudentsCount}</Card.Text>
                  <i className="fas fa-user-graduate fa-2x opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-success text-white h-100">
                <Card.Body>
                  <Card.Title>Total Staff</Card.Title>
                  <Card.Text className="display-4 font-weight-bold">{totalStaffCount}</Card.Text>
                  <i className="fas fa-user-shield fa-2x opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-warning text-white h-100">
                <Card.Body>
                  <Card.Title>Pending Approvals</Card.Title>
                  <Card.Text className="display-4 font-weight-bold">{pendingApprovalsCount}</Card.Text>
                  <i className="fas fa-clock fa-2x opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-info text-white h-100">
                <Card.Body>
                  <Card.Title>Today Attendance</Card.Title>
                  <Card.Text className="display-4 font-weight-bold">{todayAttendanceRate}%</Card.Text>
                  <i className="fas fa-clipboard-check fa-2x opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="mb-4">Weekly Attendance Analytics</Card.Title>
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle'} }} />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36}/>
                        <Bar name="Present (Hostel)" dataKey="present" fill="#38a169" radius={[4, 4, 0, 0]} />
                        <Bar name="On Leave (Home)" dataKey="leave" fill="#3182ce" radius={[4, 4, 0, 0]} />
                        <Bar name="Absent (Outside)" dataKey="absent" fill="#e53e3e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="mb-4">User Roles Distribution</Card.Title>
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={roleData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {roleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
