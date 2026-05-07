import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Modal,
} from "react-bootstrap";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

import Loading from "../components/loader";
import Message from "../components/message";
import CustomToast from "../components/customToast";
import {
  getStudentDetails,
  updateStudent,
  deleteStudent,
} from "../actions/studentActions";
import { getStudentAttendanceStats } from "../actions/attendanceActions";
import { STUDENT_UPDATE_RESET } from "../constants/studentConstant";

const StudentDetailsView = ({ match, history }) => {
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Download Report State
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [toDate, setToDate] = useState(new Date());
  const [csvData, setCsvData] = useState([]);
  const [isPreparingCsv, setIsPreparingCsv] = useState(false);

  const dispatch = useDispatch();

  const studentDetails = useSelector((state) => state.studentDetails);
  const { loading, error, student } = studentDetails;

  const studentUpdate = useSelector((state) => state.studentUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = studentUpdate;

  const studentDelete = useSelector((state) => state.studentDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = studentDelete;

  const attendanceStudentStats = useSelector((state) => state.attendanceStudentStats);
  const { loading: loadingStats, error: errorStats, stats } = attendanceStudentStats;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successDelete) {
      history.push("/");
      return;
    }

    if (successUpdate) {
      setToastMessage("Information updated successfully!");
      setShowToast(true);
      dispatch(getStudentDetails(match.params.id));
      dispatch(getStudentAttendanceStats(match.params.id));
      dispatch({ type: STUDENT_UPDATE_RESET });
    }

    if (!student || !student._id || student._id !== match.params.id) {
      dispatch(getStudentDetails(match.params.id));
      dispatch(getStudentAttendanceStats(match.params.id));
    } else if (student && student.status !== status) {
      setStatus(student.status);
    }
  }, [
    dispatch,
    match.params.id,
    history,
    successUpdate,
    successDelete,
    student,
    status,
  ]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handlePrepareDownload = async () => {
    setIsPreparingCsv(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/attendance/student/${student._id}`, config);
      
      const start = fromDate.toISOString().split('T')[0];
      const end = toDate.toISOString().split('T')[0];
      
      // Filter data by date range
      const filteredRecords = data.filter(record => {
        return record.date >= start && record.date <= end;
      });

      // Prepare CSV format
      const reportRows = [
        ["STUDENT ATTENDANCE REPORT", ""],
        ["Name", student.name],
        ["Student ID", student.studentId || "N/A"],
        ["Room/Block", `${student.roomNo} / ${student.blockNo}`],
        ["Contact", student.contact],
        ["Email", student.email || "N/A"],
        ["Report Range", `${formatDate(start)} to ${formatDate(end)}`],
        ["", ""], // Spacer
        ["DATE", "STATUS", "REMARKS"]
      ];

      filteredRecords.forEach(record => {
        reportRows.push([
          formatDate(record.date),
          record.status === "Present" ? "In Hostel" : record.status === "Leave" ? "At Home" : "Outside",
          record.remarks || ""
        ]);
      });

      setCsvData(reportRows);
    } catch (err) {
      alert("Error preparing report: " + err.message);
    }
    setIsPreparingCsv(false);
  };

  const navigateToEdit = () => {
    history.push({
      pathname: `/student/edit/${student._id}`,
      state: { studentProps: student },
    });
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    dispatch(updateStudent({ ...student, status: newStatus }));
  };

  const deleteStudentHandler = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteStudent(student._id));
    }
  };

  return (
    <div className="fade-in">
      <CustomToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage} 
      />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link className="btn btn-light shadow-sm rounded-pill px-3" to="/">
          <i className="fas fa-arrow-left mr-2"></i> Go Back
        </Link>
        <Button 
          variant="primary" 
          className="rounded-pill px-4 shadow-sm premium-btn"
          onClick={() => setShowDownloadModal(true)}
        >
          <i className="fas fa-file-download mr-2"></i> Download Report
        </Button>
      </div>

      {loading || loadingUpdate || loadingDelete ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="fade-in">
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          {student && (
            <Row className="mt-2">
              <Col lg={4} md={5} className="mb-4">
                <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
                  <Image 
                    src={student.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt={student.name} 
                    fluid 
                    style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                  <Card.Body className="text-center pb-0">
                    <div className="mb-2">
                      <span className="badge badge-info px-3 py-1 rounded-pill shadow-sm">
                        {student.course || student.category || 'Student'}
                      </span>
                    </div>
                    <Card.Title as="h2" className="mb-0 font-weight-bold text-primary">{student.name}</Card.Title>
                    <p className="text-muted mt-2 mb-3 h6">
                      <i className="fas fa-id-badge mr-2 text-info"></i> {student.studentId || "N/A"}
                    </p>
                  </Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                      <span><i className="fas fa-phone mr-2 text-muted"></i> Phone:</span>
                      <span className="font-weight-bold text-dark">{student.contact}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                      <span><i className="fas fa-envelope mr-2 text-muted"></i> Email:</span>
                      <span className="small text-muted">{student.email || "N/A"}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-3">
                      <span className="text-muted d-block mb-1 small uppercase font-weight-bold">Address</span>
                      <div className="d-flex align-items-start">
                        <i className="fas fa-map-marker-alt mt-1 mr-2 text-muted"></i>
                        <span className="font-weight-normal">{student.address}, {student.city}</span>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>

                {/* Quick Stats Card */}
                {stats && (
                  <Card className="border-0 shadow-sm rounded-lg mt-4 bg-white">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                        <h6 className="uppercase small letter-spacing-1 font-weight-bold mb-0 text-muted">Attendance Summary</h6>
                        <Badge variant="info" className="px-2 py-1 small rounded-pill">Last 30 Days</Badge>
                      </div>
                      <Row>
                        <Col xs={6} className="mb-4">
                          <div className="d-flex align-items-center">
                            <div className="stats-icon bg-success-light text-success mr-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#e6fffa' }}>
                              <i className="fas fa-hotel"></i>
                            </div>
                            <div>
                              <div className="text-muted small font-weight-bold">In Hostel</div>
                              <div className="h4 font-weight-bold mb-0 text-dark">{stats.present || 0} <span className="small font-weight-normal text-muted">Days</span></div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={6} className="mb-4">
                          <div className="d-flex align-items-center">
                            <div className="stats-icon bg-primary-light text-primary mr-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#ebf8ff' }}>
                              <i className="fas fa-chart-line"></i>
                            </div>
                            <div>
                              <div className="text-muted small font-weight-bold">Rate</div>
                              <div className="h4 font-weight-bold mb-0 text-dark">{stats.percentage || 0}%</div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="d-flex align-items-center">
                            <div className="stats-icon bg-warning-light text-warning mr-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#fffaf0' }}>
                              <i className="fas fa-home"></i>
                            </div>
                            <div>
                              <div className="text-muted small font-weight-bold">At Home</div>
                              <div className="h4 font-weight-bold mb-0 text-dark">{stats.leave || 0} <span className="small font-weight-normal text-muted">Days</span></div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="d-flex align-items-center">
                            <div className="stats-icon bg-danger-light text-danger mr-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#fff5f5' }}>
                              <i className="fas fa-external-link-alt"></i>
                            </div>
                            <div>
                              <div className="text-muted small font-weight-bold">Outside</div>
                              <div className="h4 font-weight-bold mb-0 text-dark">{stats.absent || 0} <span className="small font-weight-normal text-muted">Days</span></div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </Col>
              
              <Col lg={8} md={7}>
                <Card className="border-0 shadow-sm rounded-lg mb-4">
                  <Card.Header className="bg-white font-weight-bold h5 py-3 border-bottom-0 d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-hotel mr-2 text-primary"></i> Hostel Allocation</span>
                    <Badge variant="success" pill className="px-3 py-2">
                       {status}
                    </Badge>
                  </Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="py-3">
                      <Row>
                        <Col xs={6}>
                           <div className="text-muted small uppercase font-weight-bold mb-1">Room Number</div>
                           <div className="h5 font-weight-bold">{student.roomNo}</div>
                        </Col>
                        <Col xs={6}>
                           <div className="text-muted small uppercase font-weight-bold mb-1">Block Number</div>
                           <div className="h5 font-weight-bold">{student.blockNo}</div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-3 bg-light">
                      <Row className="align-items-center">
                        <Col sm={4} className="font-weight-bold text-muted small uppercase mb-2 mb-sm-0">Update Current Location</Col>
                        <Col sm={8}>
                          <Form.Control
                            className="premium-input shadow-none border-0"
                            as="select"
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                          >
                            <option value="Hostel">Present (Hostel)</option>
                            <option value="Home">Leave (Home)</option>
                            <option value="Outside">Absent (Outside)</option>
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>

                {/* Attendance History Card */}
                <Card className="border-0 shadow-sm rounded-lg mb-4">
                  <Card.Header className="bg-white font-weight-bold h5 py-3 border-bottom-0">
                    <i className="fas fa-history mr-2 text-primary"></i> Attendance History (Last 30 Days)
                  </Card.Header>
                  <Card.Body className="p-0">
                    {loadingStats ? (
                      <div className="p-5 text-center"><Loading /></div>
                    ) : errorStats ? (
                      <Message variant="danger">{errorStats}</Message>
                    ) : stats && stats.history && stats.history.length > 0 ? (
                      <Table responsive hover className="mb-0 premium-table">
                        <thead className="bg-light">
                          <tr>
                            <th>DATE</th>
                            <th>STATUS</th>
                            <th>MARKED BY</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.history.map((record, index) => (
                            <tr key={index}>
                              <td className="font-weight-bold text-muted">{record.date}</td>
                              <td>
                                <Badge 
                                  pill 
                                  className="px-3 py-2"
                                  style={{
                                    backgroundColor: 
                                      record.status === "Present" ? "#f0fff4" : 
                                      record.status === "Leave" ? "#fffaf0" : "#fff5f5",
                                    color: 
                                      record.status === "Present" ? "#38a169" : 
                                      record.status === "Leave" ? "#b7791f" : "#e53e3e",
                                    border: `1px solid ${
                                      record.status === "Present" ? "#c6f6d5" : 
                                      record.status === "Leave" ? "#fbd38d" : "#feb2b2"
                                    }`
                                  }}
                                >
                                  {record.status === "Present" ? "In Hostel" : 
                                   record.status === "Leave" ? "At Home" : "Outside"}
                                </Badge>
                              </td>
                              <td className="small">
                                {record.markedBy && typeof record.markedBy === 'object' ? record.markedBy.name : "System"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="p-5 text-center text-muted italic">
                         <i className="fas fa-calendar-times fa-3x mb-3 d-block opacity-2"></i>
                         No attendance history found for this student.
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm rounded-lg mb-5">
                  <Card.Body className="d-flex flex-column flex-sm-row justify-content-end align-items-center py-3">
                    <span className="text-muted mr-auto mb-3 mb-sm-0 small">Administrative Actions:</span>
                    <div className="d-flex w-100 w-sm-auto justify-content-center">
                      <Button 
                        variant="outline-info" 
                        className="mr-2 px-4 rounded-pill font-weight-bold shadow-sm" 
                        onClick={navigateToEdit}
                      >
                        <i className="fas fa-edit mr-2"></i> Edit Profile
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="px-4 rounded-pill font-weight-bold shadow-sm" 
                        onClick={deleteStudentHandler}
                      >
                        <i className="fas fa-trash mr-2"></i> Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
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
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title><i className="fas fa-file-download mr-2"></i> Attendance Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-muted mb-4">Select the date range for <strong>{student?.name}'s</strong> attendance report.</p>
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
                  filename={`attendance_${student?.name}_${fromDate.toISOString().split('T')[0]}_to_${toDate.toISOString().split('T')[0]}.csv`}
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
    </div>
  );
};

export default StudentDetailsView;
