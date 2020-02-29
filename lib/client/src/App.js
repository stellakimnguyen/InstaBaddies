import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // to have different pages on diff routes
// import 'bootswatch/dist/sketchy/bootstrap.min.css';

// Components
import Navbar from './components/Navbar';
import Header from './components/Header';
import Login from './components/Login';
import Post from './components/Post';
import Signup from './components/Signup';
import User from './components/User';
import Home from './components/Home';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// MUI color theme
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff'
    },
    typography: {
      useNextVariants: true
    }
  }
})


export default class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className='App'>
          <Router>
            <Navbar />
            <div className="container">

              <Switch>
                <Route exact path="/" component={home} />
                <Route exact path="/login" component={login} />
                <Route exact path="/signup" component={signup} />
              </Switch>
            </div>
          </Router>

        </div>

      </MuiThemeProvider>
    );
  }
}

