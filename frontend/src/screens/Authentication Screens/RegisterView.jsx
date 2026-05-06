import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/message";
import Loader from "../../components/loader";
import FormContainer from "../../components/formContainer";
import { register } from "../../actions/userActions";

const RegisterView = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <div className='fade-in mt-5'>
      <FormContainer>
        <h1>Sign Up</h1>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className='mb-3'>
            <Form.Label className='premium-label'>Name</Form.Label>
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

          <Form.Group controlId="password" title="Password must be at least 6 characters" className='mb-3'>
            <Form.Label className='premium-label'>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              className='premium-input'
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword" style={{ marginBottom: '2rem' }}>
            <Form.Label className='premium-label'>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              className='premium-input'
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className='premium-btn w-100 mb-3'>
            Create Account
          </Button>
        </Form>

        <Row className="py-3">
          <Col className='text-center'>
            <span className='text-muted'>Have an Account?</span>{" "}
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
    </div>
  );
};

export default RegisterView;
