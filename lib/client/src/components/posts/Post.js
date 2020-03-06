import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import DeletePost from "./DeletePost";
import PostDialog from "./PostDialog";
// MUI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import FavoriteIcon from "@material-ui/icons/Favorite";

// Redux stuff
import { connect } from "react-redux";

// Icons
import ChatIcon from "@material-ui/icons/Chat";

// inject these styles in Post component
// Post receives as classes object
// access each style via classes.styleName
const styles = {
  card: {
    // position: 'relative',
    // display: 'flex',
    maxWidth: 700,
    marginBottom: 20
  },
  image: {
    minWidth: 200,
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
};

class Post extends React.Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      post: { postImage, createdAt, username, userImage, postId, commentCount },
      user: { authenticated }
    } = this.props;
    const loggedInAs = this.props.user.credentials.username;

    const deleteButton =
      authenticated && username === loggedInAs ? (
        // need to know which post to delete
        <DeletePost postId={postId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              variant="circle"
              src={userImage}
              className={classes.medium}
            />
          }
          title={
            <Typography variant="h5" component={Link} to={`/users/${username}`}>
              {username}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).fromNow()}
            </Typography>
          }
        />
        <CardMedia
          image={postImage}
          title="Post image"
          className={classes.image}
        />

        <MyButton tip="Like">
          <FavoriteIcon color="primary"/>
        </MyButton>

        <CardContent className={classes.content}>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span>
          <span>{deleteButton}</span>
          <PostDialog
            postId={postId}
            username={username}
            // openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Post.propTypes = {
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
