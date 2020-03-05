import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";

// MUI stuff
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import MuiLink from "@material-ui/core/link";
import Typography from "@material-ui/core/Typography";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

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
  render() {
    const {
      classes,
      user: {
        credentials: { username, createdAt, imageUrl, bio, website },
        loading,
        authenticated
      }
    } = this.props;

    // if loading, then show paragraph loading...
    // if NOT loading && IS authenticated then show the profile
    // else if NOT loading && is NOT authenticated then show signup/login options
    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt="profile" className="profile-image" />
            </div>

            <hr />

            <div className="profile-details">
              {/* </div> */}
              <MuiLink
                component={Link}
                to={`/users/${username}`}
                color="primary"
                variant="h5"
              >
                @{username}
              </MuiLink>
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
      <p>Loading...</p>
    );

    return profileMarkup;
  }
}

Profile.prototypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Profile));
