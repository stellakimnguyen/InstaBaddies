import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import Header from './components/Header';
import Login from './components/Login';
import Post from './components/Post';
import Signup from './components/Signup';
import User from './components/User';
import Welcome from './components/Welcome';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route exact path="/user" component={User} />
            <Route path="/user/:post_id" component={Post} />
            {/* <Route exact path="/user/:id" component={User} /> */}
            {/* <Route path="/user/:id/:post_id" component={Post} /> */}
          </Switch>
        </BrowserRouter>

      </div>
    );
  }
}

