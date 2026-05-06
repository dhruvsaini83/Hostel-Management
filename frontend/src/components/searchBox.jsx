import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({history}) => {
  const [keyword, setKeyword] = useState('')
  const submitHandler = (e) => {
      e.preventDefault ()
      if(keyword.trim()){
        history.push(`/search/${keyword}`)
      }else{
          history.push(`/`)
      }
  }
  return (
    <Form onSubmit={submitHandler} className="d-flex flex-nowrap align-items-center ml-lg-4 my-2 my-lg-0">
      <div className="position-relative d-flex align-items-center">
        <Form.Control
          type='text'
          value={keyword}
          name='q'
          placeholder='Search students...'
          className='premium-input'
          onChange={(e) => setKeyword(e.target.value)}
          style={{ minWidth: '220px', height: '40px', paddingLeft: '15px' }}
        ></Form.Control>
        <Button 
          className='p-2 font-weight-bold flex-shrink-0 text-uppercase ml-2 d-flex align-items-center' 
          type='submit' 
          variant='outline-info'
          style={{ 
            borderRadius: '10px', 
            color: '#00f2fe', 
            borderColor: '#00f2fe', 
            fontSize: '0.75rem', 
            letterSpacing: '1px',
            height: '40px'
          }}
        >
          <i className="fas fa-search mr-2"></i> Search
        </Button>
      </div>
    </Form>
  )
}

export default SearchBox
