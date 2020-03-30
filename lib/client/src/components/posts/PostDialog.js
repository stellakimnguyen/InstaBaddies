import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import dayjs from "dayjs";

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
  topoStuff: {
    margin: 10
  },
  postImage: {
    // width: 400
    width: "95%",
    margin: 16
    // marginRight: 0
    // height: 600
    // objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  },
  expandButton: {
    position: "absolute",
    left: "10px" //formally 0%
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  },
  invisibleSeparator: {
    border: "none",
    margin: 4
  },
  visibleSeparator: {
    width: "100%",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    marginBottom: 20
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
      // margin: "50px auto 20px auto",
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

class PostDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: ""
  };

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

    this.setState({ open: true, oldPath, newPath });
    this.props.getPost(this.props.postId);
  };

  handleClose = () => {
    // changes url, so we know where we are by checkin the url in any component
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({ open: false });
    this.props.clearErrors();
  };

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
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={0}>
        <Grid item sm={false} className={classes.topoStuff}>
          {/* </div> */}
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          {/* <span>{commentCount} Comments</span> */}
        </Grid>
        {/* <hr className={classes.visibleSeparator} /> */}
        <Comments comments={comments} />
        <CommentForm postId={postId} />
      </Grid>
    );

    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Comments"
          tipClassName={classes.expandButton}
        >
          {/* <UnfoldMore color="primary" /> */}
          <ChatIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostDialog.propTypes = {
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
)(withStyles(styles)(PostDialog));
