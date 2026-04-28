
import React, { useEffect, useState, useMemo } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loading from "./loader";
import Message from "./message";
import { CSVLink } from "react-csv";
import { Row, Col } from "react-bootstrap";


const AnalysisComponent = () => {
  const attendanceAnalysis = useSelector((state) => state.attendanceAnalysis);
  const { loading, error, attendance } = attendanceAnalysis;
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const categoryCount = useMemo(() => {
    if (!attendance || !attendance.data) {
      return { Home: 0, Outside: 0, Hostel: 0 };
    }

    const counts = { Home: 0, Outside: 0, Hostel: 0 };

    Object.values(attendance.data).forEach((status) => {
      if (!status) return;

      const normalizedStatus = status.trim().toLowerCase();

      if (normalizedStatus === "home") {
        counts.Home += 1;
      } else if (normalizedStatus === "outside") {
        counts.Outside += 1;
      } else if (normalizedStatus === "hostel") {
        counts.Hostel += 1;
      }
    });

    return counts;
  }, [attendance]);

  useEffect(() => {
    if (attendance) {
      setHeaders([
        { label: "Name", key: "name" },
        { label: "Contact", key: "contact" },
        { label: "Room No", key: "roomNo" },
        { label: "Status", key: "attendance" },
      ]);
      const csvMapList = Object.entries(attendance.details).map(
        ([id, student]) => ({
          name: student.name,
          contact: student.contact,
          roomNo: student.roomNo,
          attendance: attendance.data[id],
        })
      );

      setData(csvMapList);
    }
  }, [attendance]);
  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loading />
      ) : (
        <>
          {attendance && (
            <>

              <Row className="mb-3 text-center">
                <Col>
                  <div className="p-2 border rounded bg-light">
                    <h6>Home</h6>
                    <strong>{categoryCount.Home}</strong>
                  </div>
                </Col>

                <Col>
                  <div className="p-2 border rounded bg-light">
                    <h6>Outside</h6>
                    <strong>{categoryCount.Outside}</strong>
                  </div>
                </Col>

                <Col>
                  <div className="p-2 border rounded bg-light">
                    <h6>Hostel</h6>
                    <strong>{categoryCount.Hostel}</strong>
                  </div>
                </Col>
              </Row>

              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact No</th>
                    <th>Room No</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance &&
                    Object.entries(attendance.details).map((student) => {
                      return (
                        <tr key={student[0]}>
                          <th>{student[1].name}</th>
                          <td>{student[1].contact}</td>
                          <td>{student[1].roomNo}</td>
                          <td>{attendance.data[student[0]]}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              <CSVLink
                data={data}
                headers={headers}
                filename={`attendance_${Date()
                  .toString()
                  .substring(0, 15)}.csv`}
                className="btn btn-primary"
              >
                Download
              </CSVLink>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AnalysisComponent;
