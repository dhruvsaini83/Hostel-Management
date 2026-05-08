import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Form, Card, Modal, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/message";
import Loader from "../components/loader";
import { listUsers, deleteUser, updateUser } from "../actions/userActions";
import axios from "axios";

const StaffManagementScreen = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState(null);

  const permissionsList = [
    "Student Registration Approval",
    "Add Students",
    "Manage Attendance",
    "View Students",
    "Edit Students",
    "Read Only Access",
    "Reports Access",
    "Leave Management",
    "Send Broadcast",
  ];

  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { success: successUpdate } = userUpdate;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch, successDelete, successUpdate]);

  const handlePermissionChange = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const createStaffHandler = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setActionError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setActionError("Please enter a valid email address.");
      setLoadingAction(false);
      return;
    }

    // Mobile Validation
    if (mobile && mobile.length !== 10) {
      setActionError("Mobile number must be exactly 10 digits.");
      setLoadingAction(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        "/users/staff",
        { name, email, password, mobile, permissions: selectedPermissions },
        config
      );

      setLoadingAction(false);
      setShowCreateModal(false);
      dispatch(listUsers());
      resetForm();
    } catch (err) {
      setActionError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingAction(false);
    }
  };

  const updatePermissionsHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ 
      _id: selectedStaff._id, 
      permissions: selectedPermissions 
    }));
    setShowEditModal(false);
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(id));
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setMobile("");
    setSelectedPermissions([]);
    setSelectedStaff(null);
  };

  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setSelectedPermissions(staff.permissions || []);
    setShowEditModal(true);
  };

  const staffUsers = users ? users.filter((u) => u.role === "staff") : [];

  return (
    <div className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Staff Management</h1>
          <p className="text-muted">Create staff accounts and manage granular permissions.</p>
        </Col>
        <Col className="text-right">
          <Button className="my-3 btn-premium rounded-pill px-4" onClick={() => { resetForm(); setShowCreateModal(true); }}>
            <i className="fas fa-plus mr-2"></i> Create Staff
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table hover responsive className="premium-table">
              <thead className="bg-light text-dark">
                <tr>
                  <th>NAME / EMAIL</th>
                  <th>MOBILE</th>
                  <th>PERMISSIONS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {staffUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="font-weight-bold">{user.name}</div>
                      <div className="small text-muted">{user.email}</div>
                    </td>
                    <td>{user.mobile || "N/A"}</td>
                    <td>
                      <div className="d-flex flex-wrap" style={{ maxWidth: '400px' }}>
                        {user.permissions && user.permissions.length > 0 ? (
                          user.permissions.map((p, i) => (
                            <Badge key={i} variant="info" pill className="mr-1 mb-1 px-2 py-1 shadow-xs font-weight-normal">
                              {p}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted italic small">No permissions assigned</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        className="btn-sm rounded-pill px-3 mr-2"
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fas fa-key mr-1"></i> Permissions
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="btn-sm rounded-pill px-3"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
                {staffUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted italic">
                      No staff members have been created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Create Staff Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Create New Staff Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {actionError && <Message variant="danger">{actionError}</Message>}
          <Form onSubmit={createStaffHandler}>
            <Row>
              <Col md={6}>
                <h6 className="font-weight-bold text-primary mb-3">Basic Info</h6>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label className="small font-weight-bold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    className="premium-input"
                    onChange={(e) => setName(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label className="small font-weight-bold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    className="premium-input"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password" title="At least 6 characters" className="mb-3">
                  <Form.Label className="small font-weight-bold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    className="premium-input"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="mobile" className="mb-0">
                  <Form.Label className="small font-weight-bold">Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    className="premium-input"
                    onChange={(e) => setMobile(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <h6 className="font-weight-bold text-primary mb-3">Assign Permissions</h6>
                <div className="border p-3 rounded bg-light" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {permissionsList.map((permission) => (
                    <Form.Check
                      key={permission}
                      type="checkbox"
                      label={permission}
                      id={`create-perm-${permission}`}
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="mb-2 small font-weight-normal"
                    />
                  ))}
                </div>
              </Col>
            </Row>
            <Modal.Footer className="px-0 pb-0 pt-4 border-0">
              <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="rounded-pill px-4" disabled={loadingAction}>
                {loadingAction ? "Creating..." : "Create Staff Member"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Permissions Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Manage Staff Permissions</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedStaff && (
            <>
              <div className="mb-4 text-center">
                <h5 className="mb-1 font-weight-bold">{selectedStaff.name}</h5>
                <p className="text-muted small mb-0">{selectedStaff.email}</p>
              </div>
              <Form onSubmit={updatePermissionsHandler}>
                <h6 className="font-weight-bold text-info mb-3 small uppercase letter-spacing-1">Module Access Control</h6>
                <div className="border p-3 rounded bg-light mb-4">
                  {permissionsList.map((permission) => (
                    <Form.Check
                      key={permission}
                      type="checkbox"
                      label={permission}
                      id={`edit-perm-${permission}`}
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="mb-3 font-weight-normal"
                    />
                  ))}
                </div>
                <div className="d-grid gap-2">
                  <Button type="submit" variant="info" className="w-100 rounded-pill py-2 shadow-sm font-weight-bold">
                    Save Permission Updates
                  </Button>
                  <Button variant="outline-secondary" className="w-100 rounded-pill py-2 mt-2" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StaffManagementScreen;
