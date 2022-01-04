import {
  INITIAL_STATE_LOGIN_REQUEST,
  INITIAL_STATE_LOGIN,
  INITIAL_STATE_LOGIN_ERROR,
  INITIAL_STATE_LOG_OUT_REQUEST,
  INITIAL_STATE_LOG_OUT,
  INITIAL_STATE_LOG_OUT_ERROR,
  INITIAL_STATE_PROFILE_REQUEST,
  INITIAL_STATE_PROFILE,
  INITIAL_STATE_PROFILE_ERROR
} from "../types";

const INITIAL_STATE = {
  userInfo: null,
  isLoggedIn: false,
  isLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INITIAL_STATE_LOGIN_REQUEST:
    case INITIAL_STATE_LOG_OUT_REQUEST:
    case INITIAL_STATE_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
        userInfo: null
      };

    case INITIAL_STATE_LOGIN:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true
      };

    case INITIAL_STATE_LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        userInfo: null
      };

    case INITIAL_STATE_LOG_OUT:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        userInfo: null
      };

    case INITIAL_STATE_LOG_OUT_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case INITIAL_STATE_PROFILE:
      return {
        ...state,
        isLoading: false,
        userInfo: action.payload,
      };

    case INITIAL_STATE_PROFILE_ERROR:
      return {
        ...state,
        isLoading: false,
        userInfo: null,
      };

    default:
      return state;
  }
};