import axios from "axios";
import {
  COMPLAINT_CREATE_REQUEST,
  COMPLAINT_CREATE_SUCCESS,
  COMPLAINT_CREATE_FAIL,
  COMPLAINT_MY_LIST_REQUEST,
  COMPLAINT_MY_LIST_SUCCESS,
  COMPLAINT_MY_LIST_FAIL,
  COMPLAINT_ALL_LIST_REQUEST,
  COMPLAINT_ALL_LIST_SUCCESS,
  COMPLAINT_ALL_LIST_FAIL,
  COMPLAINT_UPDATE_REQUEST,
  COMPLAINT_UPDATE_SUCCESS,
  COMPLAINT_UPDATE_FAIL,
} from "../constants/complaintConstants.jsx";

export const createComplaint = (complaintData) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/complaints", complaintData, config);

    dispatch({ type: COMPLAINT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const listMyComplaints = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_MY_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/complaints/my", config);

    dispatch({ type: COMPLAINT_MY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_MY_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const listAllComplaints = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_ALL_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/complaints", config);

    dispatch({ type: COMPLAINT_ALL_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_ALL_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updateComplaintStatus = (id, status, adminComment) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/complaints/${id}`, { status, adminComment }, config);

    dispatch({ type: COMPLAINT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_UPDATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
