import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Message from "../components/message";
import Loader from "../components/loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

const ProfileView = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  
  // Student Specific State
  const [studentInfo, setStudentInfo] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
        setImage(user.image || "");
        
        // If student, fetch their detailed record for the right section
        if (user.role === 'student') {
          const fetchStudentDetail = async () => {
            setLoadingStudent(true);
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              };
              const { data: profiles } = await axios.get("/student/all", config);
              const myProfile = profiles.students.find(s => s.name === user.name);
              setStudentInfo(myProfile);
              if (myProfile && myProfile.image) {
                setImage(myProfile.image);
              }
            } catch (err) {
              console.error("Error fetching student info", err);
            }
            setLoadingStudent(false);
          };
          fetchStudentDetail();
        }
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else if (email && !emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password, image }));
    }
  };

  return (
    <div className='fade-in py-3'>
      <Row className='justify-content-center'>
        <Col md={userInfo?.role === 'student' ? 12 : 6}>
          <Row className="d-flex align-items-stretch">
            {/* Account Settings Section */}
            <Col lg={userInfo?.role === 'student' ? 6 : 12} className="d-flex flex-column mb-4 mb-lg-0">
              <div className='premium-form-container h-100 shadow-sm w-100'>
                <div className='text-center mb-4'>
                  <div 
                    className='avatar-circle bg-info text-white d-inline-flex align-items-center justify-content-center mb-3 shadow-sm'
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      fontSize: '1.5rem', 
                      borderRadius: '50%',
                      backgroundImage: `url(${image || 'https://via.placeholder.com/150'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '3px solid white'
                    }}
                  >
                    {!image && <i className="fas fa-user-cog"></i>}
                  </div>
                  <h3 className='font-weight-bold'>Account Settings</h3>
                  <p className='text-muted small'>Update your login credentials</p>
                </div>

                {message && <Message variant="danger">{message}</Message>}
                {success && <Message variant="success">Profile Updated Successfully!</Message>}
                
                {loading ? (
                  <Loader />
                ) : error ? (
                  <Message variant="danger">{error}</Message>
                ) : (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className='mb-3'>
                      <Form.Label className='premium-label small uppercase font-weight-bold text-secondary'>Full Name</Form.Label>
                      <Form.Control
                        type="name"
                        placeholder="Enter name"
                        value={name}
                        className='premium-input'
                        onChange={(e) => setName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email" className='mb-3'>
                      <Form.Label className='premium-label small uppercase font-weight-bold text-secondary'>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        className='premium-input'
                        onChange={(e) => setEmail(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="image" className='mb-3'>
                      <Form.Label className='premium-label small uppercase font-weight-bold text-secondary'>Profile Picture URL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Paste image link here"
                        value={image}
                        className='premium-input'
                        onChange={(e) => setImage(e.target.value)}
                      ></Form.Control>
                      <Form.Text className="text-muted small">
                        Paste a direct link to your photo (e.g. from Google Drive or Imgur)
                      </Form.Text>
                    </Form.Group>

                    <hr className='my-4' />
                    <p className='text-muted small mb-3 uppercase font-weight-bold'>Security</p>

                    <Form.Group controlId="password" title="Leave blank to keep same password"  className='mb-3'>
                      <Form.Label className='premium-label small uppercase font-weight-bold text-secondary'>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        className='premium-input'
                        onChange={(e) => setPassword(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" style={{ marginBottom: '2rem' }}>
                      <Form.Label className='premium-label small uppercase font-weight-bold text-secondary'>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        className='premium-input'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary" className='premium-btn w-100 rounded-pill shadow-sm'>
                      Update My Account
                    </Button>
                  </Form>
                )}
              </div>
            </Col>

            {/* Student Details Section (Read-Only) */}
            {userInfo?.role === 'student' && (
              <Col lg={6} className="d-flex flex-column">
                <div className='premium-form-container h-100 shadow-sm w-100'>
                  <div className='text-center mb-4'>
                    <div 
                      className='avatar-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3 shadow-sm'
                      style={{ width: '70px', height: '70px', fontSize: '1.5rem', borderRadius: '50%' }}
                    >
                      <i className="fas fa-id-card"></i>
                    </div>
                    <h3 className='font-weight-bold'>Student Information</h3>
                    <Badge variant="warning" className="text-dark">Read-Only</Badge>
                  </div>

                  {loadingStudent ? <Loader /> : studentInfo ? (
                    <div className="mt-3">
                       <Row className="mb-3 pb-2 border-bottom">
                         <Col xs={6} className="text-secondary small font-weight-bold uppercase">Student ID</Col>
                         <Col xs={6} className="text-right font-weight-bold">{studentInfo.studentId || "N/A"}</Col>
                       </Row>
                       <Row className="mb-3 pb-2 border-bottom">
                         <Col xs={6} className="text-secondary small font-weight-bold uppercase">Room / Block</Col>
                         <Col xs={6} className="text-right font-weight-bold">{studentInfo.roomNo} / {studentInfo.blockNo}</Col>
                       </Row>
                       <Row className="mb-3 pb-2 border-bottom">
                         <Col xs={6} className="text-secondary small font-weight-bold uppercase">Course</Col>
                         <Col xs={6} className="text-right font-weight-bold text-primary">{studentInfo.course}</Col>
                       </Row>
                       <Row className="mb-3 pb-2 border-bottom">
                         <Col xs={6} className="text-secondary small font-weight-bold uppercase">Phone</Col>
                         <Col xs={6} className="text-right font-weight-bold">{studentInfo.contact}</Col>
                       </Row>
                       <Row className="mb-3 pb-2 border-bottom">
                         <Col xs={6} className="text-secondary small font-weight-bold uppercase">Father Contact</Col>
                         <Col xs={6} className="text-right font-weight-bold">{studentInfo.fatherContact}</Col>
                       </Row>
                       <Row className="mb-3 pb-2 border-bottom">
                         <Col xs={6} className="text-secondary small font-weight-bold uppercase">Address</Col>
                         <Col xs={6} className="text-right small">{studentInfo.address}, {studentInfo.city}</Col>
                       </Row>
                       
                       <div className="bg-light p-3 rounded mt-4 border">
                         <i className="fas fa-info-circle mr-2 text-info"></i>
                         <span className="small text-muted italic">Note: If any of the above information is incorrect, please contact the Hostel Warden for updates.</span>
                       </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted py-5 italic">Could not load detailed student record.</p>
                  )}
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileView;
