import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
import MyButton from "../../util/MyButton";
import axios from "axios";
import ProfileSkeleton from "../../util/ProfileSkeleton";
import styled from 'styled-components';

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
import MuiLink from "@material-ui/core/link";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

// Icons
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import PersonOutlineRoundedIcon from "@material-ui/icons/PersonOutlineRounded";

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
    if (
      this.state.user.following &&
      this.state.user.following[`${this.state.user.credentials.username}`]
    )
      return true;
    else return false;
  };

  // TODO
  followUser = () => {
    // this.props.followUser(this.state.user.credentials.username, "user10");

    axios
      .post(
        `/user/${this.state.user.credentials.username}/following/${this.state.user.credentials.username}`
      )
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
      .post(
        `/user/${this.state.user.credentials.username}/unfollowing/${this.state.user.credentials.username}`
      )
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

  render() {
    // data of the other user profile you are visiting
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
        <ProfileContainer>
          <div>
            <SquareCrop>
              <ProfileImage src={imageUrl} alt={`${username}'s picture`} />
              <ChangeImage>
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
                <Tooltip title="Update Picture">
                  <EditIcon
                    onClick={this.handleEditPicture}
                    fontSize="large" />
                </Tooltip>
              </ChangeImage>
            </SquareCrop>

            <UserDetails>
              <div />
              <ProfileUsername
                component={Link}
                to={`/users/${this.props.user.credentials.username}/${username}`}
                color="primary" >
                @{username}
              </ProfileUsername>
              <JoinedDate>Joined {dayjs(createdAt).format("MMM YYYY")}</JoinedDate>

              <EditDetails />

              {/* if have a bio then show it */}
              {bio && <Typography variant="body2">{bio}</Typography>}
              
              {/* skipping location */}
              {/* Fragment wraps stuff in 1 element for react */}
              {website && (
                <Fragment>
                  <Website>
                    <Instagram href={website} target="_blank" rel="noopener noreferrer" >instagram</Instagram>
                  </Website>
                </Fragment>
              )}
            </UserDetails>

            <MyButton
              tip="Logout"
              onClick={this.handleLogout}
              btnClassName="button"
            >
              <KeyboardReturn color="primary" />
            </MyButton>
          </div>
        </ProfileContainer>
      ) : (
        // NOT AUTHENTICATED
        <ProfileContainer>
          <Typography variant="body2" align="center">
            No profile found, please login again.
            <div>
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
        </ProfileContainer>
      )
    ) : (
      // <p>Loading...</p>
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

const ProfileContainer = styled.div`
  border-radius: 12px;
  padding: 20px;
  background: white;
  box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.1);
  position: sticky;
  top: 80px;
`

const SquareCrop = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  padding-bottom: 100%;
  border-radius: 50%;
  overflow: hidden;
`

const ProfileImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
`

const ChangeImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #F5D961;
  margin: 0;
  padding: 0;
  font-size: 1.5vw;
  background: rgba(254, 156, 136, 0);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 250ms;

  :hover {
    background: rgba(254, 156, 136, 0.5);
    backdrop-filter: blur(2px);
    opacity: 1;
  }
`

const UserDetails = styled.div`
  text-align: center;

  & > * {
    margin-top: 15px;
  }
`

const ProfileUsername = styled(MuiLink)`
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 20px;
  margin-top: 10px;
`

const JoinedDate = styled.span`
  color: #bbb;
  font-size: 12px;
  text-transform: lowercase;
  display: block;
`

const Website = styled.div`
  background: linear-gradient(to right, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
  width: calc(100% - 12px);
  border-radius: 100px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Instagram = styled.a`
  font-weight: 600;
  letter-spacing: 0.1em;
  font-size: 13px;
  color: white !important;
`

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
)(Profile);
