import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import dayjs from "dayjs";
import styled from 'styled-components';

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
  expandButton: {
    position: "absolute",
    left: "10px" //formally 0%
  },
};

class PostComments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      oldPath: "",
      newPath: "",
      commentsList: [],
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    // upon opening a post pop up box, we want to change the url to that of the associated user's profile with that post popped up
    let oldPath = window.location.pathname;

    const { username, postId } = this.props;

    // path to the post we have just opened
    const newPath = `/users/${username}/post/${postId}`;

    // handles edge case where we go to same path, still want to change back to user
    if (oldPath === newPath) oldPath = `/users/${username}`;

    window.history.pushState(null, null, newPath);
    // but when we exit the dialog and are on the user's page, then don't want that post id in url anymore

    this.setState({ oldPath, newPath });
    this.props.getPost(this.props.postId);

    this.props.triggerComments();
  };

  handleClose = () => {
    // changes url, so we know where we are by checkin the url in any component
    window.history.pushState(null, null, this.state.oldPath);
    this.props.clearErrors();

    this.props.triggerComments();
  };

  handleButtonClick() {
    if (this.props.isExpanded) {
      this.handleClose();
    } else {
      this.handleOpen();
    }
  }

  render() {
    const {
      classes,
      post: {
        postId,
        commentCount,
        createdAt,
        postImage,
        username,
        userImage,
        comments
      },
      UI: { loading }
    } = this.props;

    const dialogMarkup = loading ? (
      <Spinner>
        <CircularProgress size={100} thickness={5} />
      </Spinner>
    ) : (
      <div>
        <AllComments>
          <Comments comments={comments} />
        </AllComments>
        <Typography variant="body2" color="textSecondary">
          {dayjs(this.props.post.createdAt).format("h:mm a, MMMM DD YYYY")}
        </Typography>
        <CommentForm postId={this.props.post.postId} />
      </div>
    );

    return (
      <Fragment>
        <MyButton
          onClick={this.handleButtonClick} // formally this.handleOpen
          tip="Comments"
          tipClassName={classes.expandButton}
        >
          <ChatIcon color="primary" />
        </MyButton>
        <Arrow onClick={this.handleButtonClick} isExpanded={this.props.isExpanded}>
          <span /> 
          <span />
        </Arrow>

        {this.props.isExpanded ? // statement needed as redux props not loaded if state.open == false
        <CommentSection>
          {dialogMarkup}
        </CommentSection>
        : null // do nothing
        }
      </Fragment>
    );
  }
}

const Spinner = styled.div`
  text-align: center;
  margin-top: 55px;
`

const Arrow = styled.div`
  width: 19px;
  height: 30px;
  position: absolute;
  cursor: pointer;
  right: 20px;

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 12px;
    background: #8cab9e;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    top: 18px;

    &:nth-child(1) {
      transform: ${props => props.isExpanded ? 'rotate(-45deg)' : 'rotate(45deg)'};
    }

    &:nth-child(2) {
      transform: ${props => props.isExpanded ? 'rotate(45deg)' : 'rotate(-45deg)'};
      left: 7.5px;
    }
  }
`

const CommentSection = styled.div`
  margin-top: 50px;
`

const AllComments = styled.div`
  overflow-y: auto;
  height: 132px;
  margin-bottom: 10px;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-track {
    background: #e8e8e8;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    border-radius: 7px;

    :hover {
      background: #a8a8a8;
    }
  }
`

PostComments.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getPost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.data.post,
  UI: state.UI
});

const mapActionsToProps = {
  getPost,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(PostComments));
