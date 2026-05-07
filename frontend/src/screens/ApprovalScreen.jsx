import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Card, Modal, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import Message from "../components/message";
import Loader from "../components/loader";

const ApprovalScreen = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get("/users/pending", config);
      setPendingUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusHandler = async (id, status) => {
    if (window.confirm(`Are you sure you want to ${status} this user?`)) {
      try {
        setUpdateLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.put(`/users/${id}/status`, { status }, config);
        setUpdateLoading(false);
        setShowModal(false);
        fetchPendingUsers();
      } catch (err) {
        alert(err.response && err.response.data.message ? err.response.data.message : err.message);
        setUpdateLoading(false);
      }
    }
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Student Registration Approvals</h1>
          <p className="text-muted">Review, approve, or reject pending student registrations.</p>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table striped bordered hover responsive className="table-sm">
              <thead className="bg-light">
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>MOBILE</th>
                  <th>ROOM / BLOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>{user.mobile || "N/A"}</td>
                    <td>
                      {user.registrationDetails 
                        ? `${user.registrationDetails.roomNo || '?'} / ${user.registrationDetails.blockNo || '?'}` 
                        : "No Details"}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        className="btn-sm mr-2"
                        onClick={() => openDetails(user)}
                      >
                        <i className="fas fa-eye"></i> Details
                      </Button>
                      <Button
                        variant="success"
                        className="btn-sm mr-2"
                        onClick={() => statusHandler(user._id, "approved")}
                        disabled={updateLoading}
                      >
                        <i className="fas fa-check"></i> Approve
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => statusHandler(user._id, "rejected")}
                        disabled={updateLoading}
                      >
                        <i className="fas fa-times"></i> Reject
                      </Button>
                    </td>
                  </tr>
                ))}
                {pendingUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No pending approval requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Student Registration Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <h6 className="font-weight-bold text-primary mb-3">Basic Information</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Name:</strong> {selectedUser.name}</ListGroup.Item>
                  <ListGroup.Item><strong>Email:</strong> {selectedUser.email}</ListGroup.Item>
                  <ListGroup.Item><strong>Mobile:</strong> {selectedUser.mobile}</ListGroup.Item>
                  <ListGroup.Item><strong>Applied On:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <h6 className="font-weight-bold text-primary mb-3">Hostel & Personal Details</h6>
                {selectedUser.registrationDetails ? (
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Room No:</strong> {selectedUser.registrationDetails.roomNo}</ListGroup.Item>
                    <ListGroup.Item><strong>Block No:</strong> {selectedUser.registrationDetails.blockNo}</ListGroup.Item>
                    <ListGroup.Item><strong>Course:</strong> {selectedUser.registrationDetails.course}</ListGroup.Item>
                    <ListGroup.Item><strong>Father's Contact:</strong> {selectedUser.registrationDetails.fatherContact}</ListGroup.Item>
                    <ListGroup.Item><strong>City:</strong> {selectedUser.registrationDetails.city}</ListGroup.Item>
                    <ListGroup.Item><strong>Address:</strong> {selectedUser.registrationDetails.address}</ListGroup.Item>
                  </ListGroup>
                ) : (
                  <div className="text-center p-3 text-muted">No additional details available.</div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button 
            variant="danger" 
            onClick={() => statusHandler(selectedUser._id, "rejected")}
            disabled={updateLoading}
          >
            Reject Request
          </Button>
          <Button 
            variant="success" 
            onClick={() => statusHandler(selectedUser._id, "approved")}
            disabled={updateLoading}
          >
            Approve & Create Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApprovalScreen;
