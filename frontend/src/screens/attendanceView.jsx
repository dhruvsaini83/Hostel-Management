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

      <div className="premium-table-wrapper p-4 bg-white mb-4">
        <Form onSubmit={submitHandler} className="d-flex flex-nowrap align-items-center">
          <Form.Control
            type="text"
            value={roomNo}
            name="roomNo"
            placeholder="Enter Room Number..."
            className="mr-3 shadow-sm rounded-pill border-info"
            style={{ maxWidth: '300px', height: '45px' }}
            onChange={(e) => changeRoomNo(e)}
          ></Form.Control>
          <Button 
            type="submit" 
            onClick={submitHandler}
            className="rounded-pill px-4 shadow-sm font-weight-bold"
            style={{ height: '45px' }}
          >
            <i className="fas fa-search mr-2"></i> Get Students
          </Button>
        </Form>
      </div>
      <AttendanceTable roomNo={roomNo} />
    </div>
  );
};

export default AttendanceView;
