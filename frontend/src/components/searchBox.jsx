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
      <Form.Control
        type='text'
        value={keyword}
        name='q'
        placeholder='Search students...'
        className='mr-2'
        onChange={(e) => setKeyword(e.target.value)}
        style={{ minWidth: '220px' }}
      ></Form.Control>
      <Button 
        className='p-2 font-weight-bold flex-shrink-0 text-uppercase' 
        type='submit' 
        variant='outline-info'
        style={{ borderRadius: '8px', color: '#00f2fe', borderColor: '#00f2fe', fontSize: '0.85rem', letterSpacing: '1px' }}
      >
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
