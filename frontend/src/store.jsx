import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {} from "./actions/studentActions";
import {
  studentListReducer,
  studentAddReducer,
  studentDetailsReducer,
  getStudentsByRoomNoReducer,
  studentUpdateReducer,
  studentDeleteReducer,
} from "./reducers/studentsReducer";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  attendanceDataEnterReducer,
  attendanceAnalysisReducer,
  deleteAttendanceReducer,
  attendanceStudentStatsReducer,
} from "./reducers/attendanceReducer";
import {
  notificationListReducer,
  notificationCreateReducer,
  notificationMarkReadReducer,
} from "./reducers/notificationReducers.jsx";
import {
  grievanceCreateReducer,
  grievanceMyListReducer,
  grievanceAllListReducer,
  grievanceUpdateReducer,
} from "./reducers/grievanceReducers.jsx";
import {
  complaintCreateReducer,
  complaintMyListReducer,
  complaintAllListReducer,
  complaintUpdateReducer,
} from "./reducers/complaintReducers.jsx";

// Combine all reducers
const reducer = combineReducers({
  studentsList: studentListReducer,
  studentDetails: studentDetailsReducer,
  studentAdd: studentAddReducer,
  studentUpdate: studentUpdateReducer,
  studentDelete: studentDeleteReducer,
  getStudentsByRoomNo: getStudentsByRoomNoReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  attendanceDataEnter: attendanceDataEnterReducer,
  attendanceAnalysis: attendanceAnalysisReducer,
  attendanceDelete: deleteAttendanceReducer,
  attendanceStudentStats: attendanceStudentStatsReducer,
  notificationList: notificationListReducer,
  notificationCreate: notificationCreateReducer,
  notificationMarkRead: notificationMarkReadReducer,
  grievanceCreate: grievanceCreateReducer,
  grievanceMyList: grievanceMyListReducer,
  grievanceAllList: grievanceAllListReducer,
  grievanceUpdate: grievanceUpdateReducer,
  complaintCreate: complaintCreateReducer,
  complaintMyList: complaintMyListReducer,
  complaintAllList: complaintAllListReducer,
  complaintUpdate: complaintUpdateReducer,
});
// Load user from storage
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Initial app state
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];
// Create global store
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
