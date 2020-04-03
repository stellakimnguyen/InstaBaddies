import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from 'styled-components';

// Redux stuff
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

// MUI stuff
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// const styles = (theme) => ({
//   ...theme
// })
const styles = {
  textField: {
    margin: "10px auto 10px auto",
    color: 'black',
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 18
  },
  progress: {
    position: "absolute"
  },
  customOutline: {
    borderRadius: 10,
  }
};

class login extends Component {
  // controlled component for form submission , can use react dev tools
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errors: {},
      isPasswordShown: false,
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

    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = event => {
    // the target is from whichever Textfield it was in
    // want to set the input value to its corresponding state value
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleClickShowPassword = () => {
    this.setState({ isPasswordShown: !this.state.isPasswordShown });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;

    return (
      <Container>
        <Content>
          <PageTitle>login</PageTitle>
          <LoginForm noValidate onSubmit={this.handleSubmit}>
            <CredsInput
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email} // only shows if there's an error
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              variant="outlined"
              InputProps={{ classes: {notchedOutline: classes.customOutline} }}
              style={{ borderRadius: 10 }}
              fullWidth
            />
            <CredsInput
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password} // only shows if there's an error
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              InputProps={{ classes: {notchedOutline: classes.customOutline} }}
              style={{ borderRadius: 10 }}
              variant="outlined"
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
              disabled={loading}
            >
              login
              {loading && (
                <CircularProgress size={20} className={classes.progress} />
              )}
            </LoginButton>
            <br />
            <br />
            <small>
              Don't have an account ? Sign up <Link to="/signup">here</Link>
            </small>
          </LoginForm>
        </Content>
      </Container>
    );
  }
}

const Container = styled.div`
  display: table;
  height: calc(100vh - 95px);
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

const Content = styled.div`
  display: table-cell;
  vertical-align: middle;
`

const PageTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 10px;
`

const LoginForm = styled.form`
  display: block;
`

const CredsInput = styled(TextField)`
  background: white;
`

const LoginButton = styled(Button)`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  position: relative;
  background: linear-gradient(45deg, #85E0FF 30%, #7CFF9B 90%);
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 10px;
`

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

/**
 * Take what we need from the global state seen in store.js
 * which is user and UI and map to our component props
 * which allows us to do this.props.loginUser(userData, this.props.history)
 * don't need to show data/posts in login
 * @param {object} state The global state
 */
const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

/**
 * which functions we need to use
 */
const mapActionsToProps = {
  loginUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login));
