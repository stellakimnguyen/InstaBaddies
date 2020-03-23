import {
  SET_POSTS,
  LOADING_DATA,
  DELETE_POST,
  DELETE_COMMENT,
  CREATE_POST,
  SET_POST,
  SUBMIT_COMMENT,
  GET_ALL_USERS
} from "../types";

const initialState = {
  posts: [], // holds all posts on user or home page
  post: {}, // to see details of only 1 post
  users: [], // holds all users for search
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload, // an array of posts
        loading: false
      };
    case SET_POST:
      return {
        ...state,
        post: action.payload
      };
    case GET_ALL_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      }
    case DELETE_POST: // rather than reloading page with new data, just remove from current state posts array
      let index = state.posts.findIndex(post => post.postId === action.payload);
      state.posts.splice(index, 1); // removes 1 element of array starting at index
      return {
        ...state
      };
    case DELETE_COMMENT: // rather than reloading page with new data, just remove from current state posts array
      let index2 = state.post.comments.findIndex(
        comment => comment.commentId === action.payload
      );
      state.post.comments.splice(index2, 1); // removes 1 element of array starting at index
      return {
        ...state
      };
    case CREATE_POST:
      return {
        ...state, // state as it is
        posts: [action.payload, ...state.posts] // add new post as first element in our posts array then spread the rest
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments] // newest comment goes to top of array
        }
      };
    default:
      return state;
  }
}
