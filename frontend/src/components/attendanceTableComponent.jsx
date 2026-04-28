import React from "react";
import { Table, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { postAttendance } from "../actions/attendanceActions";
import { Link } from "react-router-dom";
const AttendanceTableComponent = ({
  students,
  attendanceMap,
  setAttendanceMap,
  attendance,
  roomNo,
}) => {
  const dispatch = useDispatch();

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
      <Table striped bordered hover responsive className="table-sm">
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
                    <Link to={`/student/${student._id}`}>{student.name}</Link>
                  </td>

                  <td>
                    <Form>
                      <Form.Group controlId={`status-${student._id}`}>
                        <Form.Control
                          as="select"
                          size="sm"
                          value={status}
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
                      style={{
                        color:
                          status === "Outside"
                            ? "red"
                            : status === "Home"
                              ? "blue"
                              : "black",
                      }}
                    >
                      {status}
                    </span>
                  </td>

                  <td>
                    <a href={`tel:${student.contact}`}>{student.contact}</a>
                  </td>

                  <td>{student.city}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <Button
        variant="success"
        onClick={updateAttendance}
        disabled={!students || students.length === 0}
      >
        Update Attendance
      </Button>
    </>
  );
};

export default AttendanceTableComponent;
