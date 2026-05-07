import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeView from "./screens/homeView";
import AddStudentView from "./screens/addStudentView";
import AnalysisView from "./screens/analysisView";
import LoginView from "./screens/Authentication Screens/LoginView";
import RegisterView from "./screens/Authentication Screens/RegisterView";
import StudentDetailsView from "./screens/studentDetailsView";
import AttendanceView from "./screens/attendanceView";
import ProfileView from "./screens/profileView";
import UserListView from "./screens/userListView";
import UserEditView from "./screens/userEditView";
import AdminDashboard from "./screens/AdminDashboard";
import StaffDashboard from "./screens/StaffDashboard";
import StudentDashboard from "./screens/StudentDashboard";
import MyAttendanceView from "./screens/MyAttendanceView";
import StaffManagementScreen from "./screens/StaffManagementScreen";
import ApprovalScreen from "./screens/ApprovalScreen";
import ProtectedRoute from "./components/protectedRoute";
import ScrollToTop from "./components/scrollToTop";
import { useSelector } from "react-redux";

const DashboardWrapper = (props) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!userInfo) return <HomeView {...props} />;
  
  if (userInfo.role === "admin") return <AdminDashboard {...props} />;
  if (userInfo.role === "staff") return <StaffDashboard {...props} />;
  if (userInfo.role === "student") return <StudentDashboard {...props} />;
  
  return <HomeView {...props} />;
};

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
          <Switch>
            <ProtectedRoute path="/user/:userId/edit" component={UserEditView} roles={["admin"]} />
            <ProtectedRoute path="/userList" component={UserListView} roles={["admin"]} />
            <ProtectedRoute path="/staff" component={StaffManagementScreen} roles={["admin"]} />
            <ProtectedRoute path="/approvals" component={ApprovalScreen} permissions={["Student Registration Approval"]} />
            
            <ProtectedRoute path="/profile" component={ProfileView} />
            <ProtectedRoute path="/attendance" component={AttendanceView} permissions={["Manage Attendance"]} />
            <ProtectedRoute path="/analysis" component={AnalysisView} permissions={["Reports Access"]} />
            <ProtectedRoute path="/addStudent" component={AddStudentView} permissions={["Add Students"]} />
            <ProtectedRoute path="/student/edit/:id" component={AddStudentView} exact permissions={["Edit Students"]} />
            
            <ProtectedRoute path="/my-attendance" component={MyAttendanceView} roles={["student"]} />
            
            <Route path="/student/:id" component={StudentDetailsView} exact />
            <Route path="/login" component={LoginView} exact />
            <Route path="/register" component={RegisterView} exact />
            <Route path="/search/:keyword" component={HomeView} exact />
            <Route path="/page/:pageNumber" component={HomeView} exact />
            <Route path="/search/:keyword/page/:pageNumber" component={HomeView} exact />
            <Route path="/" component={DashboardWrapper} exact />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
