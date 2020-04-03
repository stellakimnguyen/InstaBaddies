import React, { Component } from "react";
// import axios from "axios"; // axios stuff now done in userActions.js with redux
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Container, Content, PageTitle, LoginForm, InfoInput,
  LoginButton } from './introStyle.js';
import styled, { css } from 'styled-components';

// Redux stuff
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

// MUI stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
  textField: {
    margin: "10px auto 10px auto"
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 15
  },
  progress: {
    position: "absolute"
  },
  customOutline: {
    borderRadius: 10,
  }
};

class signup extends Component {
  // controlled component for form submission , can use react dev tools
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    // need in order to display errors with redux
    // need to get errors and set it to our local errors
    // to be efficient, only set if we received errors
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
  }

  handleSubmit = event => {
    // after pressing submit, don't want to show default behaviour of showing password in path
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      username: this.state.username
    };
    // this axios stuff is abstracted by redux below
    // axios
    //   .post("/signup", newUserData)
    //   .then(res => {
    //     console.log(res.data);
    //     // on response, we receive a firebase authentication token
    //     // that can be stored in localstorage so it is still
    //     // accessible after a browser session ends
    //     localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
    //     this.setState({
    //       loading: false
    //     });
    //     // react's way of redirecting to a URL
    //     // url in this case is home page
    //     this.props.history.push("/");
    //   })
    //   .catch(err => {
    //     this.setState({
    //       errors: err.response.data,
    //       loading: false
    //     });
    //   });

    // redux handler logoutUser(user data, history for redirect)
    this.props.signupUser(newUserData, this.props.history);
  };
  handleChange = event => {
    // the target is from whichever Textfield it was in
    // want to set the input value to its corresponding state value
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;

    return (
      <Container>
        <SignUpContent>
          <PageTitle>sign up</PageTitle>
          <LoginForm noValidate onSubmit={this.handleSubmit}>
            <InfoInput
              id="username"
              name="username"
              type="text"
              label="Username"
              className={classes.textField}
              helperText={errors.username}
              error={errors.username ? true : false}
              value={this.state.username}
              onChange={this.handleChange}
              variant="outlined"
              InputProps={{ classes: {notchedOutline: classes.customOutline} }}
              style={{ borderRadius: 10 }}
              fullWidth
            />

            <InfoInput
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              variant="outlined"
              InputProps={{ classes: {notchedOutline: classes.customOutline} }}
              style={{ borderRadius: 10 }}
              fullWidth
            />

            <InfoInput
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password} // only shows if there's an error
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              variant="outlined"
              InputProps={{ classes: {notchedOutline: classes.customOutline} }}
              style={{ borderRadius: 10 }}
              fullWidth
            />
            <InfoInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              helperText={errors.confirmPassword} // only shows if there's an error
              error={errors.confirmPassword ? true : false}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              variant="outlined"
              InputProps={{ classes: {notchedOutline: classes.customOutline} }}
              style={{ borderRadius: 10 }}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <LoginButton
              type="submit"
              variant="outlined"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              signup
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </LoginButton>
            <br />
            <br />
            <small>
              Already have an account ? Login <Link to="/login">here</Link>
            </small>
          </LoginForm>
        </SignUpContent>
      </Container>
    );
  }
}

const SignUpContent = styled(Content)`
  width: 487px;
`

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

// export default withStyles(styles)(signup);
// connect components with props and actions from redux
export default connect(mapStateToProps, { signupUser })(
  withStyles(styles)(signup)
);
