import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";
import styled from "styled-components";

// MUI
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// Icons
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import PersonOutlineRoundedIcon from "@material-ui/icons/PersonOutlineRounded";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { followUser, unfollowUser } from "../../redux/actions/userActions";

const styles = {
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative"
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
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    }
  },
  palette: {
    primary: {
      light: "#aed1c2",
      main: "#8cab9e",
      dark: "#7d968b",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    },
    typography: {
      useNextVariants: true
    },
    form: {
      textAlign: "center"
    },
    image: {
      margin: "50px auto 20px auto",
      width: "100px"
    },
    pageTitle: {
      margin: "10px auto 10px auto"
    },
    textField: {
      margin: "10px auto 10px auto"
    },
    button: {
      marginTop: 30,
      position: "relatve"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 15
    },
    progress: {
      position: "absolute"
    }
  }
};

class StaticProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  followedUser = () => {
    console.log(
      "user credentials of logged in user :: ",
      this.props.user,
      "\n",
      this.props.user.credentials.username
    );
    const {
      classes,
      profile: { username, createdAt, imageUrl, bio, website }
    } = this.props;
    console.log("am i following this person ? :: ", this.props.user.following);
    if (this.props.user.following && this.props.user.following[`${username}`]) {
      console.log("following this person : ", username);
      return true;
    } else {
      console.log("not following this person : ", username);
      return false;
    }
  };

  handleUnfollow = () => {
    this.props.unfollowUser(
      this.props.user.credentials.username,
      this.props.profile.username
    );
  };

  handleFollow = () => {
    this.props.followUser(
      this.props.user.credentials.username,
      this.props.profile.username
    );
  };

  render() {
    console.log("my propss from static profile :: ", this.props);
    const {
      classes,
      profile: { username, createdAt, imageUrl, bio, website },
      authenticated,
      loading
    } = this.props;

    const followButton = !authenticated ? (
      console.log("apparently i am not authenticated  :", authenticated)
    ) : this.followedUser() ? (
      // if already following this user, then undo follow
      <MyButton tip="Unfollow" onClick={this.handleUnfollow}>
        <CheckCircleIcon color="primary" />
      </MyButton>
    ) : (
      //  if haven't followed, then can follow
      <MyButton tip="Follow" onClick={this.handleFollow}>
        <AddCircleIcon color="disabled" />
      </MyButton>
    );

    let staticProfileMarkup = !loading ? (
      <ProfileContainer className={classes.paper}>
        <div>
          <SquareCrop>
            <ProfileImage src={imageUrl} alt="profile" className="profile-image" />
          </SquareCrop>

          <UserDetails className="profile-details">
            <div />
            <ProfileUsername
              component={Link}
              to={`/users/${this.props.user.credentials.username}/${username}`}
              color="primary" >
              @{username}
            </ProfileUsername>
            <JoinedDate>Joined {dayjs(createdAt).format("MMM YYYY")}</JoinedDate>

            {followButton}
            
            {bio && <Typography variant="body2">{bio}</Typography>}
            
            {website && (
              <Website>
                <ProfileLink href={website} target="_blank" rel="noopener noreferrer">
                  instagram
                </ProfileLink>
              </Website>
            )}
          </UserDetails>
        </div>
      </ProfileContainer>
    ) : (
      // <p>Loading...</p>
      <ProfileSkeleton />
    );

    return staticProfileMarkup;
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

const ProfileLink = styled.a`
  font-weight: 600;
  letter-spacing: 0.1em;
  font-size: 13px;
  color: white !important;
`

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  user: state.user
});
export default connect(mapStateToProps, { followUser, unfollowUser })(
  withStyles(styles)(StaticProfile)
);
