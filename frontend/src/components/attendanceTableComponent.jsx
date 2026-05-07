import React, { useState, useEffect } from "react";
import { Table, Form, Button, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { postAttendance } from "../actions/attendanceActions";
import { Link } from "react-router-dom";
import Message from "./message";
import CustomToast from "./customToast";
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
  const { success, error, loading } = attendanceDataEnter;

  useEffect(() => {
    if (success) {
      setShowToast(true);
      const timer = setTimeout(() => {
        dispatch({ type: ATTENDANCE_DATA_ENTER_RESET });
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const updateAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const attendanceData = Object.entries(attendanceMap).map(([studentId, status]) => ({
      studentId,
      status: status === "Hostel" ? "Present" : status === "Outside" ? "Absent" : "Leave",
      remarks: "",
    }));

    dispatch(
      postAttendance({
        date: today,
        attendanceData: attendanceData,
      })
    );
  };

  return (
    <>
    <div className="fade-in">
      <CustomToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message="Attendance updated successfully!" 
      />

      {error && <Message variant="danger">{error}</Message>}
      
      <div className="premium-table-wrapper mt-2">
        <Table hover responsive className="premium-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TOTAL ATTENDANCE</th>
              <th style={{ minWidth: '180px' }}>ATTENDANCE</th>
              <th>CONTACT (PHONE/EMAIL)</th>
              <th>ROOM / BLOCK</th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((student) => {
                const status =
                  attendanceMap[student._id] ?? student.todayStatus ?? "Hostel";

                return (
                  <tr key={student._id}>
                    <td>
                      <Link to={`/student/${student._id}`} className="table-link font-weight-bold">
                        {student.name}
                      </Link>
                      <div className="small text-muted">{student.course}</div>
                    </td>

                    <td className="text-center">
                      <Badge variant="primary" pill className="px-3 py-2 shadow-sm" style={{ fontSize: '0.9rem' }}>
                        {student.totalAttendance || 0} Days
                      </Badge>
                    </td>

                    <td>
                      <Form.Group controlId={`status-${student._id}`} className="mb-0">
                        <Form.Control
                          as="select"
                          size="sm"
                          value={status}
                          className="rounded-pill shadow-sm border-info"
                          style={{ fontWeight: '600', height: '40px' }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setAttendanceMap((prev) => ({
                              ...prev,
                              [student._id]: value,
                            }));
                          }}
                        >
                          <option value="Hostel">Present (Hostel)</option>
                          <option value="Home">Leave (Home)</option>
                          <option value="Outside">Absent (Outside)</option>
                        </Form.Control>
                      </Form.Group>
                    </td>

                    <td>
                      <div className="d-flex flex-column">
                        <a 
                          href={`tel:${student.contact}`} 
                          className="table-link mb-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fas fa-phone-alt mr-2 small text-info"></i>
                          {student.contact}
                        </a>
                        {student.email && (
                          <span className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>
                            <i className="fas fa-envelope mr-2 small"></i>
                            {student.email}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="font-weight-bold">
                      <span className="text-primary">{student.roomNo}</span> / <span className="text-secondary">{student.blockNo}</span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mt-4 mb-5 p-3 bg-light rounded shadow-sm border">
         <div className="text-muted small">
            <i className="fas fa-info-circle mr-2"></i>
            Total students in current view: <strong>{students ? students.length : 0}</strong>
         </div>
         <Button
          variant="primary"
          className="rounded-pill px-5 py-2 shadow font-weight-bold premium-btn"
          onClick={updateAttendance}
          disabled={!students || students.length === 0 || loading}
        >
          {loading ? (
            <><i className="fas fa-spinner fa-spin mr-2"></i> Updating...</>
          ) : (
            <><i className="fas fa-check-circle mr-2"></i> Update Attendance</>
          )}
        </Button>
      </div>
    </div>
    </>
  );
};

export default AttendanceTableComponent;
