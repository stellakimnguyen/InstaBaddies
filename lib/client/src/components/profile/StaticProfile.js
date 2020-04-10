import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";
import { ProfileContainer, SquareCrop, ProfileImage, UserDetails,
    ProfileUsername, JoinedDate, WebsiteChip } from "./styledprofile";

// MUI
import Typography from "@material-ui/core/Typography";

// Icons
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LanguageIcon from '@material-ui/icons/Language';

import { followUser, unfollowUser } from "../../redux/actions/userActions";

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
      <ProfileContainer>
        <SquareCrop>
          <ProfileImage src={imageUrl} alt="profile" className="profile-image" />
        </SquareCrop>

        <UserDetails className="profile-details">
          <div>
            <ProfileUsername
              component={Link}
              to={`/users/${this.props.user.credentials.username}/${username}`}
              color="primary" >
              @{username}
            </ProfileUsername>
            <JoinedDate>Joined {dayjs(createdAt).format("MMM YYYY")}</JoinedDate>
          </div>

          {followButton}
          
          {bio && <Typography variant="body2">{bio}</Typography>}
          
          {website && (
            <WebsiteChip
              avatar={<LanguageIcon />}
              label="website"
              onClick={() => window.open(website, '_blank')} />
          )}
        </UserDetails>
      </ProfileContainer>
    ) : (
      <ProfileSkeleton />
    );

    return staticProfileMarkup;
  }
}

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
export default connect(mapStateToProps, { followUser, unfollowUser })
  (StaticProfile);
