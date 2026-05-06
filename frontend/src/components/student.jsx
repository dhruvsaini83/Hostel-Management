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
      className="my-3 border-0 shadow-sm h-100 student-card overflow-hidden"
      onClick={handleCardClick}
      style={{ cursor: "pointer", borderRadius: "15px" }}
    >
      <div style={{ position: "relative" }}>
        <Card.Img
          variant="top"
          src={student.image}
          style={{ height: '220px', width: '100%', objectFit: 'cover' }}
        />
        <Badge
          variant={student.status === 'Outside' ? 'danger' : student.status === 'Home' ? 'info' : 'success'}
          style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.85rem', padding: '0.5em 0.8em', borderRadius: '10px' }}
        >
          {student.status || "Hostel"}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="mb-1 font-weight-bold" style={{ fontSize: '1.4rem', color: '#2c3e50', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {student.name}
        </Card.Title>
        <Card.Subtitle className="mb-4 text-muted" style={{ fontSize: '0.95rem' }}>
          <i className="fas fa-graduation-cap mr-2"></i> {student.category}
        </Card.Subtitle>

        <div className="mb-4 mt-auto">
          <div className="d-flex align-items-center mb-2" style={{ color: '#5a6268' }}>
            <div className="bg-light rounded p-2 mr-3 text-center" style={{ width: '35px' }}>
              <i className="fas fa-door-closed text-primary"></i>
            </div>
            <span style={{ fontWeight: '500', fontSize: '1.05rem' }}>Room {student.roomNo}</span>
          </div>
        </div>

        <a
          href={`tel:${student.contact}`}
          onClick={(e) => e.stopPropagation()}
          className="btn btn-primary btn-block rounded-pill font-weight-bold shadow-sm"
          style={{ padding: '10px 0', fontSize: '1.05rem', letterSpacing: '0.5px' }}
        >
          <i className="fas fa-phone-alt mr-2"></i> {student.contact}
        </a>
      </Card.Body>
    </Card>
  );
};

export default Student;
