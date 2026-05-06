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
      dispatch({ type: STUDENT_UPDATE_RESET });
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
  const updateStatus = () => {
    dispatch(updateStudent({ ...student, status }));
  };

  const deleteStudentHandler = () => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteStudent(student._id));
    }
  };
  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading || loadingUpdate || loadingDelete ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {errorDelete && <Message variant="danger">{errorDelete}</Message>}
          {student && (
            <Row className="mt-4">
              <Col md={4} className="mb-4">
                <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
                  <Image 
                    src={student.image} 
                    alt={student.name} 
                    fluid 
                    style={{ height: '350px', objectFit: 'cover', width: '100%' }}
                  />
                  <Card.Body className="text-center pb-0">
                    <Card.Title as="h2" className="mb-0">{student.name}</Card.Title>
                    <p className="text-muted mt-2 mb-3">
                      <i className="fas fa-map-marker-alt mr-2"></i> {student.city}
                    </p>
                  </Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span className="font-weight-bold">Phone No:</span>
                      <a href={`tel:${student.contact}`} className="font-weight-bold text-dark" style={{ fontSize: '1.1rem', textDecoration: 'none' }}>
                        {student.contact}
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span className="font-weight-bold">Father Contact:</span>
                      <a href={`tel:${student.fatherContact}`} className="font-weight-bold text-dark" style={{ fontSize: '1.1rem', textDecoration: 'none' }}>
                        {student.fatherContact}
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="font-weight-bold d-block mb-1">Address:</span>
                      <span className="text-muted">{student.address}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              
              <Col md={8}>
                <Card className="border-0 shadow-sm rounded-lg mb-4">
                  <Card.Header className="bg-white font-weight-bold h5 py-3">
                    Hostel Details
                  </Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="py-3">
                      <Row className="align-items-center">
                        <Col sm={4} className="font-weight-bold text-muted">Room No:</Col>
                        <Col sm={8} className="font-weight-bold h5 mb-0">{student.roomNo}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-3">
                      <Row className="align-items-center">
                        <Col sm={4} className="font-weight-bold text-muted">Block No:</Col>
                        <Col sm={8} className="font-weight-bold h5 mb-0">{student.blockNo}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-3">
                      <Row className="align-items-center">
                        <Col sm={4} className="font-weight-bold text-muted">Current Status:</Col>
                        <Col sm={5}>
                          <Form.Control
                            className="shadow-none"
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            {["Hostel", "Outside", "Home"].map((x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                        <Col sm={3} className="text-right mt-3 mt-sm-0">
                          <Button
                            variant={status === student.status ? "secondary" : "primary"}
                            className="w-100"
                            type="button"
                            onClick={updateStatus}
                            disabled={status === student.status}
                          >
                            Update
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>

                <Card className="border-0 shadow-sm rounded-lg">
                  <Card.Body className="d-flex justify-content-end align-items-center">
                    <span className="text-muted mr-auto">Administrative Actions:</span>
                    <Button variant="outline-primary" className="mr-3 px-4" onClick={navigateToEdit}>
                      <i className="fas fa-edit mr-2"></i> Edit Profile
                    </Button>
                    <Button variant="outline-danger" className="px-4" onClick={deleteStudentHandler}>
                      <i className="fas fa-trash mr-2"></i> Delete Student
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default StudentDetailsView;
