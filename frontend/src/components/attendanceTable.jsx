import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./loader";
import Message from "./message";
import AttendanceTableComponent from "./attendanceTableComponent";
import { getStudentsByRoomNo as action } from "../actions/studentActions";

const AttendanceTable = ({ roomNo }) => {

  const [attendanceMap, setAttendanceMap] = useState({});
  const dispatch = useDispatch();

  const getStudentsByRoomNo = useSelector((state) => state.getStudentsByRoomNo);
  const { loading, error, students, attendance } = getStudentsByRoomNo;
  const attendanceDataEnter = useSelector((state) => state.attendanceDataEnter);
  const {
    loading: loadingAttendance,
    error: errorAttendance,
    success,
  } = attendanceDataEnter;

  useEffect(() => {
    if (success) {
      dispatch(action(roomNo));
    }
  }, [success, dispatch, roomNo]);

  useEffect(() => {
    if (students) {
      arrangeTable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance, students]);

  const arrangeTable = () => {
    let tempMap = {};
    if (attendance && attendance.data) {
      students.forEach((student) => {
        if (attendance.data[student._id]) {
          tempMap[student._id] = attendance.data[student._id];
        } else {
          tempMap[student._id] = student.status || "Hostel";
        }
      });
    } else {
      students.forEach((student) => {
        tempMap[student._id] = student.status || "Hostel";
      });
    }
    setAttendanceMap(tempMap);
  };

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {loading || loadingAttendance ? (
        <Loading />
      ) : (
        <>
          {errorAttendance && (
            <Message variant="danger">{errorAttendance}</Message>
          )}
          {students && (
            <>
              <AttendanceTableComponent
                students={students}
                attendanceMap={attendanceMap}
                setAttendanceMap={setAttendanceMap}
                attendance={attendance}
                roomNo={roomNo}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default AttendanceTable;
