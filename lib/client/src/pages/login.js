import React, { Component } from 'react'
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/cam-icon.png';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// const styles = (theme) => ({
//   ...theme
// })
const styles = {
  form: {
    textAlign: 'center'
  },
  image: {
    margin: '50px auto 20px auto',
    width: '100px'
  },
  pageTitle: {
    margin: '10px auto 10px auto'
  },
  textField: {
    margin: '10px auto 10px auto'
  },
  button: {
    marginTop: 30,
    position: 'relatve'
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 15
  },
  progress: {
    position: 'absolute'
  }
}


class login extends Component {
  // controlled component for form submission , can use react dev tools
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    }
  }
  handleSubmit = (event) => {
    // after pressing submit, don't want to show default behaviour of showing password in path
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    }
  }
  handleChange = (event) => {
    // the target is from whichever Textfield it was in
    // want to set the input value to its corresponding state value
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt='camera' className={classes.image} />
          <Typography variant='h2' className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email} // only shows if there's an error
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth >

            </TextField>
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password} // only shows if there's an error
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth >

            </TextField>
            {errors.general && (
              <Typography
                variant="body2"
                className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              className={classes.button}
              disabled={loading} >

              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )

              }
            </Button>
            <br />
            <br />
            <small>Don't have an account ? Sign up <Link to="/signup" >here</Link></small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    )
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(login);
