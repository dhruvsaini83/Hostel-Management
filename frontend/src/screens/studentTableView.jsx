import React from "react";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/message";
import Loader from "../components/loader";
import Paginate from "../components/paginate";
// import { listStudents } from "../actions/studentActions";
import { Link, useHistory } from "react-router-dom";

const StudentsTableView = ({ keyword, pageNumber }) => {
  const history = useHistory();

  const studentsList = useSelector((state) => state.studentsList);
  const { loading, error, students, page, pages } = studentsList;

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className='premium-table-wrapper'>
            <Table hover responsive className="premium-table">
              <thead>
                <tr>
                  <th>Stream</th>
                  <th>NAME</th>
                  <th>STATUS</th>
                  <th>CONTACT</th>
                  <th>ROOM NO</th>
                  <th>CITY</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => (
                  <tr 
                    key={student._id}
                    onClick={() => history.push(`/student/${student._id}`)}
                  >
                    <td className='font-weight-bold'>{student.category}</td>
                    <td>
                      <Link to={`/student/${student._id}`} className='table-link'>
                        {student.name}
                      </Link>
                    </td>
                    <td>
                      <span
                        className='status-badge shadow-sm'
                        style={{
                          backgroundColor:
                            student.status === "Outside"
                              ? "#fff5f5"
                              : student.status === "Home"
                                ? "#ebf8ff"
                                : "#f0fff4",
                          color:
                            student.status === "Outside"
                              ? "#e53e3e"
                              : student.status === "Home"
                                ? "#3182ce"
                                : "#38a169",
                          border: `1px solid ${
                            student.status === "Outside"
                              ? "#feb2b2"
                              : student.status === "Home"
                                ? "#bee3f8"
                                : "#c6f6d5"
                          }`
                        }}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <a 
                        href={`tel:${student.contact}`} 
                        className='table-link'
                        onClick={(e) => e.stopPropagation()}
                      >
                        {student.contact}
                      </a>
                    </td>
                    <td className='font-weight-bold'>{student.roomNo}</td>
                    <td>{student.city}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
            isAdmin={true}
          />
        </>
      )}
    </>
  );
};

export default StudentsTableView;
