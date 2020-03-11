import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
// MUI stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FlareIcon from "@material-ui/icons/Flare";
import ChatIcon from "@material-ui/icons/Chat";
// Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions"; // executed upon expansion of notifications

class Notifications extends Component {
  state = {
    anchorEl: null
  };
  handleOpen = event => {
    this.setState({ anchorEl: event.target }); // event.target is always the icon
  };
  handleClose = () => {
    this.setState({ anchorEl: null }); // to close the menu
  };
  onMenuOpened = () => {
    // to mark notifs as read
    let unreadNotificationsIds = this.props.notifications
      .filter(notif => !notif.read) // array of notifs that are NOT read yet
      .map(notif => notif.notificationId); // returns an array of UNnotif ID's
    this.props.markNotificationsRead(unreadNotificationsIds);
  };
  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    // different notifications if comment vs post
    // if read, color is secondary
    let notificationsIcon;
    // if there exists notifications
    if (notifications && notifications.length > 0) {
      // if there exists a notif that is not read, then display a badge with the # of unread notifications
      notifications.filter(not => not.read === false).length > 0
        ? // for unread notifs
          (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter(not => not.read === false).length // # of unread notifs
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />); // else regular notifs icon
    } else {
      notificationsIcon = <NotificationsIcon />; // when no notifs exist
    }
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(notif => {
          const verb =
            notif.type === "post" ? "has a new post" : "commented on your post";
          const time = dayjs(notif.createdAt).fromNow();
          const iconColor = notif.read ? "primary" : "secondary";
          const path =
            notif.type === "post"
              ? `/users/${notif.sender}/post/${notif.postId}`
              : `/users/${notif.recipient}/post/${notif.postId}`;
          const icon =
            notif.type === "post" ? (
              <FlareIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );
          // after setting all variables, return what you want to
          return (
            <MenuItem key={notif.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="default"
                variant="body1"
                to={path}
              >
                {notif.sender} {verb} {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened} // when notifs are marked as read all at once
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
