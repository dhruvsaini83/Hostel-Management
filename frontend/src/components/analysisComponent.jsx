
import React, { useEffect, useState, useMemo } from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loading from "./loader";
import Message from "./message";
import { CSVLink } from "react-csv";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";


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

  const total = useMemo(() => {
    return categoryCount.Home + categoryCount.Outside + categoryCount.Hostel;
  }, [categoryCount]);

  useEffect(() => {
    if (attendance) {
      setHeaders([
        { label: "Name", key: "name" },
        { label: "Contact", key: "contact" },
        { label: "Room No", key: "roomNo" },
        { label: "Block", key: "blockNo" },
        { label: "Status", key: "attendance" },
      ]);
      const csvMapList = Object.entries(attendance.details).map(
        ([id, student]) => ({
          name: student.name,
          contact: student.contact,
          roomNo: student.roomNo,
          blockNo: student.blockNo,
          attendance: attendance.data[id],
        })
      );

      setData(csvMapList);
    }
  }, [attendance]);

  return (
    <div className="fade-in">
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loading />
      ) : (
        <>
          {attendance && (
            <>
              <Row className="mb-4 mt-3">
                <Col md={4} className="mb-3">
                  <div className="metric-card shadow-sm bg-white border-left-success">
                    <div className="icon-box bg-success text-white">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h6>Present (Hostel)</h6>
                    <div className="value">{categoryCount.Hostel}</div>
                    <div className="analysis-progress">
                      <div 
                        className="analysis-progress-bar bg-success" 
                        style={{ width: `${(categoryCount.Hostel / (total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Col>

                <Col md={4} className="mb-3">
                  <div className="metric-card shadow-sm bg-white border-left-info">
                    <div className="icon-box bg-info text-white">
                      <i className="fas fa-calendar-minus"></i>
                    </div>
                    <h6>On Leave (Home)</h6>
                    <div className="value">{categoryCount.Home}</div>
                    <div className="analysis-progress">
                      <div 
                        className="analysis-progress-bar bg-info" 
                        style={{ width: `${(categoryCount.Home / (total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Col>

                <Col md={4} className="mb-3">
                  <div className="metric-card shadow-sm bg-white border-left-danger">
                    <div className="icon-box bg-danger text-white">
                      <i className="fas fa-user-times"></i>
                    </div>
                    <h6>Absent (Outside)</h6>
                    <div className="value">{categoryCount.Outside}</div>
                    <div className="analysis-progress">
                      <div 
                        className="analysis-progress-bar bg-danger" 
                        style={{ width: `${(categoryCount.Outside / (total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="premium-table-wrapper">
                <Table hover responsive className="premium-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact No</th>
                      <th>Room</th>
                      <th>Block</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance &&
                      Object.entries(attendance.details).map((student) => {
                        const status = attendance.data[student[0]];
                        return (
                          <tr key={student[0]}>
                            <td>
                              <Link to={`/student/${student[0]}`} className="table-link font-weight-bold">
                                {student[1].name}
                              </Link>
                            </td>
                            <td>{student[1].contact}</td>
                            <td>{student[1].roomNo}</td>
                            <td>{student[1].blockNo}</td>
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
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>

              {data && data.length > 0 && (
                <div className="d-flex justify-content-end mb-5">
                  <CSVLink
                    data={data}
                    headers={headers}
                    filename={`attendance_${new Date().toISOString().split('T')[0]}.csv`}
                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                  >
                    <i className="fas fa-download mr-2"></i> Download CSV
                  </CSVLink>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
    );
};

export default AnalysisComponent;
