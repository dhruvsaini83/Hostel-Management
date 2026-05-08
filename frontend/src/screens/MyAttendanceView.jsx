import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Card, Button, Badge, Container, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/loader";
import Message from "../components/message";
import { createGrievance } from "../actions/grievanceActions.jsx";
import { GRIEVANCE_CREATE_RESET } from "../constants/grievanceConstants.jsx";

const MyAttendanceView = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  // Grievance State
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [correctStatus, setCorrectStatus] = useState("Present");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState("");

  const dispatch = useDispatch();

  const grievanceCreate = useSelector((state) => state.grievanceCreate);
  const { loading: loadingGrievance, error: errorGrievance, success: successGrievance } = grievanceCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // Find student profile first
        const { data: profiles } = await axios.get("/student/all", config);
        const myProfile = profiles.students.find(s => s.name === userInfo.name);

        if (myProfile) {
          const { data } = await axios.get(`/attendance/student/${myProfile._id}`, config);
          setAttendance(data);
        } else {
          setError("Profile not found.");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [userInfo]);

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = attendance.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(attendance.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (successGrievance) {
      setShowGrievanceModal(false);
      setReason("");
      setProof("");
      dispatch({ type: GRIEVANCE_CREATE_RESET });
      alert("Grievance request submitted successfully!");
    }
  }, [dispatch, successGrievance]);

  const openGrievanceModal = (date) => {
    setSelectedDate(date);
    setShowGrievanceModal(true);
  };

  const grievanceSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(createGrievance({ 
      date: selectedDate, 
      correctStatus, 
      reason, 
      proof 
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Container className="py-4 fade-in">
      <Link to="/" className="btn btn-light shadow-sm rounded-pill px-3 mb-4">
        <i className="fas fa-arrow-left mr-2"></i> Dashboard
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="font-weight-bold text-primary mb-0">My Attendance History</h2>
        <Badge variant="info" pill className="px-3 py-2">
           Total Records: {attendance.length}
        </Badge>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 premium-table">
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>MARKED BY</th>
                    <th>REMARKS</th>
                    <th className="text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record, index) => (
                    <tr key={index}>
                      <td className="text-muted small">{indexOfFirstRecord + index + 1}</td>
                      <td className="font-weight-bold text-dark">{formatDate(record.date)}</td>
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
                      <td className="small text-secondary">
                        {record.markedBy ? record.markedBy.name : "System"}
                      </td>
                      <td className="small text-muted">{record.remarks || "-"}</td>
                      <td className="text-center">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="rounded-pill px-3"
                          onClick={() => openGrievanceModal(record.date)}
                        >
                          <i className="fas fa-exclamation-circle mr-1"></i> Report
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-5">
              <Button 
                variant="outline-primary" 
                className="rounded-pill px-4 mx-2"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left mr-2"></i> Previous
              </Button>
              
              <div className="mx-3 font-weight-bold">
                Page {currentPage} of {totalPages}
              </div>

              <Button 
                variant="outline-primary" 
                className="rounded-pill px-4 mx-2"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <i className="fas fa-chevron-right ml-2"></i>
              </Button>
            </div>
          )}
        </>
      )}
      {/* Grievance Modal */}
      <Modal show={showGrievanceModal} onHide={() => setShowGrievanceModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="font-weight-bold">Report Attendance Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4 text-center">
            <Badge variant="light" className="text-muted p-2 border">
              Date: {formatDate(selectedDate)}
            </Badge>
          </div>
          {errorGrievance && <Message variant="danger">{errorGrievance}</Message>}
          <Form onSubmit={grievanceSubmitHandler}>
            <Form.Group controlId="correctStatus" className="mb-3">
              <Form.Label className="small font-weight-bold">Correct Status Should Be</Form.Label>
              <Form.Control
                as="select"
                value={correctStatus}
                onChange={(e) => setCorrectStatus(e.target.value)}
                className="premium-input"
              >
                <option value="Present">Present (Hostel)</option>
                <option value="Absent">Absent (Outside)</option>
                <option value="Leave">Leave (Home)</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="reason" className="mb-3">
              <Form.Label className="small font-weight-bold">Reason for Correction</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Explain why this marking is incorrect..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="premium-input"
              />
            </Form.Group>

            <Form.Group controlId="proof" className="mb-4">
              <Form.Label className="small font-weight-bold">Proof Link (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Google Drive link or Image URL"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="premium-input"
              />
            </Form.Group>

            <Button type="submit" variant="danger" className="w-100 rounded-pill py-2 font-weight-bold shadow-sm" disabled={loadingGrievance}>
              {loadingGrievance ? "Submitting..." : "Submit Report Request"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyAttendanceView;
