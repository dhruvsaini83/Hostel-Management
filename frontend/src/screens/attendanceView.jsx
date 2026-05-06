import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getStudentsByRoomNo as action } from "../actions/studentActions";
import AttendanceTable from "../components/attendanceTable";
import { Link } from "react-router-dom";

const AttendanceView = () => {
  const [roomNo, setRoomNo] = useState("");
  const dispatch = useDispatch();
  useEffect(() => { }, [dispatch]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(action(roomNo));
  };

  const changeRoomNo = (e) => {
    setRoomNo(e.target.value);
  };
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Take Attendance</h2>
        <Link to="/" className="btn btn-light shadow-sm rounded-pill px-3">
          <i className="fas fa-arrow-left mr-2"></i> Go Back
        </Link>
      </div>

      <div className="premium-table-wrapper p-4 bg-white mb-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Form onSubmit={submitHandler} className="d-flex flex-wrap align-items-center">
          <div className="flex-grow-1 mr-md-3 mb-3 mb-md-0">
            <Form.Label className="premium-label small text-muted ml-2">Search Students by Room</Form.Label>
            <Form.Control
              type="text"
              value={roomNo}
              name="roomNo"
              placeholder="e.g. 101, 202..."
              className="premium-input w-100"
              style={{ height: '50px' }}
              onChange={(e) => changeRoomNo(e)}
            ></Form.Control>
          </div>
          <Button 
            type="submit" 
            className="rounded-pill px-5 shadow-sm font-weight-bold premium-btn mt-md-4"
            style={{ height: '50px' }}
          >
            <i className="fas fa-search mr-2"></i> Get Students
          </Button>
        </Form>
      </div>

      {!roomNo && (
        <div className="text-center py-5 fade-in">
          <div className="mb-4">
            <i className="fas fa-door-open fa-4x text-light"></i>
          </div>
          <h4 className="text-muted">Enter a Room Number to begin attendance</h4>
          <p className="text-secondary">All students in the selected room will appear here.</p>
        </div>
      )}

      <AttendanceTable roomNo={roomNo} />
    </div>
  );
};

export default AttendanceView;
