import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // to have different pages on diff routes
// import 'bootswatch/dist/sketchy/bootstrap.min.css';
import themeFile from "./util/theme";
import jwtDecode from "jwt-decode";
import axios from "axios";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
// we should 1. authenticate THEN 2. set state
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Components
import Navbar from "./components/Navbar";

import AuthRoute from "./util/AuthRoute";
// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

// MUI color theme
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
const theme = createMuiTheme(themeFile);

// want to get token once application has started
// let authenticated
const token = localStorage.FBIdToken;
if (token) {
  // want to decode token to get expiry date
  const decodedToken = jwtDecode(token);
  // if token is expired then want to redirect to login page
  if (decodedToken.exp * 1000 < Date.now()) {
    // redux func will delete token and logout user
    store.dispatch(logoutUser());
    window.location.href = "login";
  } else {
    // authenticated = true;
    // redux : sets authenticated to true
    // so when we do getUserData, we can get data
    store.dispatch({ type: SET_AUTHENTICATED });

    // after refreshing the page, axios default header disappears so we need to reinitiate it
    axios.defaults.headers.common["Authorization"] = token;

    store.dispatch(getUserData());
  }
}

export default class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}
