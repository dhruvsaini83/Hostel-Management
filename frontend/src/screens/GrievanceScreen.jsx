import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Table, Badge, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createGrievance, listMyGrievances } from "../actions/grievanceActions.jsx";
import { GRIEVANCE_CREATE_RESET } from "../constants/grievanceConstants.jsx";
import Message from "../components/message";
import Loader from "../components/loader";

const GrievanceScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [correctStatus, setCorrectStatus] = useState("Present");
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState("");

  const dispatch = useDispatch();

  const grievanceCreate = useSelector((state) => state.grievanceCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = grievanceCreate;

  const grievanceMyList = useSelector((state) => state.grievanceMyList);
  const { loading, error, grievances } = grievanceMyList;

  useEffect(() => {
    if (successCreate) {
      setShowModal(false);
      setDate("");
      setReason("");
      setProof("");
      dispatch({ type: GRIEVANCE_CREATE_RESET });
      dispatch(listMyGrievances());
    } else {
      dispatch(listMyGrievances());
    }
  }, [dispatch, successCreate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createGrievance({ date, correctStatus, reason, proof }));
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="font-weight-bold">Attendance Grievances</h2>
          <p className="text-muted">Report incorrect attendance markings and track their status.</p>
        </Col>
        <Col className="text-right">
          <Button className="rounded-pill px-4 btn-premium" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus mr-2"></i> Submit New Grievance
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="shadow-sm border-0 rounded-lg overflow-hidden">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Date</th>
                <th>Desired Status</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admin Comment</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((g) => (
                <tr key={g._id}>
                  <td>{g.date}</td>
                  <td>
                    <Badge variant={g.correctStatus === "Present" ? "success" : g.correctStatus === "Absent" ? "danger" : "warning"}>
                      {g.correctStatus}
                    </Badge>
                  </td>
                  <td className="small">{g.reason}</td>
                  <td>
                    <Badge variant={g.status === "Approved" ? "success" : g.status === "Pending" ? "info" : "danger"} pill>
                      {g.status}
                    </Badge>
                  </td>
                  <td className="small text-muted">{g.adminComment || "-"}</td>
                </tr>
              ))}
              {grievances.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted italic">No grievances submitted yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Submission Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="font-weight-bold">Submit Grievance</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {errorCreate && <Message variant="danger">{errorCreate}</Message>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="date" className="mb-3">
              <Form.Label className="small font-weight-bold">Attendance Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="premium-input"
              />
            </Form.Group>

            <Form.Group controlId="correctStatus" className="mb-3">
              <Form.Label className="small font-weight-bold">Correct Status Should Be</Form.Label>
              <Form.Control
                as="select"
                value={correctStatus}
                onChange={(e) => setCorrectStatus(e.target.value)}
                className="premium-input"
              >
                <option value="Present">Present (Hostel)</option>
                <option value="Absent">Absent (Outside)</option>
                <option value="Leave">Leave (Home)</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="reason" className="mb-3">
              <Form.Label className="small font-weight-bold">Reason for Correction</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Explain why the current marking is wrong..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="premium-input"
              />
            </Form.Group>

            <Form.Group controlId="proof" className="mb-4">
              <Form.Label className="small font-weight-bold">Proof Link (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Google Drive link or Image URL"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="premium-input"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 rounded-pill py-2 font-weight-bold shadow-sm" disabled={loadingCreate}>
              {loadingCreate ? "Submitting..." : "Submit Grievance Request"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GrievanceScreen;
