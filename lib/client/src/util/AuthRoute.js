import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types"; // for good practices

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={
      props =>
        authenticated === true ? <Redirect to="/" /> : <Component {...props} /> // wherever was clicked, login or signin if not authenticated
    }
  />
);

// () => ({}) : a function that returns an object
const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

// for good practices
AuthRoute.prototypes = {
  user: PropTypes.object.isRequired
};

// export default AuthRoute;
// connect with redux
export default connect(mapStateToProps)(AuthRoute);
