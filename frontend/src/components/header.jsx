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
            <Navbar.Brand>RegiTrack</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className="ml-auto align-items-center">
              {/* Dropdown for Small Screens Only */}
              <NavDropdown title="More" id="more-dropdown" className="d-lg-none">
                <LinkContainer to="/attendance">
                  <NavDropdown.Item>Attendance</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/addStudent">
                  <NavDropdown.Item>Add Student</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/analysis">
                  <NavDropdown.Item>View Analysis</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              {/* Direct Links for Large Screens Only */}
              <LinkContainer to="/attendance">
                <Nav.Link className="d-none d-lg-flex align-items-center text-nowrap">Attendance</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/addStudent">
                <Nav.Link className="d-none d-lg-flex align-items-center text-nowrap">Add Student</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/analysis">
                <Nav.Link className="d-none d-lg-flex align-items-center text-nowrap">View Analysis</Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username" className="ml-lg-3">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <LinkContainer to="/userList">
                      <NavDropdown.Item>Users List</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
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
