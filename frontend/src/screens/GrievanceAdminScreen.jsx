import React, { useState, useEffect } from "react";
import { Container, Table, Card, Badge, Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listAllGrievances, updateGrievanceStatus } from "../actions/grievanceActions.jsx";
import { GRIEVANCE_UPDATE_RESET } from "../constants/grievanceConstants.jsx";
import Message from "../components/message";
import Loader from "../components/loader";

const GrievanceAdminScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [status, setStatus] = useState("Approved");
  const [adminComment, setAdminComment] = useState("");

  const dispatch = useDispatch();

  const grievanceAllList = useSelector((state) => state.grievanceAllList);
  const { loading, error, grievances } = grievanceAllList;

  const grievanceUpdate = useSelector((state) => state.grievanceUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = grievanceUpdate;

  useEffect(() => {
    if (successUpdate) {
      setShowModal(false);
      setAdminComment("");
      dispatch({ type: GRIEVANCE_UPDATE_RESET });
      dispatch(listAllGrievances());
    } else {
      dispatch(listAllGrievances());
    }
  }, [dispatch, successUpdate]);

  const openModal = (grievance) => {
    setSelectedGrievance(grievance);
    setShowModal(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateGrievanceStatus(selectedGrievance._id, status, adminComment));
  };

  return (
    <Container className="py-4">
      <h2 className="font-weight-bold mb-4">Manage Attendance Grievances</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="shadow-sm border-0 rounded-lg overflow-hidden">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Requested Status</th>
                <th>Reason</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((g) => (
                <tr key={g._id}>
                  <td>
                    <div className="font-weight-bold">{g.student?.name}</div>
                    <div className="small text-muted">{g.student?.email}</div>
                  </td>
                  <td>{g.date}</td>
                  <td>
                    <Badge variant={g.correctStatus === "Present" ? "success" : g.correctStatus === "Absent" ? "danger" : "warning"}>
                      {g.correctStatus}
                    </Badge>
                  </td>
                  <td className="small" title={g.reason}>
                    {g.reason?.substring(0, 50)}...
                  </td>
                  <td>
                    <Badge variant={g.status === "Approved" ? "success" : g.status === "Pending" ? "info" : "danger"} pill>
                      {g.status}
                    </Badge>
                  </td>
                  <td>
                    {g.status === "Pending" && (
                      <Button variant="info" size="sm" className="rounded-pill px-3" onClick={() => openModal(g)}>
                        Review
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {grievances.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted italic">No grievances pending review.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="font-weight-bold">Review Grievance</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {selectedGrievance && (
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Student:</span>
                <span className="font-weight-bold">{selectedGrievance.student?.name}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Date:</span>
                <span className="font-weight-bold">{selectedGrievance.date}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Requested Status:</span>
                <Badge variant={selectedGrievance.correctStatus === "Present" ? "success" : "danger"}>
                  {selectedGrievance.correctStatus}
                </Badge>
              </div>
              <div className="mt-3 p-3 bg-light rounded small">
                <div className="font-weight-bold mb-1">Reason:</div>
                {selectedGrievance.reason}
              </div>
              {selectedGrievance.proof && (
                <div className="mt-2 text-right">
                  <a href={selectedGrievance.proof} target="_blank" rel="noopener noreferrer" className="small text-info font-weight-bold">
                    <i className="fas fa-external-link-alt mr-1"></i> View Proof
                  </a>
                </div>
              )}
            </div>
          )}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="status" className="mb-3">
              <Form.Label className="small font-weight-bold">Take Action</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="premium-input"
              >
                <option value="Approved">Approve & Correct Attendance</option>
                <option value="Rejected">Reject Request</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="adminComment" className="mb-4">
              <Form.Label className="small font-weight-bold">Admin Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Briefly explain your decision..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="premium-input"
              />
            </Form.Group>

            <Button type="submit" variant="info" className="w-100 rounded-pill py-2 font-weight-bold shadow-sm" disabled={loadingUpdate}>
              {loadingUpdate ? "Processing..." : "Submit Decision"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GrievanceAdminScreen;
