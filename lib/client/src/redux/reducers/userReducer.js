import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  SET_FOLLOW
} from "../types";
// import { setupMaster } from "cluster";

const initialState = {
  authenticated: false,
  credentials: {},
  posts: [],
  notifications: [],
  loading: false,
  isFollowing: false
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
        loading: false, // when profile is set, not loading anymore, in case it was true
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case FOLLOW_USER:
      return {
        ...state,
        loading: false,
        isFollowing: true,
        ...action.payload
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        loading: false,
        isFollowing: false,
        ...action.payload
      };
    // case SET_FOLLOW:
    //   return {
    //     ...state,

    //   };
    default:
      return state;
  }
}
