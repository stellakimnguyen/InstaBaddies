import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // to have different pages on diff routes
import 'bootswatch/dist/sketchy/bootstrap.min.css';
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

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            {/* <Route exact path="/" component={home} /> */}
            <Route path="/login" component={Login} />
            {/* <Route exact path="/login" component={login} /> */}
            <Route path="/signup" component={Signup} />
            {/* <Route exact path="/signup" component={signup} /> */}
            <Route exact path="/user" component={User} />
            <Route path="/user/:post_id" component={Post} />
            {/* <Route exact path="/user/:id" component={User} /> */}
            {/* <Route path="/user/:id/:post_id" component={Post} /> */}
          </Switch>
        </Router>

      </div>
    );
  }
}

