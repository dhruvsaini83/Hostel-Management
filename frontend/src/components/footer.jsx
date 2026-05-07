import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col md={4} className='mb-4'>
            <h5>ResiTrack</h5>
            <p>
              An advanced Hostel Management System designed to streamline student registration, 
              attendance tracking, and room allocation with ease and precision.
            </p>
            <div className='social-icons mt-4'>
              <a href='#!'><i className='fab fa-facebook-f'></i></a>
              <a href='#!'><i className='fab fa-twitter'></i></a>
              <a href='#!'><i className='fab fa-instagram'></i></a>
              <a href='#!'><i className='fab fa-linkedin-in'></i></a>
            </div>
          </Col>
          
          <Col md={4} className='mb-4 text-md-center'>
            <h5>Quick Links</h5>
            <ul>
              <li><Link to='/' className='footer-link'>Home</Link></li>
              <li><Link to='/attendance' className='footer-link'>Attendance</Link></li>
              <li><Link to='/addStudent' className='footer-link'>Add Student</Link></li>
              <li><Link to='/analysis' className='footer-link'>Analysis</Link></li>
            </ul>
          </Col>
          
          <Col md={4} className='mb-4'>
            <h5>Contact Us</h5>
            <ul>
              <li>
                <i className='fas fa-map-marker-alt mr-3 text-info'></i>
                123 University Campus, Tech Park, City
              </li>
              <li className='mt-3'>
                <i className='fas fa-phone-alt mr-3 text-info'></i>
                +1 234 567 890
              </li>
              <li className='mt-3'>
                <i className='fas fa-envelope mr-3 text-info'></i>
                support@resitrack.com
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr />
        
        <Row className='footer-bottom'>
          <Col className='text-center pb-3'>
            Copyright &copy; {new Date().getFullYear()} ResiTrack. All Rights Reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
