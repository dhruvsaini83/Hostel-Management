import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table, Card, Button, Badge, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/loader";
import Message from "../components/message";

const MyAttendanceView = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

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
    </Container>
  );
};

export default MyAttendanceView;
