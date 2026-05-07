import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/loader";
import Message from "../components/message";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Since Student model and User model are separate, we might need the student record ID.
  // For now, let's assume we can fetch stats by some means, or we need to find the student ID first.

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // First get student profile to get student ID
        // Note: In a real app, you'd probably link these better or have a 'me' endpoint
        const { data: profiles } = await axios.get("/student/all", config);
        const myProfile = profiles.students.find(s => s.name === userInfo.name); // Simple match for now

        if (myProfile) {
          const { data: attendanceStats } = await axios.get(`/attendance/stats/${myProfile._id}`, config);
          setStats(attendanceStats);
        } else {
          setError("Student profile not found. Please contact admin.");
        }
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo]);

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h1>Welcome, {userInfo.name}</h1>
          <p className="text-muted">Here is your attendance and leave summary.</p>
        </Col>
        <Col md={4} className="text-right">
           <div className="p-3 bg-light rounded shadow-sm">
              <h5 className="mb-0 text-primary">Attendance Score</h5>
              <h2 className="mb-0 font-weight-bold">{stats ? stats.percentage : 0}%</h2>
           </div>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-success h-100">
                <Card.Body>
                  <Card.Title className="text-success font-weight-bold">Total Present</Card.Title>
                  <Card.Text className="display-4">{stats.present}</Card.Text>
                  <i className="fas fa-check-circle fa-2x text-success opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-danger h-100">
                <Card.Body>
                  <Card.Title className="text-danger font-weight-bold">Total Absent</Card.Title>
                  <Card.Text className="display-4">{stats.absent}</Card.Text>
                  <i className="fas fa-times-circle fa-2x text-danger opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-warning h-100">
                <Card.Body>
                  <Card.Title className="text-warning font-weight-bold">On Leave</Card.Title>
                  <Card.Text className="display-4">{stats.leave}</Card.Text>
                  <i className="fas fa-calendar-minus fa-2x text-warning opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-primary h-100">
                <Card.Body>
                  <Card.Title className="text-primary font-weight-bold">Total Days</Card.Title>
                  <Card.Text className="display-4">{stats.total}</Card.Text>
                  <i className="fas fa-calendar-alt fa-2x text-primary opacity-50"></i>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="mb-4">Attendance Trends (Last 15 Records)</Card.Title>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={[...stats.history.slice(0, 15)].reverse()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{fontSize: 10}} />
                        <YAxis hide />
                        <Tooltip />
                        <Line 
                           type="monotone" 
                           dataKey="status" 
                           stroke="#007bff" 
                           strokeWidth={3}
                           dot={{ r: 5, fill: '#007bff' }}
                           activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title className="mb-4">Recent Records</Card.Title>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <Table hover size="sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.history.slice(0, 15).map((record, index) => (
                          <tr key={index}>
                            <td>{record.date}</td>
                            <td>
                              <span className={`badge badge-${record.status === 'Present' ? 'success' : record.status === 'Absent' ? 'danger' : 'warning'}`}>
                                {record.status === 'Present' ? 'In Hostel' : record.status === 'Leave' ? 'At Home' : 'Outside'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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

export default StudentDashboard;
