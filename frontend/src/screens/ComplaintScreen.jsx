import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Table, Badge, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createComplaint, listMyComplaints } from "../actions/complaintActions.jsx";
import { COMPLAINT_CREATE_RESET } from "../constants/complaintConstants.jsx";
import Message from "../components/message";
import Loader from "../components/loader";

const ComplaintScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electrical");
  const [roomNo, setRoomNo] = useState("");
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const complaintCreate = useSelector((state) => state.complaintCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = complaintCreate;

  const complaintMyList = useSelector((state) => state.complaintMyList);
  const { loading, error, complaints } = complaintMyList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successCreate) {
      setShowModal(false);
      setTitle("");
      setDescription("");
      setCategory("Electrical");
      setRoomNo("");
      setImage("");
      dispatch({ type: COMPLAINT_CREATE_RESET });
      dispatch(listMyComplaints());
    } else {
      dispatch(listMyComplaints());
    }
  }, [dispatch, successCreate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createComplaint({ title, description, category, roomNo, image }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <Badge variant="warning">Pending</Badge>;
      case "In Progress": return <Badge variant="info">In Progress</Badge>;
      case "Resolved": return <Badge variant="success">Resolved</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="font-weight-bold text-dark">Complaints & Maintenance</h2>
          <p className="text-muted">Raise a ticket for any room or hostel maintenance issues.</p>
        </Col>
        <Col className="text-right">
          <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus mr-2"></i> New Complaint
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Admin Comment</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td className="small text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="font-weight-bold">{c.title}</div>
                    <div className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>{c.description}</div>
                  </td>
                  <td><Badge variant="light" className="border">{c.category}</Badge></td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td className="small text-muted italic">{c.adminComment || "-"}</td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No complaints raised yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {/* New Complaint Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="font-weight-bold">Raise New Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {errorCreate && <Message variant="danger">{errorCreate}</Message>}
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="title" className="mb-3">
                  <Form.Label className="small font-weight-bold">Complaint Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Fan not working"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="premium-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="category" className="mb-3">
                  <Form.Label className="small font-weight-bold">Category</Form.Label>
                  <Form.Control
                    as="select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="premium-input"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="roomNo" className="mb-3">
                  <Form.Label className="small font-weight-bold">Room Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 204"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    required
                    className="premium-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="image" className="mb-3">
                  <Form.Label className="small font-weight-bold">Image URL (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Link to photo of issue"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="premium-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="description" className="mb-4">
              <Form.Label className="small font-weight-bold">Detailed Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Explain the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="premium-input"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 rounded-pill py-2 font-weight-bold shadow-sm" disabled={loadingCreate}>
              {loadingCreate ? "Submitting..." : "Submit Ticket"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ComplaintScreen;
