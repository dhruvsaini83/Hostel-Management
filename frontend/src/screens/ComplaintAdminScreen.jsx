import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Card, Badge, Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listAllComplaints, updateComplaintStatus } from "../actions/complaintActions.jsx";
import { COMPLAINT_UPDATE_RESET } from "../constants/complaintConstants.jsx";
import Message from "../components/message";
import Loader from "../components/loader";

const ComplaintAdminScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [status, setStatus] = useState("In Progress");
  const [adminComment, setAdminComment] = useState("");

  const dispatch = useDispatch();

  const complaintAllList = useSelector((state) => state.complaintAllList);
  const { loading, error, complaints } = complaintAllList;

  const complaintUpdate = useSelector((state) => state.complaintUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = complaintUpdate;

  useEffect(() => {
    if (successUpdate) {
      setShowModal(false);
      setAdminComment("");
      dispatch({ type: COMPLAINT_UPDATE_RESET });
      dispatch(listAllComplaints());
    } else {
      dispatch(listAllComplaints());
    }
  }, [dispatch, successUpdate]);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status);
    setAdminComment(complaint.adminComment || "");
    setShowModal(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateComplaintStatus(selectedComplaint._id, status, adminComment));
  };

  return (
    <Container className="py-4">
      <h2 className="font-weight-bold mb-4 text-dark">Manage Complaints & Maintenance</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="border-0 shadow-sm rounded-lg overflow-hidden">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Student</th>
                <th>Room</th>
                <th>Title / Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className="font-weight-bold">{c.student?.name}</div>
                    <div className="small text-muted">{c.student?.email}</div>
                  </td>
                  <td><Badge variant="dark" className="px-3">{c.roomNo}</Badge></td>
                  <td>
                    <div className="font-weight-bold">{c.title}</div>
                    <Badge variant="light" className="border small">{c.category}</Badge>
                  </td>
                  <td>
                    <Badge variant={c.status === "Resolved" ? "success" : c.status === "Pending" ? "warning" : "info"} pill className="px-3">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="small text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => openModal(c)}>
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted italic">No complaints found in the system.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="font-weight-bold">Update Complaint Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {selectedComplaint && (
            <div className="mb-4">
              <div className="bg-light p-3 rounded mb-3">
                <h6 className="font-weight-bold mb-1">{selectedComplaint.title}</h6>
                <p className="small text-muted mb-2">{selectedComplaint.description}</p>
                {selectedComplaint.image && (
                    <a href={selectedComplaint.image} target="_blank" rel="noopener noreferrer" className="small text-primary font-weight-bold">
                        <i className="fas fa-image mr-1"></i> View Photo Proof
                    </a>
                )}
              </div>
              
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="status" className="mb-3">
                  <Form.Label className="small font-weight-bold">Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="premium-input"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="adminComment" className="mb-4">
                  <Form.Label className="small font-weight-bold">Admin Comment / Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Provide updates or resolution details..."
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    className="premium-input"
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 rounded-pill py-2 font-weight-bold shadow-sm" disabled={loadingUpdate}>
                  {loadingUpdate ? "Updating..." : "Save Changes"}
                </Button>
              </Form>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ComplaintAdminScreen;
