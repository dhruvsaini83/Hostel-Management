import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/message";
import Loader from "../components/loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

const ProfileView = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

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
      }
    }
  }, [dispatch, history, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <div className='fade-in'>
      <Row className='justify-content-center'>
        <Col md={8} lg={6}>
          <div className='premium-form-container'>
            <div className='text-center mb-4'>
              <div 
                className='rounded-circle bg-info text-white d-inline-flex align-items-center justify-content-center mb-3 shadow'
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              >
                <i className="fas fa-user"></i>
              </div>
              <h2 className='font-weight-bold'>User Profile</h2>
              <p className='text-muted'>Manage your account settings</p>
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
                  <Form.Label className='premium-label'>Full Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter name"
                    value={name}
                    className='premium-input'
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className='mb-3'>
                  <Form.Label className='premium-label'>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    className='premium-input'
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <hr className='my-4' />
                <p className='text-muted small mb-3'>Change Password (Optional)</p>

                <Form.Group controlId="password" title="Leave blank to keep same password"  className='mb-3'>
                  <Form.Label className='premium-label'>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    className='premium-input'
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirmPassword" style={{ marginBottom: '2rem' }}>
                  <Form.Label className='premium-label'>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    className='premium-input'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className='premium-btn w-100'>
                  Save Changes
                </Button>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileView;
