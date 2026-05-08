import axios from "axios";
import {
  GRIEVANCE_CREATE_REQUEST,
  GRIEVANCE_CREATE_SUCCESS,
  GRIEVANCE_CREATE_FAIL,
  GRIEVANCE_MY_LIST_REQUEST,
  GRIEVANCE_MY_LIST_SUCCESS,
  GRIEVANCE_MY_LIST_FAIL,
  GRIEVANCE_ALL_LIST_REQUEST,
  GRIEVANCE_ALL_LIST_SUCCESS,
  GRIEVANCE_ALL_LIST_FAIL,
  GRIEVANCE_UPDATE_REQUEST,
  GRIEVANCE_UPDATE_SUCCESS,
  GRIEVANCE_UPDATE_FAIL,
} from "../constants/grievanceConstants.jsx";

export const createGrievance = (grievance) => async (dispatch, getState) => {
  try {
    dispatch({ type: GRIEVANCE_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/grievances", grievance, config);

    dispatch({ type: GRIEVANCE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GRIEVANCE_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const listMyGrievances = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GRIEVANCE_MY_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/grievances/my", config);

    dispatch({ type: GRIEVANCE_MY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GRIEVANCE_MY_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const listAllGrievances = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GRIEVANCE_ALL_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/grievances", config);

    dispatch({ type: GRIEVANCE_ALL_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GRIEVANCE_ALL_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updateGrievanceStatus = (id, status, adminComment) => async (dispatch, getState) => {
  try {
    dispatch({ type: GRIEVANCE_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`/grievances/${id}`, { status, adminComment }, config);

    dispatch({ type: GRIEVANCE_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: GRIEVANCE_UPDATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
