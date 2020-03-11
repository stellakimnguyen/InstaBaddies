import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";
// MUI
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
// Icons
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import PersonOutlineRoundedIcon from "@material-ui/icons/PersonOutlineRounded";

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
  componentDidMount() {
    console.log("my state in static profile :: ", this.state);
    console.log("my props in static profile :: ", this.props);
    axios
      .get("/user")
      .then(res => {
        console.log(res.data);

        this.setState({
          user: res.data
        });
        console.log("i have just mounted and this is my state : ", this.state);
        window.location.reload(false);
      })
      .catch(err => {
        console.error(err); //
      });
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

  // TODO
  followUser = () => {
    // this.props.followUser(this.state.user.credentials.username, "user10");
    const {
      classes,
      profile: { username, createdAt, imageUrl, bio, website }
    } = this.props;
    axios
      .post(
        `/user/${this.props.user.credentials.username}/following/${username}`
      )
      .then(res => {
        // dispatch(getUserData());
        console.log("response after followinggggggggggg ::: ", res.data);
        return axios.get(`/user`);
      })
      .then(res => {
        console.log("data after followingggg !!! ::: ", res.data);
        console.log("data BEFORE setting stattteeee ", this.state);

        // this.setState((prevState, props) => ({
        //   datasetForStorage: [...prevState.datasetForStorage,toAdd]
        // }))

        this.setState(() => ({
          user: res.data
        }));
        console.log("data after setting stattteeee ", this.state);
        window.location.reload(false);
      })
      .catch(err => console.log(err));
  };

  unfollowUser = () => {
    // this.props.unfollowUser(this.state.user.credentials.username, "user10");
    const {
      classes,
      profile: { username, createdAt, imageUrl, bio, website }
    } = this.props;
    console.log("going to unfollow : ", username);
    axios
      .post(
        `/user/${this.props.user.credentials.username}/unfollowing/${username}`
      )
      .then(res => {
        // dispatch(getUserData());
        console.log(res);
        return axios.get(`/user`);
      })
      .then(res => {
        console.log("setting the state my babyyyyyyy");
        this.setState(() => ({
          user: res.data
        }));
        window.location.reload(false);
      })
      .catch(err => console.log(err));
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
      // <MyButton tip="Follow">
      //   <Link to="/login">
      //     <PersonOutlineRoundedIcon color="primary" />
      //   </Link>
      // </MyButton>
      console.log("apparently i am not authenticated  :", authenticated)
    ) : this.followedUser() ? (
      // if already following this user, then undo follow
      <MyButton tip="Unfollow" onClick={this.unfollowUser.bind(this)}>
        <PersonRoundedIcon color="primary" />
      </MyButton>
    ) : (
      // console.log(
      //   "hiiiiiiiiiiii authentiated in static profile and following? ",
      //   authenticated
      // )
      //  if haven't followed, then can follow
      <MyButton tip="Follow" onClick={this.followUser.bind(this)}>
        <PersonOutlineRoundedIcon color="primary" />
      </MyButton>
    );
    // console.log(
    //   "authenticated an following authentiated in static profile and NOT following ? ",
    //   authenticated
    // );

    let staticProfileMarkup = !loading ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image" />
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
            {followButton}
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {website && (
              <Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {" "}
                  {website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />{" "}
            <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
        </div>
      </Paper>
    ) : (
      // <p>Loading...</p>
      <ProfileSkeleton />
    );

    return staticProfileMarkup;
    // return (
    // <Paper className={classes.paper}>
    //   <div className={classes.profile}>
    //     <div className="image-wrapper">
    //       <img src={imageUrl} alt="profile" className="profile-image" />
    //     </div>
    //     <hr />
    //     <div className="profile-details">
    //       <MuiLink
    //         component={Link}
    //         to={`/users/${username}`}
    //         color="primary"
    //         variant="h5"
    //       >
    //         @{username}
    //       </MuiLink>
    //       {followButton}
    //       <hr />
    //       {bio && <Typography variant="body2">{bio}</Typography>}
    //       <hr />
    //       {website && (
    //         <Fragment>
    //           <LinkIcon color="primary" />
    //           <a href={website} target="_blank" rel="noopener noreferrer">
    //             {" "}
    //             {website}
    //           </a>
    //           <hr />
    //         </Fragment>
    //       )}
    //       <CalendarToday color="primary" />{" "}
    //       <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
    //     </div>
    //   </div>
    // </Paper>
    // );
  }
}

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  user: state.user
});
export default connect(mapStateToProps)(withStyles(styles)(StaticProfile));
