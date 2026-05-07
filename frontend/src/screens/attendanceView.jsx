import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getStudentsByRoomNo as action } from "../actions/studentActions";
import AttendanceTable from "../components/attendanceTable";
import { Link } from "react-router-dom";

const AttendanceView = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(action("")); // Load all students by default
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(action(keyword));
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 font-weight-bold text-primary">Attendance Management</h2>
          <h5 className="text-muted mt-1">
            <i className="far fa-calendar-alt mr-2"></i>
            Marking for: <span className="text-dark font-weight-bold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </h5>
          <p className="text-muted small mb-0">Search students by Name, Room, Phone or Course</p>
        </div>
        <Link to="/" className="btn btn-light shadow-sm rounded-pill px-3">
          <i className="fas fa-arrow-left mr-2"></i> Go Back
        </Link>
      </div>

      <div className="premium-table-wrapper p-4 bg-white mb-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Form onSubmit={submitHandler}>
          <Row className="align-items-end">
            <Col md={9}>
              <Form.Label className="premium-label small text-muted ml-2">Search Student</Form.Label>
              <div className="position-relative">
                <i className="fas fa-search position-absolute text-muted" style={{ left: '15px', top: '18px', zIndex: 10 }}></i>
                <Form.Control
                  type="text"
                  value={keyword}
                  placeholder="Enter Name, Room No, Phone or Course..."
                  className="premium-input w-100 pl-5"
                  style={{ height: '50px' }}
                  onChange={(e) => setKeyword(e.target.value)}
                ></Form.Control>
              </div>
            </Col>
            <Col md={3}>
              <Button 
                type="submit" 
                className="rounded-pill w-100 shadow-sm font-weight-bold premium-btn mt-3 mt-md-0"
                style={{ height: '50px' }}
              >
                Search List
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <AttendanceTable roomNo={keyword} />
    </div>
  );
};

export default AttendanceView;
