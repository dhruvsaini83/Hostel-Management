import React from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import BroadcastForm from "../components/broadcastForm";

const StaffDashboard = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const hasPermission = (permission) => {
    return userInfo.permissions && userInfo.permissions.includes(permission);
  };

  const modules = [
    {
      title: "Attendance Management",
      permission: "Manage Attendance",
      icon: "fas fa-clipboard-list",
      color: "primary",
      link: "/attendance",
      description: "Mark daily attendance and view student records.",
    },
    {
      title: "Student Registration",
      permission: "Student Registration Approval",
      icon: "fas fa-check-circle",
      color: "success",
      link: "/approvals",
      description: "Review and approve new student applications.",
    },
    {
      title: "Add Students",
      permission: "Add Students",
      icon: "fas fa-user-plus",
      color: "info",
      link: "/addStudent",
      description: "Manually register new students to the system.",
    },
    {
      title: "Leave Management",
      permission: "Leave Management",
      icon: "fas fa-calendar-times",
      color: "warning",
      link: "/leaves",
      description: "Approve or reject student leave requests.",
    },
    {
      title: "View Reports",
      permission: "Reports Access",
      icon: "fas fa-chart-bar",
      color: "dark",
      link: "/analysis",
      description: "Access detailed attendance and performance reports.",
    },
  ];

  const filteredModules = modules.filter(m => hasPermission(m.permission));

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Staff Dashboard</h1>
          <p className="text-muted">Welcome back, {userInfo.name}. Access your assigned modules below.</p>
        </Col>
      </Row>

      <Row>
        {filteredModules.map((module, index) => (
          <Col md={4} key={index} className="mb-4">
            <LinkContainer to={module.link} style={{ cursor: 'pointer' }}>
              <Card className={`h-100 shadow-sm border-0 border-top-premium border-${module.color}`}>
                <Card.Body className="text-center">
                  <div className={`icon-circle bg-${module.color} text-white mb-3 mx-auto`}>
                    <i className={`${module.icon} fa-2x`}></i>
                  </div>
                  <Card.Title className="font-weight-bold">{module.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {module.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
        ))}
        {filteredModules.length === 0 && (
          <Col>
            <Card className="text-center p-5 shadow-sm border-0">
               <i className="fas fa-lock fa-4x text-muted mb-3"></i>
               <h3>No Permissions Assigned</h3>
               <p>Please contact your administrator to assign permissions to your account.</p>
            </Card>
          </Col>
        )}
      </Row>

      {hasPermission("Send Broadcast") && <BroadcastForm />}
    </Container>
  );
};

export default StaffDashboard;
