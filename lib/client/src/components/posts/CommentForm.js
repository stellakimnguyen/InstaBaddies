import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import styled from 'styled-components';
import MyButton from "../../util/MyButton";

// MUI Stuff
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";

// Redux stuff
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = {
  visibleSeparator: {
    width: "100%",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    marginBottom: 20
  },
  mybutton: {
    marginTop: 20,
    marginBottom: 20
  },
  postImage: {
    width: 400
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
    left: "50%"
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
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
    mybutton: {
      // paddingTop: 50,
      marginTop: 30,
      position: "relative",
      color: "blue"
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

class CommentForm extends Component {
  state = {
    body: "",
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      // after submission and no errors, clear body
      this.setState({ body: "" });
    }
  }

  handleChange = event => {
    this.setState({ body: event.target.value });
  };

  handleSubmit = event => {
    // event.preventDefault();
    this.props.submitComment(this.props.postId, { body: this.state.body });
    document.getElementById("commentInput").value = '';
  };

  handleEnter = (event) => {
    if(event.key === 'Enter'){
      this.handleSubmit();
    }
  }

  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;

    const commentFormMarkup = (
      <InputComponent>
        <CommentInput
          id="commentInput"
          onChange={this.handleChange}
          autoComplete="off"
          placeholder={authenticated ? 'What about it?' : 'Not signed in'}
          onKeyPress={this.handleEnter}
          disabled={!authenticated} />

        <SendComment
          tip="Comment"
          onClick={this.handleSubmit}
          isAuthenticated={authenticated} >
          <SendIcon />
        </SendComment>
      </InputComponent>
    ); // don't want to see anything if not authenticated

    return commentFormMarkup;
  }
}

const InputComponent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
`

const CommentInput = styled.input`
  background: #e6e6e6;
  height: auto;
  width: calc(100% - 20px);
  padding: 12px;
  border: 0px;
  border-radius: 8px;

  :focus {
    outline-width: 0;
  }
`

const SendComment = styled(MyButton)`
  position: absolute !important;
  right: 20px;
`

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);
