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
import BroadcastForm from "../components/broadcastForm";

const AdminDashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const dispatch = useDispatch();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [pendingGrievancesCount, setPendingGrievancesCount] = useState(0);
  const [pendingComplaintsCount, setPendingComplaintsCount] = useState(0);

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
        
        // Fetch Grievances count
        const { data: grievances } = await axios.get("/grievances", config);
        const pendingG = grievances.filter(g => g.status === 'Pending').length;
        setPendingGrievancesCount(pendingG);

        // Fetch Complaints count
        const { data: complaints } = await axios.get("/complaints", config);
        const pendingC = complaints.filter(c => c.status === 'Pending').length;
        setPendingComplaintsCount(pendingC);

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

          <Row className="mt-2 mb-4">
            <Col md={6}>
              <Card className="shadow-sm border-0 bg-light premium-card h-100" style={{ cursor: 'pointer' }} onClick={() => window.location.href = "/admin/grievances"}>
                <Card.Body className="d-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                      <h6 className="font-weight-bold mb-0">Attendance Grievances</h6>
                      <p className="small text-muted mb-0">Review correction requests.</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {pendingGrievancesCount > 0 && (
                      <Badge variant="danger" pill className="mr-2 px-3 py-2 animate-pulse">
                        {pendingGrievancesCount} New
                      </Badge>
                    )}
                    <i className="fas fa-chevron-right text-muted"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0 bg-light premium-card h-100" style={{ cursor: 'pointer' }} onClick={() => window.location.href = "/admin/complaints"}>
                <Card.Body className="d-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-tools"></i>
                    </div>
                    <div>
                      <h6 className="font-weight-bold mb-0">Complaints & Maintenance</h6>
                      <p className="small text-muted mb-0">Manage student tickets.</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {pendingComplaintsCount > 0 && (
                      <Badge variant="danger" pill className="mr-2 px-3 py-2 animate-pulse">
                        {pendingComplaintsCount} New
                      </Badge>
                    )}
                    <i className="fas fa-chevron-right text-muted"></i>
                  </div>
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
                <Card.Body className="p-2 p-md-4">
                  <div style={{ width: "100%", height: isMobile ? 250 : 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={attendanceData} margin={isMobile ? { top: 10, right: 10, left: -20, bottom: 0 } : {}}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{fontSize: isMobile ? 10 : 12}} axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: isMobile ? 10 : 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: isMobile ? '10px' : '14px' }} />
                        <Bar name="Present" dataKey="present" fill="#38a169" radius={[4, 4, 0, 0]} barSize={isMobile ? 15 : 25} />
                        <Bar name="Leave" dataKey="leave" fill="#3182ce" radius={[4, 4, 0, 0]} barSize={isMobile ? 15 : 25} />
                        <Bar name="Absent" dataKey="absent" fill="#e53e3e" radius={[4, 4, 0, 0]} barSize={isMobile ? 15 : 25} />
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
                <Card.Body className="p-2 p-md-4">
                  <div style={{ width: "100%", height: isMobile ? 250 : 350 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={roleData}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 50 : 70}
                          outerRadius={isMobile ? 70 : 90}
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
                        <Legend iconType="circle" wrapperStyle={{ fontSize: isMobile ? '10px' : '14px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <BroadcastForm />
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
