import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import DeletePost from "./DeletePost";
import PostComments from "./PostComments";
import styled, { keyframes } from 'styled-components';

// MUI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import FavoriteIcon from "@material-ui/icons/Favorite";

import Grid from "@material-ui/core/Grid";

// Redux stuff
import { connect } from "react-redux";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import noprofileimg from "../../images/no-profile-image.png";

// inject these styles in Post component
// Post receives as classes object
// access each style via classes.styleName
const styles = {
  image: {
    minWidth: 200,
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
};

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      testColor: '',
      isExpanded: '',
    }

    this.imgRef = React.createRef();
    this.triggerCommentSection = this.triggerCommentSection.bind(this);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }
  
  componentWillUnmount() {    
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  //Dropdown Functions
  handleClick = (e) => {
    if(this.node.contains(e.target)) {
      //click is on search component, continue
      return;
    }

    this.setState({ isExpanded: false });
  }

  triggerCommentSection(e) {
    //e.stopPropagation();
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  }
  
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
      <FullPost ref={node => this.node = node} elevation={0}>
        {/* POST HEADER */}
        <FloatUser>
          <UserImage
            src={userImage}
            onError={(e) => {
              e.target.onerror = null 
              e.target.src = noprofileimg}
            } />
          <UserTitle
            component={Link}
            to={`/users/${loggedInAs}/${username}`}
          >
            @{username}
          </UserTitle>
        </FloatUser>
        <DeleteBtn>{deleteButton}</DeleteBtn>

        {/* PICTURE */}
        <CardMedia
          title="Post image"
          className={classes.image}
          ref={this.imgRef}
          image={postImage}
        />

        {/* LIKE BUTTON */}
        {/* <MyButton tip="Like">
          <FavoriteIcon color="primary" />
        </MyButton> */}

        {/* POST FOOTER */}
        <PostFooter expanded={this.state.isExpanded}>
          <PostComments // each post has a pop up box that will open if openDialog is true
            postId={postId}
            username={username}
            openDialog={this.props.openDialog} //open dialog is a boolean
            comments={this.props.comments} // will be undefined if no props.openDialog from parent
            triggerComments={this.triggerCommentSection}
            isExpanded={this.state.isExpanded}
          />
        </PostFooter>
      </FullPost>
    );
  }
}

const FullPost = styled(Card)`
  max-width: 1200px;
  margin-bottom: 20px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.1);
`

const FloatUser = styled.div`
  position: absolute;
  background: white;
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin: 12px;
  padding: 5px 7px 5px 5px;
`

const UserImage = styled.img`
  border-radius: 50%;
  height: 25px;
  width: 25px;
  object-fit: cover;
`

const UserTitle = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  display: inline;
  padding-left: 5px;
  color: black;
`

const DeleteBtn = styled.div`
  position: absolute;
  right: 0px;
`

const expand = keyframes`
  from {
    height: 36px;
  }

  to {
    height: 250px;
  }
`

const collapse = keyframes`
  from {
    height: 250px;
  }

  to {
    height: 36px;
  }
`

const PostFooter = styled(CardContent)`
  height: ${props => props.expanded ? '250px' : '36px'};
  object-fit: cover;
  animation: ${props => props.expanded ? expand : collapse} 250ms linear;
  padding: 20px;
`

const Hide = styled.div`
  visibility: ${props => props.isExpanded ? 'visible' : 'hidden'};
`

Post.propTypes = {
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool // not required bc most posts don't need to open
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
