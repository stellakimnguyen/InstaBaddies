import React, { Component, Fragment,  } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../util/MyButton";

// MUI stuff
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FolderIcon from "@material-ui/icons/Folder";
import AddIcon from "@material-ui/icons/Add";
import Input from "@material-ui/core/Input";
import { Paper, IconButton } from "@material-ui/core";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

const styles = {
  button: {
    float: "right"
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

class UploadPopUp extends Component {
  // 1. initialize a state
  // by default, dialogue is closed
  state = {
    image: null,
    //url: "",
    open: false,
    caption: ""
  };

//   mapUserDetailsToState = credentials => {
//     this.setState({
//       bio: credentials.bio ? credentials.bio : "",
//       website: credentials.website ? credentials.website : ""
//     });
//   };

  // 3. map user details whenever dialogue is opened
  handleOpen = () => {
    this.setState({
      open: true
    });
    //this.mapUserDetailsToState(this.props.credentials);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  //file upload
  handleFileSelection = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  handleCaptionChange = event => {
    // the target is from whichever Textfield it was in
    // want to set the input value to its corresponding state value
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = () => {
    // const userDetials = {
    //   bio: this.state.bio,
    //   website: this.state.website
    // };
    // this.props.editUserDetails(userDetials);

    // close the dialogue after submission
    this.handleClose();
  };

  // 2. When this component mounts / is rendered
  // we need to get the current details of this user
  // and place in the dialogue so the user can change it
  componentDidMount() {
    // const { credentials } = this.props;
    // this.mapUserDetailsToState(credentials);
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <MyButton
          tip="Create a Post"
          onClick={this.handleOpen}
        //   btnClassName={classes.button}
        >
          <AddIcon color="white" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Post a Picture</DialogTitle>
          <DialogContent>
            {/* Our dialogue MUI handles SUBMIT for us */}
            <Input type="file" onChange={this.handleFileSelection} />
            <TextField
            name="caption"
            type="text"
            label="Caption"
            multiline
            rows="1"
            placeholder="How badd was it?"
            value={this.state.caption}
            onChange={this.handleCaptionChange}
            fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

UploadPopUp.propTypes = {
//   editUserDetails: PropTypes.func.isRequired,
//   classes: PropTypes.object.isRequired
};

// const mapStateToProps = state => ({
//   credentials: state.user.credentials
// });

// export default connect(mapStateToProps, { editUserDetails })(
//   withStyles(styles)(EditDetails)
// );

export default UploadPopUp;
