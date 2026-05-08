import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [studentProfile, setStudentProfile] = useState(null);

  // Download Report State
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [toDate, setToDate] = useState(new Date());
  const [csvData, setCsvData] = useState([]);
  const [isPreparingCsv, setIsPreparingCsv] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        const { data: profiles } = await axios.get("/student/all", config);
        const myProfile = profiles.students.find(s => s.name === userInfo.name);

        if (myProfile) {
          setStudentProfile(myProfile);
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

  const handlePrepareDownload = async () => {
    setIsPreparingCsv(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/attendance/student/${studentProfile._id}`, config);
      
      const start = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-${String(fromDate.getDate()).padStart(2, '0')}`;
      const end = `${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}`;
      
      const filteredRecords = data.filter(record => {
        return record.date >= start && record.date <= end;
      });

      const reportRows = [
        ["MY ATTENDANCE REPORT", ""],
        ["Name", studentProfile.name],
        ["Student ID", studentProfile.studentId || "N/A"],
        ["Room/Block", `${studentProfile.roomNo} / ${studentProfile.blockNo}`],
        ["Report Range", `${formatDate(start)} to ${formatDate(end)}`],
        ["", ""],
        ["DATE", "STATUS", "MARKED BY", "REMARKS"]
      ];

      filteredRecords.forEach(record => {
        reportRows.push([
          formatDate(record.date),
          record.status === "Present" ? "In Hostel" : record.status === "Leave" ? "At Home" : "Outside",
          record.markedBy ? record.markedBy.name : "System",
          record.remarks || ""
        ]);
      });

      setCsvData(reportRows);
    } catch (err) {
      alert("Error preparing report: " + err.message);
    }
    setIsPreparingCsv(false);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col md={7}>
          <h1 className="font-weight-bold text-primary">Welcome, {userInfo.name}</h1>
          <p className="text-muted">Review your attendance performance and download reports.</p>
        </Col>
        <Col md={5} className="d-flex justify-content-end align-items-center">
           <Button 
             variant="light" 
             className="mr-2 rounded-pill px-4 shadow-sm border"
             onClick={() => setShowDownloadModal(true)}
           >
             <i className="fas fa-file-download mr-2 text-primary"></i> <span className="text-primary font-weight-bold">Download Report</span>
           </Button>
           <div className="d-flex flex-wrap align-items-center">
             <Button 
               variant="outline-danger" 
               className="mr-2 rounded-pill px-4 shadow-sm mb-2"
               onClick={() => window.location.href = "/grievances"}
             >
               <i className="fas fa-exclamation-circle mr-1"></i> <span className="font-weight-bold">Report Issue</span>
             </Button>
             <Button 
               variant="outline-primary" 
               className="mr-3 rounded-pill px-4 shadow-sm mb-2"
               onClick={() => window.location.href = "/complaints"}
             >
               <i className="fas fa-tools mr-1"></i> <span className="font-weight-bold">Complaints</span>
             </Button>
           </div>
           <div className="p-2 bg-white text-primary rounded-lg shadow-sm text-center border" style={{ minWidth: '120px' }}>
              <div className="small text-muted font-weight-bold uppercase">Score</div>
              <div className="h3 mb-0 font-weight-bold">{stats ? stats.percentage : 0}%</div>
           </div>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="fade-in">
          <Row>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-success h-100 bg-white">
                <Card.Body>
                  <Card.Title className="text-secondary small uppercase font-weight-bold mb-1">In Hostel</Card.Title>
                  <Card.Text className="h1 font-weight-bold text-success mb-0">{stats.present}</Card.Text>
                  <div className="small text-muted">Days</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-warning h-100 bg-white">
                <Card.Body>
                  <Card.Title className="text-secondary small uppercase font-weight-bold mb-1">At Home</Card.Title>
                  <Card.Text className="h1 font-weight-bold text-warning mb-0">{stats.leave}</Card.Text>
                  <div className="small text-muted">Days</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-danger h-100 bg-white">
                <Card.Body>
                  <Card.Title className="text-secondary small uppercase font-weight-bold mb-1">Outside</Card.Title>
                  <Card.Text className="h1 font-weight-bold text-danger mb-0">{stats.absent}</Card.Text>
                  <div className="small text-muted">Days</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="text-center shadow-sm border-0 border-left-primary h-100 bg-white">
                <Card.Body>
                  <Card.Title className="text-secondary small uppercase font-weight-bold mb-1">Total Days</Card.Title>
                  <Card.Text className="h1 font-weight-bold text-primary mb-0">{stats.total}</Card.Text>
                  <div className="small text-muted">Tracked</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={8} className="mb-4">
              <Card className="shadow-sm border-0 rounded-lg">
                <Card.Body>
                  <Card.Title className="mb-4 d-flex justify-content-between align-items-center">
                    <span className="font-weight-bold"><i className="fas fa-chart-line mr-2 text-primary"></i> Attendance Trends</span>
                    <Badge variant="light" pill className="text-muted">Last 15 Records</Badge>
                  </Card.Title>
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <LineChart 
                        data={[...stats.history.slice(0, 15)].reverse().map(item => ({
                          ...item,
                          statusValue: item.status === "Present" ? 2 : item.status === "Leave" ? 1 : 0
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tick={{fontSize: 10}} />
                        <YAxis domain={[0, 2]} ticks={[0, 1, 2]} hide />
                        <Tooltip 
                          formatter={(value, name, props) => {
                            const status = props.payload.status;
                            return [status === "Present" ? "In Hostel" : status === "Leave" ? "At Home" : "Outside", "Status"];
                          }}
                        />
                        <Line 
                           type="monotone" 
                           dataKey="statusValue" 
                           stroke="#dee2e6" 
                           strokeWidth={3}
                           dot={(props) => {
                             const { cx, cy, payload } = props;
                             const color = payload.status === "Present" ? "#38a169" : payload.status === "Leave" ? "#b7791f" : "#e53e3e";
                             return (
                               <circle cx={cx} cy={cy} r={6} fill={color} stroke="white" strokeWidth={2} />
                             );
                           }}
                           activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="shadow-sm border-0 h-100 rounded-lg">
                <Card.Body className="p-0">
                  <div className="p-3 border-bottom font-weight-bold">
                    <i className="fas fa-history mr-2 text-primary"></i> Recent Records (15 Days)
                  </div>
                  <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                    <Table hover className="mb-0">
                      <thead className="bg-light small">
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.history.slice(0, 15).map((record, index) => (
                          <tr key={index}>
                            <td className="small font-weight-bold text-muted">{record.date}</td>
                            <td>
                              <Badge 
                                pill
                                style={{
                                  backgroundColor: record.status === 'Present' ? '#f0fff4' : record.status === 'Leave' ? '#fffaf0' : '#fff5f5',
                                  color: record.status === 'Present' ? '#38a169' : record.status === 'Leave' ? '#b7791f' : '#e53e3e',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {record.status === 'Present' ? 'In Hostel' : record.status === 'Leave' ? 'At Home' : 'Outside'}
                              </Badge>
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
        </div>
      )}

      {/* Download Attendance Modal */}
      <Modal 
        show={showDownloadModal} 
        onHide={() => {
          setShowDownloadModal(false);
          setCsvData([]);
        }} 
        centered
      >
        <Modal.Header closeButton className="bg-white border-bottom-0">
          <Modal.Title className="text-primary font-weight-bold">
            <i className="fas fa-file-download mr-2"></i> Download My Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-muted mb-4">Select the date range for your attendance report.</p>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label className="font-weight-bold small uppercase text-muted">From Date</Form.Label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => {
                    setFromDate(date);
                    setCsvData([]);
                  }}
                  className="form-control premium-input"
                  dateFormat="dd/MM/yyyy"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label className="font-weight-bold small uppercase text-muted">To Date</Form.Label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => {
                    setToDate(date);
                    setCsvData([]);
                  }}
                  className="form-control premium-input"
                  dateFormat="dd/MM/yyyy"
                />
              </Col>
            </Row>
            
            <div className="mt-4 text-center">
              {csvData.length === 0 ? (
                <Button 
                  variant="info" 
                  className="rounded-pill px-5 shadow-sm"
                  onClick={handlePrepareDownload}
                  disabled={isPreparingCsv}
                >
                  {isPreparingCsv ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Preparing...</>
                  ) : (
                    <><i className="fas fa-cog mr-2"></i> Generate Report Data</>
                  )}
                </Button>
              ) : (
                <CSVLink
                  data={csvData}
                  filename={`my_attendance_${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-${String(fromDate.getDate()).padStart(2, '0')}_to_${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}.csv`}
                  className="btn btn-success rounded-pill px-5 shadow-sm"
                  onClick={() => setShowDownloadModal(false)}
                >
                  <i className="fas fa-download mr-2"></i> Download CSV File
                </CSVLink>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StudentDashboard;
