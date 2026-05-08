import {
  GRIEVANCE_CREATE_REQUEST,
  GRIEVANCE_CREATE_SUCCESS,
  GRIEVANCE_CREATE_FAIL,
  GRIEVANCE_CREATE_RESET,
  GRIEVANCE_MY_LIST_REQUEST,
  GRIEVANCE_MY_LIST_SUCCESS,
  GRIEVANCE_MY_LIST_FAIL,
  GRIEVANCE_ALL_LIST_REQUEST,
  GRIEVANCE_ALL_LIST_SUCCESS,
  GRIEVANCE_ALL_LIST_FAIL,
  GRIEVANCE_UPDATE_REQUEST,
  GRIEVANCE_UPDATE_SUCCESS,
  GRIEVANCE_UPDATE_FAIL,
  GRIEVANCE_UPDATE_RESET,
} from "../constants/grievanceConstants.jsx";

export const grievanceCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case GRIEVANCE_CREATE_REQUEST:
      return { loading: true };
    case GRIEVANCE_CREATE_SUCCESS:
      return { loading: false, success: true, grievance: action.payload };
    case GRIEVANCE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case GRIEVANCE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const grievanceMyListReducer = (state = { grievances: [] }, action) => {
  switch (action.type) {
    case GRIEVANCE_MY_LIST_REQUEST:
      return { loading: true };
    case GRIEVANCE_MY_LIST_SUCCESS:
      return { loading: false, grievances: action.payload };
    case GRIEVANCE_MY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const grievanceAllListReducer = (state = { grievances: [] }, action) => {
  switch (action.type) {
    case GRIEVANCE_ALL_LIST_REQUEST:
      return { loading: true };
    case GRIEVANCE_ALL_LIST_SUCCESS:
      return { loading: false, grievances: action.payload };
    case GRIEVANCE_ALL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const grievanceUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case GRIEVANCE_UPDATE_REQUEST:
      return { loading: true };
    case GRIEVANCE_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case GRIEVANCE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case GRIEVANCE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
