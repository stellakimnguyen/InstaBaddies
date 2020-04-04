import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import CreatePost from "../posts/CreatePost";
import Notifications from "./Notifications";
import { fade, makeStyles } from "@material-ui/core/styles";
import styled from 'styled-components';

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
import Search from "../../util/Search";

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
    };
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
      <AppBar style={navbarstyle} elevation={0}>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <CreatePost />
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
              </Link>
              <Notifications />

              <Search
                user={this.props.user}
                history={this.props.history} />

            </Fragment>
          ) : (
            <Fragment>
              <NavButton color="inherit" component={Link} to="/">
                home
              </NavButton>
              <NavButton color="inherit" component={Link} to="/login">
                login
              </NavButton>
              <NavButton color="inherit" component={Link} to="/signup">
                signup
              </NavButton>
            </Fragment>
          )}
        </Toolbar>
        {/* <Dropdown /> */}
      </AppBar>
    );
  }
}

// STYLES
const navbarstyle = {
  background: 'linear-gradient(to right, #F5D961, #FE9C88)',
  boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.1)', //horizontal offset, vertical offset, blur, spread, color
}

const NavButton = styled(Button)`
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.15em;
  font-size: 16px;
`

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  user: state.user
});

export default connect(mapStateToProps, {getAllUsers})(withRouter(Navbar));
