import axios from "axios";
import {
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATION_CREATE_REQUEST,
  NOTIFICATION_CREATE_SUCCESS,
  NOTIFICATION_CREATE_FAIL,
  NOTIFICATION_MARK_READ_REQUEST,
  NOTIFICATION_MARK_READ_SUCCESS,
  NOTIFICATION_MARK_READ_FAIL,
} from "../constants/notificationConstants.jsx";

export const listNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/notifications", config);

    dispatch({
      type: NOTIFICATION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createNotification = (notification) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/notifications", notification, config);

    dispatch({
      type: NOTIFICATION_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const markNotificationAsRead = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_MARK_READ_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`/notifications/${id}/read`, {}, config);

    dispatch({ type: NOTIFICATION_MARK_READ_SUCCESS });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_MARK_READ_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
