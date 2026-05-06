import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "./searchBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = ({ history }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/login");
  };
  return (
    <header>
      <Navbar variant="dark" expand="lg" collapseOnSelect className="premium-navbar">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold d-flex align-items-center">
              <i className="fas fa-university mr-2 text-info"></i>
              <span style={{ letterSpacing: '1px' }}>RegiTrack</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className="ml-auto align-items-center">
              {/* Mobile Menu Dropdown */}
              <NavDropdown 
                title={<><i className="fas fa-th-large mr-1"></i> Dashboard</>} 
                id="more-dropdown" 
                className="d-lg-none"
              >
                <LinkContainer to="/attendance">
                  <NavDropdown.Item><i className="fas fa-clipboard-list mr-2"></i> Attendance</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/addStudent">
                  <NavDropdown.Item><i className="fas fa-user-plus mr-2"></i> Add Student</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/analysis">
                  <NavDropdown.Item><i className="fas fa-chart-line mr-2"></i> View Analysis</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              {/* Desktop Desktop Links */}
              <LinkContainer to="/attendance">
                <Nav.Link className="d-none d-lg-flex align-items-center text-nowrap px-3 mx-1">
                  <i className="fas fa-clipboard-list mr-2 text-info"></i> Attendance
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/addStudent">
                <Nav.Link className="d-none d-lg-flex align-items-center text-nowrap px-3 mx-1">
                  <i className="fas fa-user-plus mr-2 text-info"></i> Add Student
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/analysis">
                <Nav.Link className="d-none d-lg-flex align-items-center text-nowrap px-3 mx-1">
                  <i className="fas fa-chart-line mr-2 text-info"></i> Analysis
                </Nav.Link>
              </LinkContainer>
              
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
                  className="ml-lg-3 premium-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item><i className="fas fa-user-circle mr-2"></i> Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <LinkContainer to="/userList">
                      <NavDropdown.Item><i className="fas fa-users mr-2"></i> Manage Users</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler} className="text-danger">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="btn btn-outline-info rounded-pill px-4 ml-lg-3">
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
