import React, { useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listNotifications, markNotificationAsRead } from "../actions/notificationActions.jsx";
import Message from "../components/message";
import Loader from "../components/loader";

const NotificationScreen = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const notificationList = useSelector((state) => state.notificationList);
  const { loading, error, notifications } = notificationList;

  const notificationMarkRead = useSelector((state) => state.notificationMarkRead);
  const { success: successRead } = notificationMarkRead;

  useEffect(() => {
    dispatch(listNotifications());
  }, [dispatch, successRead]);

  const readHandler = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="mb-4 text-center">
            <i className="fas fa-bell text-info mr-2"></i> Your Notifications
          </h2>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : notifications.length === 0 ? (
            <Message variant="info">No notifications found.</Message>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification._id} 
                className={`mb-3 shadow-sm border-0 premium-card ${!notification.readBy.includes(userInfo?._id) ? 'border-left-info' : ''}`}
                style={{ borderRadius: '15px' }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 font-weight-bold">{notification.title}</h5>
                    <div className="d-flex align-items-center">
                      <small className="text-muted mr-3">
                        {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </small>
                      {!notification.readBy.includes(userInfo?._id) ? (
                        <Badge variant="info">New</Badge>
                      ) : (
                        <Badge variant="light" className="text-muted border">Read</Badge>
                      )}
                    </div>
                  </div>
                  <Card.Text className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                    {notification.message}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-info font-weight-bold">
                      <i className="fas fa-user-shield mr-1"></i> From: {notification.sender?.name || 'Admin'}
                    </small>
                    {!notification.readBy.includes(userInfo?._id) && (
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        className="rounded-pill px-3"
                        onClick={() => readHandler(notification._id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
      <style>{`
        .border-left-info {
          border-left: 5px solid #17a2b8 !important;
        }
        .premium-card {
          transition: transform 0.2s;
        }
        .premium-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </Container>
  );
};

export default NotificationScreen;
