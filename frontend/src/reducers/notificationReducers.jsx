import {
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATION_CREATE_REQUEST,
  NOTIFICATION_CREATE_SUCCESS,
  NOTIFICATION_CREATE_FAIL,
  NOTIFICATION_CREATE_RESET,
  NOTIFICATION_MARK_READ_REQUEST,
  NOTIFICATION_MARK_READ_SUCCESS,
  NOTIFICATION_MARK_READ_FAIL,
} from "../constants/notificationConstants.jsx";

export const notificationListReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case NOTIFICATION_LIST_REQUEST:
      return { loading: true, notifications: [] };
    case NOTIFICATION_LIST_SUCCESS:
      return { loading: false, notifications: action.payload };
    case NOTIFICATION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const notificationCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATION_CREATE_REQUEST:
      return { loading: true };
    case NOTIFICATION_CREATE_SUCCESS:
      return { loading: false, success: true, notification: action.payload };
    case NOTIFICATION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case NOTIFICATION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const notificationMarkReadReducer = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATION_MARK_READ_REQUEST:
      return { loading: true };
    case NOTIFICATION_MARK_READ_SUCCESS:
      return { loading: false, success: true };
    case NOTIFICATION_MARK_READ_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
