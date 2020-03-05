import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => dispatch => {
  // dispatch handles asynchronous code
  dispatch({ type: LOADING_UI });
  // login and receive userData
  axios
    .post("/login", userData)
    .then(res => {
      // console.log(res.data);
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      // in case there are errors in our form
      dispatch({ type: CLEAR_ERRORS });
      // react's way of redirecting to a URL
      // url in this case is home page
      // this.props.history.push("/");
      history.push("/");
    })
    .catch(err => {
      // this.setState({
      //   errors: err.response.data,
      //   loading: false
      // });
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

// Get user data after they login
// reduceer does smt to the payload
// res.data is userData
export const getUserData = () => dispatch => {
  // before actually getting user, set the type variable
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch(err => console.error("Could not get user data \n", err.message));
};

export const signupUser = (newUserData, history) => dispatch => {
  // dispatch handles asynchronous code
  dispatch({ type: LOADING_UI });
  // login and receive userData
  axios
    .post("/signup", newUserData)
    .then(res => {
      // console.log(res.data);
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      // in case there are errors in our form
      dispatch({ type: CLEAR_ERRORS });
      // react's way of redirecting to a URL
      // url in this case is home page
      // this.props.history.push("/");
      history.push("/");
    })
    .catch(err => {
      // this.setState({
      //   errors: err.response.data,
      //   loading: false
      // });
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

const setAuthorizationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);

  // when logged in, in order to access any protected routes
  // we need to include our res.data.token in the authorization HEADER
  // so taking advantage of axios function, we can set that token in a header
  // and every ensuing axios request will have this token in the auth header !
  // even to unprotected routes
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

export const logoutUser = () => dispatch => {
  // delete the token
  localStorage.removeItem("FBIdToken");

  // delete the authorization header from defaults of axios
  delete axios.defaults.headers.common["Authorization"];
  dispatch({
    type: SET_UNAUTHENTICATED
  });
};

export const uploadImage = formData => dispatch => {
  // 1. call user loading action
  dispatch({ type: LOADING_USER });

  // 2. Upload image to server
  axios
    .post("/user/image", formData)
    .then(() => {
      // get user data that has new imageURL for profile image
      // so can load on page
      dispatch(getUserData());
    })
    .catch(err => console.error("Could not upload image", err.request));
};
