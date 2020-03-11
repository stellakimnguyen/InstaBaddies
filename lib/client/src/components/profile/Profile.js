import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
import MyButton from "../../util/MyButton";
import axios from "axios";
import ProfileSkeleton from "../../util/ProfileSkeleton";
// Redux
import { connect } from "react-redux";
import {
  logoutUser,
  uploadImage,
  followUser,
  unfollowUser,
  getUserDataAndFollowing
} from "../../redux/actions/userActions";

// MUI stuff
import Button from "@material-ui/core/Button";
import { Paper, IconButton } from "@material-ui/core";
import MuiLink from "@material-ui/core/link";
import Typography from "@material-ui/core/Typography";

// Icons
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import PersonOutlineRoundedIcon from "@material-ui/icons/PersonOutlineRounded";

const styles = theme => ({
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%"
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle"
      },
      "& a": {
        color: theme.palette.primary.main
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
});

export class Profile extends Component {
  state = {
    user: {}
  };
  componentDidMount() {
    axios
      .get("/user")
      .then(res => {
        console.log(res.data);

        this.setState({
          user: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
  followedUser = () => {
    if (this.state.user.following && this.state.user.following["user10"])
      return true;
    else return false;
  };

  // TODO
  followUser = () => {
    // this.props.followUser(this.state.user.credentials.username, "user10");

    axios
      .post(`/user/${this.state.user.credentials.username}/following/user10`)
      .then(res => {
        // dispatch(getUserData());
        console.log(res);
        return axios.get(`/user`);
      })
      .then(res => {
        this.setState({
          user: res.data
        });
      })
      .catch(err => console.log(err));
  };

  unfollowUser = () => {
    // this.props.unfollowUser(this.state.user.credentials.username, "user10");

    axios
      .post(`/user/${this.state.user.credentials.username}/unfollowing/user10`)
      .then(res => {
        // dispatch(getUserData());
        console.log(res);
        return axios.get(`/user`);
      })
      .then(res => {
        this.setState({
          user: res.data
        });
      })
      .catch(err => console.log(err));
  };
  handleImageChange = e => {
    // 1. Get the file
    // event.target has a property files array and we can only select 1
    const image = e.target.files[0];

    // 2. Send a request with form data
    // formData.append(name, value, string or blob, filename);
    const formData = new FormData();
    formData.append("image", image, image.name);

    // 3. Send to server
    // could use axios, but let's centralize using Redux
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    // 1. Find input tag for uploading profile image
    const fileInput = document.getElementById("imageInput");

    // 2. click it
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  // TODO
  // somehow get other user's username to check their account out
  handleFollowChange = () => {
    // this.props.getUserDataAndFollowing("user30", "user20"); // to change
  };

  render() {
    const {
      classes,
      user: {
        credentials: { username, createdAt, imageUrl, bio, website },
        loading,
        authenticated
      }
    } = this.props;

    const followButton = !authenticated ? (
      <MyButton tip="Follow">
        <Link to="/login">
          <PersonOutlineRoundedIcon color="primary" />
        </Link>
      </MyButton>
    ) : this.followedUser() ? (
      // if already following this user, then undo follow
      <MyButton tip="Unfollow" onClick={this.unfollowUser}>
        <PersonRoundedIcon color="primary" />
      </MyButton>
    ) : (
      //  if haven't followed, then can follow
      <MyButton tip="Follow" onClick={this.followUser}>
        <PersonOutlineRoundedIcon color="primary" />
      </MyButton>
    );

    // if loading, then show paragraph loading...
    // if NOT loading && IS authenticated then show the profile
    // else if NOT loading && is NOT authenticated then show signup/login options
    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt="profile" className="profile-image" />

              {/* change profile image here
                onChange is triggered whenever a file is selected.
                When a user presses a single select button, it will upload to the server.
                There is not a select then upload button.
                The actual ugly input button will be hidden bc I am too lazy to restyle it
                so we will add an MUI button next to it and it will trigger the handleImageChange
                once clicked
              */}
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />

              {/* good ux practice to describe button function */}
              <MyButton
                tip="Edit Profile Picture"
                onClick={this.handleEditPicture}
                btnClassName="button"
              >
                <EditIcon color="primary" />
              </MyButton>
            </div>

            <hr />

            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${username}`}
                color="primary"
                variant="h5"
              >
                @{username}
              </MuiLink>
              {/* <MyButton tip="Follow" onClick={this.handleFollowChange}>
                <PersonOutlineRoundedIcon color="primary" />
              </MyButton> */}
              {followButton}
              <hr />
              {/* if have a bio then show it */}
              {bio && <Typography variant="body2">{bio}</Typography>}
              <hr />
              {/* skipping location */}
              {/* Fragment wraps stuff in 1 element for react */}
              {website && (
                <Fragment>
                  <LinkIcon color="primary" />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {"  "}
                    {website}
                    <hr />
                  </a>
                </Fragment>
              )}
              <CalendarToday color="primary" />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </div>

            <MyButton
              tip="Logout"
              onClick={this.handleLogout}
              btnClassName="button"
            >
              <KeyboardReturn color="primary" />
            </MyButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        // if not authenticated, do this
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No profile found, please login again.
            <div className={classes.buttons}>
              {/* Link to go somewhere in our component */}
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </div>
          </Typography>
        </Paper>
      )
    ) : (
      // <p>Loading...</p>
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

Profile.prototypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  logoutUser,
  uploadImage,
  followUser,
  unfollowUser,
  getUserDataAndFollowing
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
