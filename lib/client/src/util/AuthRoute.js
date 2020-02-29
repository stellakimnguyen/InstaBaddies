import React from 'react'
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? <Redirect to='/' /> : <Component {...props} /> // wherever was clicked, login or signin if not authenticated
    }
  />
);

export default AuthRoute;
