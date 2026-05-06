import React from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({ variant, children }) => {
  const getIcon = () => {
    switch (variant) {
      case 'success': return <i className="fas fa-check-circle mr-2"></i>
      case 'danger': return <i className="fas fa-exclamation-triangle mr-2"></i>
      case 'info': return <i className="fas fa-info-circle mr-2"></i>
      default: return null
    }
  }

  return (
    <Alert 
      variant={variant} 
      className="rounded-pill shadow-sm py-2 px-4 d-flex align-items-center justify-content-center text-center mx-auto fade show"
      style={{ maxWidth: 'fit-content', border: 'none', fontWeight: '500' }}
    >
      {getIcon()} {children}
    </Alert>
  )
}

Message.defaultProps = {
  variant: 'info',
}

export default Message
