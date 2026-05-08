import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useHistory, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "./searchBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { listNotifications } from "../actions/notificationActions.jsx";

const Header = () => {
  const [expanded, setExpanded] = React.useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const notificationList = useSelector((state) => state.notificationList);
  const { notifications } = notificationList;

  const unreadCount = notifications
    ? notifications.filter((n) => !n.readBy.includes(userInfo?._id)).length
    : 0;

  React.useEffect(() => {
    if (userInfo) {
      dispatch(listNotifications());
    }
  }, [dispatch, userInfo]);

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/login");
  };

  const hasPermission = (permission) => {
    if (!userInfo) return false;
    if (userInfo.role === 'admin') return true;
    return userInfo.permissions && userInfo.permissions.includes(permission);
  };

  return (
    <header>
      <Navbar 
        variant="dark" 
        expand="lg" 
        collapseOnSelect 
        className="premium-navbar"
        expanded={expanded}
        onToggle={(expand) => setExpanded(expand)}
      >
        <Container>
          <LinkContainer to="/" onClick={() => setExpanded(false)}>
            <Navbar.Brand className="font-weight-bold d-flex align-items-center">
              <i className="fas fa-university mr-2 text-info"></i>
              <span style={{ letterSpacing: '1px' }}>ResiTrack</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto align-items-center">
              {userInfo && userInfo.role !== 'student' && (
                <Route render={({ history }) => <SearchBox history={history} />} />
              )}
            </Nav>
            
            <Nav className="mx-auto align-items-center text-center">
              {userInfo && (
                <>
                  {userInfo.role === 'student' ? (
                    <LinkContainer to="/my-attendance" onClick={() => setExpanded(false)}>
                      <Nav.Link className="align-items-center text-nowrap px-3 py-2 py-lg-0 mx-1">
                        <i className="fas fa-clipboard-list mr-2 text-info"></i> Attendance
                      </Nav.Link>
                    </LinkContainer>
                  ) : hasPermission("Manage Attendance") && (
                    <LinkContainer to="/attendance" onClick={() => setExpanded(false)}>
                      <Nav.Link className="align-items-center text-nowrap px-3 py-2 py-lg-0 mx-1">
                        <i className="fas fa-clipboard-list mr-2 text-info"></i> Attendance
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  {hasPermission("Add Students") && (
                    <LinkContainer to="/addStudent" onClick={() => setExpanded(false)}>
                      <Nav.Link className="align-items-center text-nowrap px-3 py-2 py-lg-0 mx-1">
                        <i className="fas fa-user-plus mr-2 text-info"></i> Add Student
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  {hasPermission("Reports Access") && (
                    <LinkContainer to="/analysis" onClick={() => setExpanded(false)}>
                      <Nav.Link className="align-items-center text-nowrap px-3 py-2 py-lg-0 mx-1">
                        <i className="fas fa-chart-line mr-2 text-info"></i> Analysis
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  {hasPermission("Student Registration Approval") && (
                    <LinkContainer to="/approvals" onClick={() => setExpanded(false)}>
                      <Nav.Link className="align-items-center text-nowrap px-3 py-2 py-lg-0 mx-1">
                        <i className="fas fa-check-circle mr-2 text-info"></i> Approvals
                      </Nav.Link>
                    </LinkContainer>
                  )}
                </>
              )}
            </Nav>

            <Nav className="ml-auto align-items-center">
              {userInfo ? (
                <NavDropdown 
                  title={
                    <span className="d-flex align-items-center">
                      <div className="avatar-circle-sm mr-2 bg-info">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                      {userInfo.name}
                    </span>
                  } 
                  id="username" 
                  className="premium-dropdown"
                >
                  <LinkContainer to="/profile" onClick={() => setExpanded(false)}>
                    <NavDropdown.Item><i className="fas fa-user-circle mr-2"></i> Profile</NavDropdown.Item>
                  </LinkContainer>
                  
                  {userInfo.role === 'admin' && (
                    <>
                      <LinkContainer to="/userList" onClick={() => setExpanded(false)}>
                        <NavDropdown.Item><i className="fas fa-users mr-2"></i> Manage Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/staff" onClick={() => setExpanded(false)}>
                        <NavDropdown.Item><i className="fas fa-user-shield mr-2"></i> Staff Management</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}

                  {userInfo.role === 'student' && (
                    <LinkContainer to="/my-leaves" onClick={() => setExpanded(false)}>
                      <NavDropdown.Item><i className="fas fa-calendar-times mr-2"></i> My Leaves</NavDropdown.Item>
                    </LinkContainer>
                  )}

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => { logoutHandler(); setExpanded(false); }} className="text-danger">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="btn btn-outline-info rounded-pill px-4 ml-lg-3 my-2 my-lg-0">
                    <i className="fas fa-user mr-2"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && (
                <LinkContainer to="/notifications" onClick={() => setExpanded(false)}>
                  <Nav.Link className="position-relative ml-lg-3">
                    <i className="fas fa-bell fa-lg text-info"></i>
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', marginTop: '-10px', marginLeft: '-5px' }}>
                        {unreadCount}
                      </span>
                    )}
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
