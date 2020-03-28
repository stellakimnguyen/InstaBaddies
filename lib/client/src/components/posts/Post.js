import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import DeletePost from "./DeletePost";
import PostDialog from "./PostDialog";
import styled from 'styled-components';

// MUI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ColorThief from "colorthief";

// Redux stuff
import { connect } from "react-redux";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import noprofileimg from "../../images/no-profile-image.png";

// inject these styles in Post component
// Post receives as classes object
// access each style via classes.styleName
const styles = {
  card: {
    // position: 'relative',
    // display: 'flex',
    maxWidth: 700,
    marginBottom: 20,
    borderRadius: '12px',
    position: 'relative',
  },
  image: {
    minWidth: 200,
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  content: {
    margin: 20,
    padding: 25,
    objectFit: "cover"
  },
  postDialog: {
    left: "0%",
    position: "relative"
  }
};

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      testColor: '',
    }

    this.imgRef = React.createRef();
  }

  // componentWillMount() {
  //   const colorThief = new ColorThief();
  //   const img = <img src={postImage}/>;
  //   const result = colorThief.getColor(img, 25);
  // }

  // getColorFromImage(pathToImg) {
  //   console.log(pathToImg);
  //   let v = new Vibrant(pathToImg);
  //   let test = v.getPalette((err, palette) => this.helloPalette(palette.Vibrant.getHex()));
  //   console.log(test);
  //   // v.getPalette((err, palette) => console.log(palette));
  //   // Promise
  //   //v.getPalette().then((palette) => console.log(palette));
  // }

  getColorFromImage(picture) {
    const colorThief = new ColorThief();
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = "https://d36tnp772eyphs.cloudfront.net/blogs/1/2018/08/Kauai-lead.jpg";
    
    if (img.complete) {
      console.log('image has loaded');
      const result = colorThief.getColor(img, 25);
    } 
    // else {
    //   console.log('image has not loaded?');
    //   colorThief.getColor(img);
    // }

    // console.log(`rgb(${result[0]},${result[1]},${result[2]})`);
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
      <Card className={classes.card}>
        {/* POST HEADER */}

        <FloatUser onClick={() => this.getColorFromImage(postImage)}>
          <UserImage
            src={userImage}
            onError={(e) => {
              e.target.onerror = null 
              e.target.src = noprofileimg}
            } />
          <UserTitle>@{username}</UserTitle>
        </FloatUser>

        <DeleteBtn>{deleteButton}</DeleteBtn>

        {/* <CardHeader
          avatar={
            //User Image
            <Avatar
              variant="circle"
              src={userImage}
              className={classes.medium}
            />
          }
          title={
            // Username
            <Typography
              variant="h5"
              component={Link}
              to={`/users/${loggedInAs}/${username}`}
            >
              {username}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).fromNow()}
              <span>{deleteButton}</span>
            </Typography>
          }
        /> */}

        {/* PICTURE */}
        <CardMedia
          title="Post image"
          className={classes.image}
          ref={this.imgRef}
          image={postImage}
          // onLoad={() => {
          //   const colorThief = new ColorThief();
          //   const img = this.imgRef.current;
          //   const result = colorThief.getColor(img, 25);
          //   console.log(result);
          // }}
        />

        {/* LIKE BUTTON */}
        {/* <MyButton tip="Like">
          <FavoriteIcon color="primary" />
        </MyButton> */}

        {/* POST FOOTER */}
        <PostFooter className={classes.content}>
          {/* <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span> */}
          {/* <span>{deleteButton}</span> */}
          
          <PostDialog // each post has a pop up box that will open if openDialog is true
            postId={postId}
            username={username}
            openDialog={this.props.openDialog} // will be undefined if no props.openDialog from parent
            className={classes.postDialog}
          />
        </PostFooter>
      </Card>
    );
  }
}

const PostFooter = styled(CardContent)`
  margin: 20,
  padding: 25,
  object-fit: cover,
`

const PostPicture = styled(CardMedia)`
  minWidth: 200,
  height: 0,
  paddingTop: "56.25%", // 16:9
  borderRadius: '15px 15px 0 0',
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

const UserTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  display: inline;
  padding-left: 5px;
`

const DeleteBtn = styled.div`
  position: absolute;
  right: 0px;
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
