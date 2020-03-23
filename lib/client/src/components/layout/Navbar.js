import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import CreatePost from "../posts/CreatePost";
import Notifications from "./Notifications";
import withStyles from "@material-ui/core/styles/withStyles";
import { fade, makeStyles } from "@material-ui/core/styles";

import axios from "axios";

// MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import Alert from "@material-ui/lab/Alert";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import NotificationIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";

//TEST
import { getAllUsers } from "../../redux/actions/dataActions";

const styles = theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },

  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  inputRoot: {
    color: "inherit"
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  }
});

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {},
      showAlert: false,
      searchInput: "",
      test: [],
    };
  }

  if () {

  }
  
  handleEscKey = event => {
    event.preventDefault();

    this.setState({
      searchInput: event.target.value
    });

    if (event.key === "Enter") {
      // console.log("submitted from serachhhh");
      // console.log("user text : ", event.target);
      // if (event.target.value) {
      //   console.log(event.target.value.trim());
      //   const username = event.target.value.trim();
      //   console.log(this.state);
      //   const newPath = `/users/${this.props.user.credentials.username}/${username}`;
      // search for inputted name in firebase database
      // if successfull
      // if authenticated, then redirect to user's static profile page /user/:signedInAs/:username
      this.props.history.push(`/users/user30/user60`);
      // window.history.pushState(null, null, newPath);
      // axios
      //   .get(`/user/user60`)
      //   .then(res => {
      //     console.log(res.data);
      //     this.setState({
      //       results: res.data
      //     });
      //   })
      //   .catch(err => console.log(err));
      // }
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const searchUser = this.state.searchInput.trim(); //removes white space
    const signedInAs = this.props.user.credentials.username;

    //TO DO: Refactor and use props instead of axios (make it cleaner and call function from back)
    // this.setState({
    //   test: this.props.getAllUsers(),
    // }, () => { //ASYNC callback (for immediate response)
    //   console.log('res: ');
    //   console.log(this.props.getAllUsers());
    // });

    axios
      //.get(`/user/${searchUser}`)
      .get(`/users`)
      .then(res => {
        console.log('WE ARE HERE');
        console.log(res);
        console.log(res.data);
        this.setState({
          results: res.data,
          showAlert: false
        });
        console.log("user exists: ", this.state.results);
        this.props.history.push(`/users/${signedInAs}/${searchUser}`);
        //window.location.reload(false);
      })
      .catch(err => {
        console.log('We are in the error section');
        this.setState({
          showAlert: true
        });
        console.log("user does not exist ", this.state.results);
        console.log(err);
      });
  };

  handleOnChange = event => {
    this.setState({
      searchInput: event.target.value
    }, () => { //ASYNC callback (for immediate response)
      console.log(this.state.searchInput);
    });

    // if (event.key === "Enter") {
    //   this.props.history.push(`/users/user30/user60`);
    // }
  };

  render() {
    const {
      authenticated,
      classes,
      user: {
        credentials: { username, createdAt, imageUrl, bio, website },
        loading
      }
    } = this.props;

    const pathToUser =
      Object.size(this.state.results) > 0
        ? `/users/${this.props.user.credentials.username}/user60`
        : "/";

    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <CreatePost />
              {/* <MyButton tip="Create a Post">
                <AddIcon />
              </MyButton> */}
              {/* {console.log(
                "i am a happy authenticated navbar : ",
                authenticated
              )} */}

              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
              </Link>
              {/* <MyButton tip="Notifications">
                <NotificationIcon />
              </MyButton> */}
              <Notifications />
              <form onSubmit={this.handleSubmit}>
                {/* <form> */}
                <div className={classes.search}>
                  {/* <div className={classes.searchIcon}>
                  <Link to={pathToUser}>
                    <MyButton tip="Search">
                      <SearchIcon />
                    </MyButton>
                  </Link>
                </div> */}
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={{ "aria-label": "search" }}
                    // onKeyPress={this.handleEscKey}
                    onChange={this.handleOnChange}
                  />
                  {/* {console.log("path entered is :", pathToUser)} */}
                  {/* <Link to="users/user30/user60"> */}
                  <MyButton tip="Search" onClick={this.handleEscKey}>
                    <SearchIcon />
                  </MyButton>
                  {/* </Link> */}
                  {/* <Button
                    type="submit"
                    color="primary"
                    className={classes.button}
                  >
                    <SearchIcon />
                  </Button> */}
                </div>
              </form>
              {this.state.showAlert
                ? setTimeout(() => {
                    this.setState({
                      showAlert: false
                    });
                  }, 2000)
                : null}
              {this.state.showAlert ? (
                <Alert severity="warning">
                  User does not exist. Please try again.
                </Alert>
              ) : null}
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  user: state.user
});

export default connect(mapStateToProps, {getAllUsers})(withStyles(styles)(withRouter(Navbar)));
