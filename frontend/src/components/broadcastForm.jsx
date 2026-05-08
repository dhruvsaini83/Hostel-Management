import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../actions/notificationActions.jsx";
import { NOTIFICATION_CREATE_RESET } from "../constants/notificationConstants.jsx";
import Message from "../components/message";

const BroadcastForm = () => {
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
    <Card className="shadow-sm border-0 rounded-lg overflow-hidden mt-4">
      <Card.Header className="bg-white border-0 pt-4 px-4">
        <h5 className="font-weight-bold mb-0">Send Broadcast Message</h5>
        <p className="text-muted small">Notify students or staff instantly</p>
      </Card.Header>
      <Card.Body className="p-4">
        {error && <Message variant="danger">{error}</Message>}
        <Form onSubmit={submitBroadcastHandler}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="broadcastTitle" className="mb-3">
                <Form.Label className="font-weight-bold">Message Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title (e.g. Hostel Fee Notice)"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                  className="bg-light border-0 py-3 px-3"
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
                  style={{ borderRadius: '10px', height: '48px' }}
                >
                  <option value="all">Everyone</option>
                  <option value="student">Students Only</option>
                  <option value="staff">Staff Only</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="broadcastMessage">
            <Form.Label className="font-weight-bold">Message Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Type your message here..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              required
              className="bg-light border-0 p-3"
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>
          <Button
            type="submit"
            variant="info"
            className="mt-3 px-5 py-2 rounded-pill font-weight-bold shadow-sm"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Broadcast Message"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BroadcastForm;
