import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/message'
import Loader from '../../components/loader'
import FormContainer from '../../components/formContainer'
import { login } from '../../actions/userActions'

const LoginView = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <div className='fade-in mt-5'>
      <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email' className='mb-3'>
            <Form.Label className='premium-label'>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              className='premium-input'
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
  
          <Form.Group controlId='password' style={{ marginBottom: '2rem' }}>
            <Form.Label className='premium-label'>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              className='premium-input'
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
  
          <Button type='submit' variant='primary' className='premium-btn w-100 mb-3'>
            Sign In
          </Button>
        </Form>
  
        <Row className='py-3'>
          <Col className='text-center'>
            <span className='text-muted'>New Customer?</span>{' '}
            <Link 
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className='font-weight-bold text-info'
              style={{ textDecoration: 'none' }}
            >
              Register Here
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </div>
  )
}

export default LoginView
