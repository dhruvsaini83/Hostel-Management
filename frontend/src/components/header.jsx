import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useHistory, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "./searchBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = () => {
  const [expanded, setExpanded] = React.useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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
              <span style={{ letterSpacing: '1px' }}>RegiTrack</span>
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
