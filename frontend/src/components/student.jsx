import React from "react";
import { Card, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Student = ({ studentDetails: student }) => {
  const history = useHistory();

  const handleCardClick = () => {
    history.push(`/student/${student._id}`);
  };

  return (
    <Card
      className="border-0 shadow-sm h-100 student-card overflow-hidden"
      onClick={handleCardClick}
      style={{ cursor: "pointer", borderRadius: "15px" }}
    >
      <div style={{ position: "relative" }}>
        <Card.Img
          variant="top"
          src={student.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
          className="card-img-top"
          style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />
        <div 
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px',
            zIndex: 1
          }}
        >
          <Badge
            className={`shadow-sm badge-${student.status === 'Outside' ? 'danger' : student.status === 'Home' ? 'info' : 'success'}`}
            style={{ 
              fontSize: '0.75rem', 
              padding: '6px 12px', 
              borderRadius: '30px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {student.status || "Hostel"}
          </Badge>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3 p-md-4">
        <div className="mb-2">
          <h5 className="mb-0 font-weight-bold text-dark text-truncate" style={{ fontSize: '1.25rem' }}>
            {student.name}
          </h5>
          <div className="text-muted small d-flex align-items-center mt-1">
            <i className="fas fa-graduation-cap mr-2 text-info"></i>
            {student.category}
          </div>
        </div>

        <div className="my-3 py-2 border-top border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <i className="fas fa-door-open mr-2 text-primary"></i>
            <span className="font-weight-bold text-secondary">Room {student.roomNo}</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="fas fa-th-large mr-2 text-info"></i>
            <span className="small text-muted">{student.blockNo || 'B1'}</span>
          </div>
        </div>

        <a
          href={`tel:${student.contact}`}
          onClick={(e) => e.stopPropagation()}
          className="btn btn-primary btn-block rounded-pill font-weight-bold shadow-sm py-2 mt-auto premium-btn"
          style={{ 
            background: 'linear-gradient(to right, #1e3c72, #2a5298)',
            border: 'none',
            fontSize: '0.95rem'
          }}
        >
          <i className="fas fa-phone-alt mr-2"></i> {student.contact}
        </a>
      </Card.Body>
    </Card>
  );
};

export default Student;
