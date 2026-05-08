import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../actions/notificationActions.jsx";
import { NOTIFICATION_CREATE_RESET } from "../constants/notificationConstants.jsx";
import Message from "../components/message";
import Loader from "../components/loader";

const BroadcastScreen = () => {
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");

  const dispatch = useDispatch();

  const notificationCreate = useSelector((state) => state.notificationCreate);
  const { loading, error, success } = notificationCreate;

  useEffect(() => {
    if (success) {
      setBroadcastTitle("");
      setBroadcastMessage("");
      setBroadcastTarget("all");
      dispatch({ type: NOTIFICATION_CREATE_RESET });
      alert("Broadcast sent successfully!");
    }
  }, [success, dispatch]);

  const submitBroadcastHandler = (e) => {
    e.preventDefault();
    dispatch(
      createNotification({
        title: broadcastTitle,
        message: broadcastMessage,
        target: broadcastTarget,
      })
    );
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0 rounded-lg overflow-hidden premium-card">
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="font-weight-bold mb-0">
                <i className="fas fa-bullhorn mr-2"></i> Send Broadcast Message
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted mb-4">
                Send a notification to students, staff, or everyone instantly.
              </p>
              {error && <Message variant="danger">{error}</Message>}
              <Form onSubmit={submitBroadcastHandler}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="broadcastTitle" className="mb-3">
                      <Form.Label className="font-weight-bold">Message Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Hostel Fee Notice"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        required
                        className="bg-light border-0 py-2 px-3"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="broadcastTarget" className="mb-3">
                      <Form.Label className="font-weight-bold">Target Audience</Form.Label>
                      <Form.Control
                        as="select"
                        value={broadcastTarget}
                        onChange={(e) => setBroadcastTarget(e.target.value)}
                        className="bg-light border-0 px-3"
                        style={{ borderRadius: '10px', height: '45px' }}
                      >
                        <option value="all">Everyone</option>
                        <option value="student">Students Only</option>
                        <option value="staff">Staff Only</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="broadcastMessage" className="mb-4">
                  <Form.Label className="font-weight-bold">Message Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Type your message here..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                    className="bg-light border-0 p-3"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="rounded-pill py-2 font-weight-bold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader size="sm" className="mr-2" /> Sending...</>
                    ) : (
                      "Send Broadcast Now"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BroadcastScreen;
