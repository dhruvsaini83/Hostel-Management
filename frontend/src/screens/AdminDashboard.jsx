// Import at top was already handled or needs to be fixed.
// I will just rewrite the whole top section to be clean.
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  const userList = useSelector((state) => state.userList);
  const { loading: loadingUsers, error: errorUsers, users } = userList;

  const studentList = useSelector((state) => state.studentsList);
  const { loading: loadingStudents, error: errorStudents, students } = studentList || {};

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listUsers());
    dispatch(listStudents());

    const fetchAnalysis = async () => {
      try {
        setLoadingAnalysis(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get("/attendance/analysis", config);
        setAttendanceData(data);
        setLoadingAnalysis(false);
      } catch (err) {
        console.error("Error fetching analysis", err);
        setLoadingAnalysis(false);
      }
    };

    fetchAnalysis();
  }, [dispatch, userInfo]);

  const totalStudentsCount = students ? students.length : 0;
  const totalStaffCount = users ? users.filter((u) => u.role === "staff").length : 0;
  const pendingApprovalsCount = users ? users.filter((u) => u.role === "student" && u.status === "pending").length : 0;

  const roleData = [
    { name: "Students", value: totalStudentsCount },
    { name: "Staff", value: totalStaffCount },
    { name: "Admins", value: users ? users.filter(u => u.role === 'admin').length : 0 },
  ];

  const COLORS = ["#38a169", "#3182ce", "#e53e3e"];

  // Calculate today's attendance %
  const todayStats = attendanceData.length > 0 ? attendanceData[attendanceData.length - 1] : null;
  const todayAttendanceRate = (totalStudentsCount > 0 && todayStats) 
    ? Math.round((todayStats.present / totalStudentsCount) * 100) 
    : 0;

  return (
    <Container className="py-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="font-weight-bold text-dark">Admin Dashboard</h1>
        <Badge variant="light" className="text-muted p-2 shadow-sm border">
          <i className="far fa-calendar-alt mr-2"></i>
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
        </Badge>
      </div>

      {loadingUsers || loadingStudents || loadingAnalysis ? (
        <Loader />
      ) : errorUsers || errorStudents ? (
        <Message variant="danger">{errorUsers || errorStudents}</Message>
      ) : (
        <>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-primary text-white h-100 premium-card">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="small opacity-75 mb-1 uppercase font-weight-bold">Total Students</div>
                  <div className="display-4 font-weight-bold mb-2">{totalStudentsCount}</div>
                  <div className="mt-auto"><i className="fas fa-user-graduate opacity-50"></i></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-success text-white h-100 premium-card">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="small opacity-75 mb-1 uppercase font-weight-bold">Total Staff</div>
                  <div className="display-4 font-weight-bold mb-2">{totalStaffCount}</div>
                  <div className="mt-auto"><i className="fas fa-user-shield opacity-50"></i></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-warning text-white h-100 premium-card">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="small opacity-75 mb-1 uppercase font-weight-bold">Pending Approvals</div>
                  <div className="display-4 font-weight-bold mb-2">{pendingApprovalsCount}</div>
                  <div className="mt-auto"><i className="fas fa-clock opacity-50"></i></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="text-center shadow-sm border-0 bg-info text-white h-100 premium-card">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="small opacity-75 mb-1 uppercase font-weight-bold">Today Attendance</div>
                  <div className="display-4 font-weight-bold mb-2">{todayAttendanceRate}%</div>
                  <div className="mt-auto"><i className="fas fa-clipboard-check opacity-50"></i></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8} className="mb-4">
              <Card className="shadow-sm border-0 rounded-lg overflow-hidden">
                <Card.Header className="bg-white border-0 pt-4 px-4">
                   <h5 className="font-weight-bold mb-0">Weekly Attendance Trends</h5>
                   <p className="text-muted small">Real-time presence analytics for the last 7 days</p>
                </Card.Header>
                <Card.Body className="p-4">
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Bar name="Present (Hostel)" dataKey="present" fill="#38a169" radius={[6, 6, 0, 0]} barSize={25} />
                        <Bar name="On Leave (Home)" dataKey="leave" fill="#3182ce" radius={[6, 6, 0, 0]} barSize={25} />
                        <Bar name="Absent (Outside)" dataKey="absent" fill="#e53e3e" radius={[6, 6, 0, 0]} barSize={25} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm border-0 rounded-lg overflow-hidden">
                <Card.Header className="bg-white border-0 pt-4 px-4">
                   <h5 className="font-weight-bold mb-0">User Distribution</h5>
                   <p className="text-muted small">By Role</p>
                </Card.Header>
                <Card.Body className="p-4">
                  <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={roleData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {roleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" />
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
