import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

// MUI styles
import withStyles from '@material-ui/core/styles/withStyles';
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
    paddingTop: '56.25%', // 16:9
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Post extends React.Component {
  render() {
    dayjs.extend(relativeTime);
    const { classes, post: { postImage, createdAt, username, userImage, postId, commentCount } } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar variant='circle' src={userImage} className={classes.medium} />
          }
          title={
            <Typography variant='h5' component={Link} to={`/users/${username}`}>{username}</Typography>
          }
          subheader={
            <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
          }
        />
        <CardMedia
          image={postImage}
          title="Post image"
          className={classes.image}
        />

        <CardContent className={classes.content}>
          {/* probably for comment */}
          {/* <Typography variant='h5' component={Link} to={`/users/${username}`}>{username}</Typography> */}
          {/* <Typography variant="body2" color="textSecondary">{createdAt}</Typography> */}
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(Post);