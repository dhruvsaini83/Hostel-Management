import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={7} lg={6} className='premium-form-container'>
          {children}
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer
