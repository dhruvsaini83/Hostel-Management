import React from "react";
import { Table, Button } from "react-bootstrap";
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
                  <th>Course</th>
                  <th>NAME</th>
                  <th>STATUS</th>
                  <th>ROOM / BLOCK</th>
                  <th>CITY</th>
                  <th className='text-center'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => (
                  <tr
                    key={student._id}
                    onClick={() => history.push(`/student/${student._id}`)}
                  >
                    <td className='font-weight-bold'>{student.course}</td>
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
                          border: `1px solid ${student.status === "Outside"
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
                       <span className='font-weight-bold'>{student.roomNo}</span>
                       <span className='text-muted mx-1'>/</span>
                       <span className='small'>{student.blockNo}</span>
                    </td>
                    <td>{student.city}</td>
                    <td className='text-center' onClick={(e) => e.stopPropagation()}>
                       <Button 
                         variant='outline-info' 
                         size='sm' 
                         className='rounded-pill px-3'
                         onClick={() => history.push({
                           pathname: `/student/edit/${student._id}`,
                           state: { studentProps: student }
                         })}
                       >
                         <i className='fas fa-edit'></i> Edit
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className='d-flex justify-content-between align-items-center px-3 py-2 bg-light border-top rounded-bottom small'>
              <span className='text-muted'>
                Showing <strong>{students ? students.length : 0}</strong> students on this page
              </span>
              <span className='text-info font-weight-bold'>
                <i className='fas fa-info-circle mr-1'></i> Click on any row to view details
              </span>
            </div>
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
