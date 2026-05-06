import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { postAttendance } from "../actions/attendanceActions";
import { Link } from "react-router-dom";
import Message from "./message";
import { ATTENDANCE_DATA_ENTER_RESET } from "../constants/attendanceConstant";
const AttendanceTableComponent = ({
  students,
  attendanceMap,
  setAttendanceMap,
  attendance,
  roomNo,
}) => {
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const attendanceDataEnter = useSelector((state) => state.attendanceDataEnter);
  const { success, error } = attendanceDataEnter;

  useEffect(() => {
    if (success) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        dispatch({ type: ATTENDANCE_DATA_ENTER_RESET });
        window.location.reload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const updateAttendance = () => {
    const roomData = attendance
      ? Array.isArray(attendance.roomNo) &&
        attendance.roomNo.includes(roomNo)
        ? attendance.roomNo
        : [...(attendance.roomNo || []), roomNo]
      : roomNo;

    const dataData = { ...attendanceMap };

    const detailsData = attendance ? { ...attendance.details } : {};

    students.forEach((student) => {
      detailsData[student._id] = {
        name: student.name,
        contact: student.contact,
        roomNo: student.roomNo,
      };
    });

    dispatch(
      postAttendance({
        roomNo: roomData,
        details: detailsData,
        data: dataData,
      })
    );
  };
  return (
    <>
    <div className="fade-in">
      {showToast && <Message variant="success">Attendance updated successfully!</Message>}
      {error && <Message variant="danger">{error}</Message>}
      
      <div className="premium-table-wrapper mt-4">
        <Table hover responsive className="premium-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>Attendance</th>
              <th>STATUS</th>
              <th>CONTACT</th>
              <th>CITY</th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((student) => {
                const status =
                  attendanceMap[student._id] ?? student.status ?? "Hostel";

                return (
                  <tr key={student._id}>
                    <td>
                      <Link to={`/student/${student._id}`} className="table-link">
                        {student.name}
                      </Link>
                    </td>

                    <td style={{ minWidth: '150px' }}>
                      <Form>
                        <Form.Group controlId={`status-${student._id}`} className="mb-0">
                          <Form.Control
                            as="select"
                            size="sm"
                            value={status}
                            className="rounded-pill shadow-sm border-info"
                            style={{ fontWeight: '600' }}
                            onChange={(e) => {
                              const value = e.target.value;
                              setAttendanceMap((prev) => ({
                                ...prev,
                                [student._id]: value,
                              }));
                            }}
                          >
                            <option value="Hostel">Hostel</option>
                            <option value="Home">Home</option>
                            <option value="Outside">Outside</option>
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </td>

                    <td>
                      <span
                        className='status-badge shadow-sm'
                        style={{
                          backgroundColor:
                            status === "Outside"
                              ? "#fff5f5"
                              : status === "Home"
                                ? "#ebf8ff"
                                : "#f0fff4",
                          color:
                            status === "Outside"
                              ? "#e53e3e"
                              : status === "Home"
                                ? "#3182ce"
                                : "#38a169",
                          border: `1px solid ${
                            status === "Outside"
                              ? "#feb2b2"
                              : status === "Home"
                                ? "#bee3f8"
                                : "#c6f6d5"
                          }`
                        }}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <a 
                        href={`tel:${student.contact}`} 
                        className="table-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {student.contact}
                      </a>
                    </td>

                    <td>{student.city}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-end mt-4 mb-5">
        <Button
          variant="primary"
          className="rounded-pill px-5 py-2 shadow font-weight-bold"
          onClick={updateAttendance}
          disabled={!students || students.length === 0}
        >
          <i className="fas fa-check-circle mr-2"></i> Update Attendance
        </Button>
      </div>
    </div>
    </>
  );
};

export default AttendanceTableComponent;
