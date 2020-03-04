import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED
} from "../types";
// import { setupMaster } from "cluster";

const initialState = {
  authenticated: false,
  credentials: {},
  posts: [],
  notifications: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state, // spread current state
        authenticated: true
      };
    case SET_UNAUTHENTICATED: // for logout, return initial state where there are no credentials and authenticated = false
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        ...action.payload
      };
    default:
      return state;
  }
}
