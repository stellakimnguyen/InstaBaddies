import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // to have different pages on diff routes
// import 'bootswatch/dist/sketchy/bootstrap.min.css';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Components
import Navbar from './components/Navbar';

import AuthRoute from './util/AuthRoute';
// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// MUI color theme
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
const theme = createMuiTheme(themeFile);

// want to get token once application has started
let authenticated
const token = localStorage.FBIdToken;
if (token) {
  // want to decode token to get expiry date
  const decodedToken = jwtDecode(token);
  // if token is expired then want to redirect to login page
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = 'login';
    authenticated = false
  } else {
    authenticated = true;
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
                <AuthRoute exact path="/login" component={login} authenticated={authenticated} />
                <AuthRoute exact path="/signup" component={signup} authenticated={authenticated} />
              </Switch>
            </div>
          </Router>

        </Provider>

      </MuiThemeProvider>
    );
  }
}

