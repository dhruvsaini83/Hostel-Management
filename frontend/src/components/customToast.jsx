import React from "react";
import { Toast } from "react-bootstrap";

const CustomToast = ({ show, onClose, message, variant = "success" }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "250px"
      }}
    >
      <Toast 
        show={show} 
        onClose={onClose} 
        delay={3000} 
        autohide 
        className={`bg-${variant} text-white shadow-lg border-0`}
      >
        <Toast.Header closeButton={false} className={`bg-${variant} text-white border-0 d-flex justify-content-between align-items-center`}>
          <strong className="mr-auto">
             <i className={`fas ${variant === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
             {variant === 'success' ? 'Success' : 'Notification'}
          </strong>
          <button 
            onClick={onClose} 
            className="text-white bg-transparent border-0 ml-2" 
            style={{ fontSize: '1.2rem', lineHeight: 1 }}
          >
            &times;
          </button>
        </Toast.Header>
        <Toast.Body className="font-weight-bold">
          {message}
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default CustomToast;
