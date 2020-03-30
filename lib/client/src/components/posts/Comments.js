import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import DeleteComment from "./DeleteComment";
import styled from 'styled-components';

import dayjs from "dayjs";
import { Link } from "react-router-dom";
// MUI Stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";
// Redux stuff
import { connect } from "react-redux";
import { getPost, clearErrors } from "../../redux/actions/dataActions";

const styles = {
  commentData: {
    marginLeft: 20
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

class Comments extends Component {
  render() {
    // const { comments, classes } = this.props;
    const {
      classes,
      post: { postId, commentCount, createdAt, postImage, username, userImage },
      comments,
      UI: { loading },
      user: { authenticated }
    } = this.props;
    // todo: check state for who is loggedInAs
    // const deleteButton =
    //   authenticated && username === this.props.user.credentials.username ? (
    //     // need to know which post to delete

    //     <DeleteComment commentId={commentId} />
    //   ) : null;
    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, createdAt, userImage, username, commentId } = comment;
          return (
            <UserComment key={createdAt}>
              <UserProfile
                src={userImage}
                alt="comment"
              />
              <CommentBody className={classes.commentData}>
                <UserTitle
                  component={Link}
                  to={`/users/${this.props.user.credentials.username}/${username}`}
                >
                  {username}
                </UserTitle>
                <Body variant="body1">{body}</Body> 
                <PostDate color="textSecondary">
                  {dayjs(createdAt).format("h:mm a, MMMM DD")}
                </PostDate>
              </CommentBody>
              <DeleteButton>
                {authenticated &&
                username === this.props.user.credentials.username ? ( // deletable comment (is owner)
                  <DeleteComment commentId={commentId} />
                ) : null}
                {authenticated
                  ? console.log(
                      "comment id from comments.js ",
                      commentId
                    )
                  : null}
              </DeleteButton>
              {index !== comments.length - 1 && (
                <hr className={classes.visibleSeparator} />
              )}
            </UserComment>
          );
        })}
      </Grid>
    );
  }
}

const UserComment = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UserProfile = styled.img`
  max-width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  flex: 3;
`

const UserTitle = styled(Typography)`
  font-weight: 600;
  color: black;
`

const CommentBody = styled.div`
  flex: 10;
`

const Body = styled(Typography)`
  font-size: 0.9rem;
  line-height: 1.25;
  margin: 5px 0;
`

const PostDate = styled(Typography)`
  font-size: 0.8rem;
`

const DeleteButton = styled.span`
  flex: 1;
`

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.data.post,
  UI: state.UI,
  user: state.user
});

const mapActionsToProps = {
  getPost,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Comments));
