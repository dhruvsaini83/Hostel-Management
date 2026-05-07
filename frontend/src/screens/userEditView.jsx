import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/message";
import Loader from "../components/loader";
import FormContainer from "../components/formContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditView = ({ match, history }) => {
  const userId = match.params.userId;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [status, setStatus] = useState("approved");

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push("/userList");
    } else {
      if (!user || !user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role || "staff");
        setStatus(user.status || "approved");
      }
    }
  }, [dispatch, history, userId, user, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, role, status }));
  };

  return (
    <div className='fade-in'>
      <Link to="/userList" className="btn btn-light shadow-sm rounded-pill px-3 mb-4">
        <i className="fas fa-arrow-left mr-2"></i> Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        <p className="text-muted">Update administrative user roles and account status.</p>
        
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Card className="p-4 border-0 shadow-sm bg-light mb-4">
              <Form.Group controlId="name" className='mb-3'>
                <Form.Label className='premium-label'>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  className='premium-input'
                  onChange={(e) => setName(e.target.value)}
                  disabled={user.email === 'admin@gmail.com'}
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
                  disabled={user.email === 'admin@gmail.com'}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="role" className='mb-3'>
                <Form.Label className='premium-label'>Account Role</Form.Label>
                <Form.Control
                  as="select"
                  value={role}
                  className='premium-input'
                  onChange={(e) => setRole(e.target.value)}
                  disabled={user.email === 'admin@gmail.com'}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="student">Student</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="status" className='mb-0'>
                <Form.Label className='premium-label'>Account Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  className='premium-input'
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={user.email === 'admin@gmail.com'}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Control>
              </Form.Group>
            </Card>

            {user.email !== 'admin@gmail.com' ? (
              <Button type="submit" variant="primary" className='premium-btn w-100'>
                Update User Account
              </Button>
            ) : (
              <Message variant="info">This is the Super Admin account and cannot be modified here.</Message>
            )}
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditView;
