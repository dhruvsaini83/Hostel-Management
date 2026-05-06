import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Loading from "../components/loader";
import Message from "../components/message";
import {
  getStudentDetails,
  updateStudent,
  deleteStudent,
} from "../actions/studentActions";
import { STUDENT_UPDATE_RESET } from "../constants/studentConstant";
const StudentDetailsView = ({ match, history }) => {
  const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const studentDetails = useSelector((state) => state.studentDetails);
  const { loading, error, student } = studentDetails;
  const studentUpdate = useSelector((state) => state.studentUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = studentUpdate;
  const studentDelete = useSelector((state) => state.studentDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = studentDelete;

  useEffect(() => {
    if (successDelete) {
      history.push("/");
      return;
    }

    if (successUpdate) {
      setShowToast(true);
      dispatch(getStudentDetails(match.params.id));
      dispatch({ type: STUDENT_UPDATE_RESET });
      const timer = setTimeout(() => {
        setShowToast(false);
        window.location.reload();
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (!student || !student._id || student._id !== match.params.id) {
      dispatch(getStudentDetails(match.params.id));
    } else if (student && student.status !== status) {
      setStatus(student.status);
    }
  }, [
    dispatch,
    match.params.id,
    history,
    successUpdate,
    successDelete,
    student,
    status,
  ]);
  const navigateToEdit = () => {
    history.push({
      pathname: `/student/edit/${student._id}`,
      state: { studentProps: student },
    });
  };
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    dispatch(updateStudent({ ...student, status: newStatus }));
  };

  const deleteStudentHandler = () => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteStudent(student._id));
    }
  };
  return (
    <div className="fade-in">
      <Link className="btn btn-light shadow-sm rounded-pill px-3 mb-4" to="/">
        <i className="fas fa-arrow-left mr-2"></i> Go Back
      </Link>
      {loading || loadingUpdate || loadingDelete ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="fade-in">
          {showToast && <Message variant="success">Attendance status updated successfully!</Message>}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          {student && (
            <Row className="mt-2">
              <Col lg={4} md={5} className="mb-4">
                <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
                  <Image 
                    src={student.image} 
                    alt={student.name} 
                    fluid 
                    style={{ height: '350px', objectFit: 'cover', width: '100%' }}
                  />
                  <Card.Body className="text-center pb-0">
                    <div className="mb-2">
                      <span className="badge badge-info px-3 py-1 rounded-pill shadow-sm">
                        {student.category || 'Student'}
                      </span>
                    </div>
                    <Card.Title as="h2" className="mb-0 font-weight-bold text-primary">{student.name}</Card.Title>
                    <p className="text-muted mt-2 mb-3 h6">
                      <i className="fas fa-map-marker-alt mr-2 text-info"></i> {student.city}
                    </p>
                  </Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                      <span><i className="fas fa-phone mr-2 text-muted"></i> Phone No:</span>
                      <a href={`tel:${student.contact}`} className="font-weight-bold text-dark table-link" style={{ textDecoration: 'none' }}>
                        {student.contact}
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                      <span><i className="fas fa-user-friends mr-2 text-muted"></i> Father Contact:</span>
                      <a href={`tel:${student.fatherContact}`} className="font-weight-bold text-dark table-link" style={{ textDecoration: 'none' }}>
                        {student.fatherContact}
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-3">
                      <span className="text-muted d-block mb-1 small uppercase font-weight-bold">Address</span>
                      <div className="d-flex align-items-start">
                        <i className="fas fa-home mt-1 mr-2 text-muted"></i>
                        <span className="font-weight-normal">{student.address}</span>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              
              <Col lg={8} md={7}>
                <Card className="border-0 shadow-sm rounded-lg mb-4">
                  <Card.Header className="bg-white font-weight-bold h5 py-3 border-bottom-0">
                    <i className="fas fa-info-circle mr-2 text-primary"></i> Hostel Details
                  </Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="py-4">
                      <Row className="align-items-center">
                        <Col xs={4} className="font-weight-bold text-muted uppercase small letter-spacing-1">Room No</Col>
                        <Col xs={8} className="font-weight-bold h5 mb-0 text-dark">{student.roomNo}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-4">
                      <Row className="align-items-center">
                        <Col xs={4} className="font-weight-bold text-muted uppercase small letter-spacing-1">Block No</Col>
                        <Col xs={8} className="font-weight-bold h5 mb-0 text-dark">{student.blockNo}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-4">
                      <Row className="align-items-center">
                        <Col sm={4} className="font-weight-bold text-muted uppercase small letter-spacing-1 mb-2 mb-sm-0">Attendance Status</Col>
                        <Col sm={8}>
                          <Form.Control
                            className="premium-input shadow-none"
                            as="select"
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                          >
                            {["Hostel", "Outside", "Home"].map((x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>

                <Card className="border-0 shadow-sm rounded-lg">
                  <Card.Body className="d-flex flex-column flex-sm-row justify-content-end align-items-center py-3">
                    <span className="text-muted mr-auto mb-3 mb-sm-0 small">Administrative Actions:</span>
                    <div className="d-flex w-100 w-sm-auto justify-content-center">
                      <Button 
                        variant="outline-info" 
                        className="mr-2 px-4 rounded-pill font-weight-bold shadow-sm" 
                        onClick={navigateToEdit}
                      >
                        <i className="fas fa-edit mr-2"></i> Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="px-4 rounded-pill font-weight-bold shadow-sm" 
                        onClick={deleteStudentHandler}
                      >
                        <i className="fas fa-trash mr-2"></i> Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDetailsView;
