import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/message";
import Loader from "../../components/loader";
import FormContainer from "../../components/formContainer";
import { register } from "../../actions/userActions";
import { USER_REGISTER_RESET } from "../../constants/userConstants";

const RegisterView = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Extra fields for registration
  const [address, setAddress] = useState("");
  const [course, setCourse] = useState("");
  const [city, setCity] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [blockNo, setBlockNo] = useState("");
  
  const [message, setMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo, success } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo && userInfo.token) {
      history.push(redirect);
    }
    if (success) {
      setShowPopup(true);
    }
    return () => {
      dispatch({ type: USER_REGISTER_RESET });
    };
  }, [history, userInfo, redirect, success, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else if (email && !emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
    } else if (mobile.length !== 10) {
      setMessage("Mobile number must be exactly 10 digits");
    } else if (fatherContact.length !== 10) {
      setMessage("Father's contact number must be exactly 10 digits");
    } else {
      dispatch(register(name, email, password, mobile, {
        address,
        course,
        city,
        fatherContact,
        roomNo,
        blockNo
      }));
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    dispatch({ type: USER_REGISTER_RESET });
    history.push("/login");
  };

  return (
    <div className='fade-in mt-3'>
      <FormContainer>
        <h1 className="mb-1">Sign Up</h1>
        <p className="text-muted mb-4 small">Join ResiTrack. Fill all details accurately for approval.</p>
        
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        
        <Form onSubmit={submitHandler}>
          <Card className="p-3 mb-3 border-0 shadow-sm bg-light">
            <h6 className="font-weight-bold mb-3 text-primary">Basic Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group controlId="name" className='mb-3'>
                  <Form.Label className='premium-label small'>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    className='premium-input'
                    onChange={(e) => setName(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email" className='mb-3'>
                  <Form.Label className='premium-label small'>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    className='premium-input'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="mobile" className='mb-3'>
                  <Form.Label className='premium-label small'>Your Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Your mobile no"
                    value={mobile}
                    className='premium-input'
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="fatherContact" className='mb-3'>
                  <Form.Label className='premium-label small'>Father's Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Father's mobile no"
                    value={fatherContact}
                    className='premium-input'
                    onChange={(e) => setFatherContact(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card className="p-3 mb-3 border-0 shadow-sm bg-light">
            <h6 className="font-weight-bold mb-3 text-primary">Academic & Hostel Details</h6>
            <Row>
              <Col md={6}>
                <Form.Group controlId="course" className='mb-3'>
                  <Form.Label className='premium-label small'>Course</Form.Label>
                  <Form.Control
                    as="select"
                    value={course}
                    className='premium-input'
                    onChange={(e) => setCourse(e.target.value)}
                    required
                  >
                    <option value="">-- Select Course --</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="BSc">BSc</option>
                    <option value="BA">BA</option>
                    <option value="MBA">MBA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="M.Com">M.Com</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="roomNo" className='mb-3'>
                  <Form.Label className='premium-label small'>Room No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Room"
                    value={roomNo}
                    className='premium-input'
                    onChange={(e) => setRoomNo(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="blockNo" className='mb-3'>
                  <Form.Label className='premium-label small'>Block No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Block"
                    value={blockNo}
                    className='premium-input'
                    onChange={(e) => setBlockNo(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group controlId="address" className='mb-3'>
                  <Form.Label className='premium-label small'>Full Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full address"
                    value={address}
                    className='premium-input'
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="city" className='mb-3'>
                  <Form.Label className='premium-label small'>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    className='premium-input'
                    onChange={(e) => setCity(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card className="p-3 mb-4 border-0 shadow-sm bg-light">
            <h6 className="font-weight-bold mb-3 text-primary">Security</h6>
            <Row>
              <Col md={6}>
                <Form.Group controlId="password" title="Password must be at least 6 characters" className='mb-3'>
                  <Form.Label className='premium-label small'>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    className='premium-input'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="confirmPassword">
                  <Form.Label className='premium-label small'>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    className='premium-input'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Button type="submit" variant="primary" className='premium-btn w-100 mb-3 py-3'>
            Register & Request Approval
          </Button>
        </Form>

        <Row className="py-3">
          <Col className='text-center'>
            <span className='text-muted'>Already have an account?</span>{" "}
            <Link 
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className='font-weight-bold text-info'
              style={{ textDecoration: 'none' }}
            >
              Login Instead
            </Link>
          </Col>
        </Row>
      </FormContainer>

      {/* Success Popup Modal */}
      <Modal show={showPopup} onHide={handleClosePopup} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center p-5">
          <div className="icon-circle bg-success text-white mb-4 mx-auto shadow-sm" style={{ width: '80px', height: '80px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            <i className="fas fa-clock"></i>
          </div>
          <h2 className="font-weight-bold mb-3 text-dark">Request Submitted!</h2>
          <div className="p-3 bg-light rounded-lg mb-4">
            <p className="text-dark font-weight-bold mb-2" style={{ fontSize: '1.1rem' }}>
              Your request has been sent for admin approval.
            </p>
            <p className="text-secondary mb-0">
              You will be able to log in once your account is activated.
            </p>
            <hr />
            <p className="text-info font-weight-bold small mb-0">
              <i className="fas fa-info-circle mr-1"></i> Minimum waiting time is 30 mins.
            </p>
          </div>
          <Button variant="primary" className="rounded-pill px-5 py-2 font-weight-bold shadow-sm" onClick={handleClosePopup}>
            Go to Login
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RegisterView;
