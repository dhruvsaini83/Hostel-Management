import {
  COMPLAINT_CREATE_REQUEST,
  COMPLAINT_CREATE_SUCCESS,
  COMPLAINT_CREATE_FAIL,
  COMPLAINT_CREATE_RESET,
  COMPLAINT_MY_LIST_REQUEST,
  COMPLAINT_MY_LIST_SUCCESS,
  COMPLAINT_MY_LIST_FAIL,
  COMPLAINT_ALL_LIST_REQUEST,
  COMPLAINT_ALL_LIST_SUCCESS,
  COMPLAINT_ALL_LIST_FAIL,
  COMPLAINT_UPDATE_REQUEST,
  COMPLAINT_UPDATE_SUCCESS,
  COMPLAINT_UPDATE_FAIL,
  COMPLAINT_UPDATE_RESET,
} from "../constants/complaintConstants.jsx";

export const complaintCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPLAINT_CREATE_REQUEST:
      return { loading: true };
    case COMPLAINT_CREATE_SUCCESS:
      return { loading: false, success: true, complaint: action.payload };
    case COMPLAINT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case COMPLAINT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const complaintMyListReducer = (state = { complaints: [] }, action) => {
  switch (action.type) {
    case COMPLAINT_MY_LIST_REQUEST:
      return { loading: true, complaints: [] };
    case COMPLAINT_MY_LIST_SUCCESS:
      return { loading: false, complaints: action.payload };
    case COMPLAINT_MY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const complaintAllListReducer = (state = { complaints: [] }, action) => {
  switch (action.type) {
    case COMPLAINT_ALL_LIST_REQUEST:
      return { loading: true, complaints: [] };
    case COMPLAINT_ALL_LIST_SUCCESS:
      return { loading: false, complaints: action.payload };
    case COMPLAINT_ALL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const complaintUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPLAINT_UPDATE_REQUEST:
      return { loading: true };
    case COMPLAINT_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case COMPLAINT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case COMPLAINT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
