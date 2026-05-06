import React, { useEffect } from "react";
import HomeView from "../src/screens/homeView";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";
import AddStudentView from "./screens/addStudentView";
import AnalysisView from "./screens/analysisView";
import LoginView from "./screens/Authentication Screens/LoginView";
import RegisterView from "./screens/Authentication Screens/RegisterView";
import StudentDetailsView from "./screens/studentDetailsView";
import AttendanceView from "./screens/attendanceView";
import ProfileView from "./screens/profileView";
import UserListView from "./screens/userListView";
import UserEditView from "./screens/userEditView";

import ProtectedRoute from "./components/protectedRoute";

import ScrollToTop from "./components/scrollToTop";

const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <Header />
      <ScrollToTop />
      <main className="py-3">
        <Container>
          <ProtectedRoute path="/user/:userId/edit" component={UserEditView} isAdmin />
          <ProtectedRoute path="/userList" component={UserListView} isAdmin />
          <ProtectedRoute path="/profile" component={ProfileView} />
          <ProtectedRoute path="/attendance" component={AttendanceView} />
          <ProtectedRoute path="/analysis" component={AnalysisView} isAdmin />
          <ProtectedRoute path="/addStudent" component={AddStudentView} isAdmin />
          <ProtectedRoute path="/student/edit/:id" component={AddStudentView} exact isAdmin />
          <Route path="/student/:id" component={StudentDetailsView} exact />
          <Route path="/login" component={LoginView} exact />
          <Route path="/register" component={RegisterView} exact />
          <Route path="/search/:keyword" component={HomeView} exact />
          <Route path="/page/:pageNumber" component={HomeView} exact />
          <Route
            path="/search/:keyword/page/:pageNumber"
            component={HomeView}
            exact
          />
          <Route path="/" component={HomeView} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
