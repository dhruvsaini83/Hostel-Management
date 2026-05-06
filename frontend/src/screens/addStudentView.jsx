import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import FormContainer from "../components/formContainer";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, updateStudent } from "../actions/studentActions";
import Loading from "../components/loader.jsx";
import Message from "../components/message.jsx";
import { STUDENT_UPDATE_RESET } from "../constants/studentConstant";
import Loader from "../components/loader";

const AddStudentView = () => {
  const history = useHistory();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [image, setImage] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [blockNo, setBlockNo] = useState("");
  const [status, setStatus] = useState("Hostel");

  const dispatch = useDispatch();
  const studentAdd = useSelector((state) => state.studentAdd);
  const { loading, error, success } = studentAdd;
  const studentUpdate = useSelector((state) => state.studentUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = studentUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: STUDENT_UPDATE_RESET });
      history.push("/");
    }
    if (history.location.state && history.location.state.studentProps) {
      setIsEdit(true);
      const student = history.location.state.studentProps;
      setName(student.name);
      setAddress(student.address);
      setCategory(student.category);
      setCity(student.city);
      setContact(student.contact);
      setFatherContact(student.fatherContact);
      setImage(student.image);
      setRoomNo(student.roomNo);
      setBlockNo(student.blockNo);
      setStatus(student.status);
    }
    if (success) {
      history.push("/");
    }
  }, [dispatch, history, success, successUpdate]);

  const submitHandler = () => {
    if (isEdit === true) {
      const _id = history.location.state.studentProps._id;
      dispatch(
        updateStudent({
          _id,
          name,
          address,
          category,
          city,
          contact,
          fatherContact,
          image,
          roomNo,
          blockNo,
          status,
        })
      );
    } else {
      dispatch(
        addStudent({
          name,
          address,
          category,
          city,
          contact,
          fatherContact,
          image,
          roomNo,
          blockNo,
          status,
        })
      );
    }
  };

  return (
    <div className="fade-in">
      <Link to="/" className="btn btn-light shadow-sm rounded-pill px-3 mb-4">
        <i className="fas fa-arrow-left mr-2"></i> Go Back
      </Link>

      {loading || loadingUpdate ? (
        <Loader />
      ) : (
        <div className="fade-in">
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          <FormContainer>
            <h1>{isEdit ? "Edit Student" : "Add Student"}</h1>
            {loading && <Loading />}
            {error && <Message variant="danger">{error}</Message>}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label className="premium-label">Name<span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name} required
                  className="premium-input"
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              
              <Form.Group controlId="status" className="mb-3">
                <Form.Label className="premium-label">Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  className="premium-input"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {["Hostel", "Outside", "Home"].map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="address" className="mb-3">
                <Form.Label className="premium-label">Address<span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  className="premium-input"
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="city" className="mb-3">
                    <Form.Label className="premium-label">City<span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter city"
                      value={city}
                      className="premium-input"
                      onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="category" className="mb-3">
                    <Form.Label className="premium-label">Category<span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control
                      as="select"
                      value={category}
                      className="premium-input"
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">-- Select --</option>
                      <option value="MCA">MCA</option>
                      <option value="BCA">BCA</option>
                      <option value="B.Com">B.Com</option>
                      <option value="M.Com">M.Com</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="contact" className="mb-3">
                    <Form.Label className="premium-label">Contact<span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter phone number"
                      value={contact}
                      className="premium-input"
                      onChange={(e) => setContact(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="fatherContact" className="mb-3">
                    <Form.Label className="premium-label">Father Contact<span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Father Phone"
                      value={fatherContact}
                      className="premium-input"
                      onChange={(e) => setFatherContact(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="roomNo" className="mb-3">
                    <Form.Label className="premium-label">Room No<span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Room no"
                      value={roomNo}
                      className="premium-input"
                      onChange={(e) => setRoomNo(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="b" className="mb-3">
                    <Form.Label className="premium-label">Block Number<span style={{ color: "red" }}>*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Block No"
                      value={blockNo}
                      className="premium-input"
                      onChange={(e) => setBlockNo(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="image" className="mb-4">
                <Form.Label className="premium-label">Image Url</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Paste image url here"
                  value={image}
                  className="premium-input"
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="premium-btn w-100"
                >
                  {isEdit ? "Update Student" : "Register Student"}
                </Button>
              </div>
            </Form>
          </FormContainer>
        </div>
      )}
    </div>
  );
};

export default AddStudentView;
