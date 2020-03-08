import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Post from "../components/posts/Post";
import StaticProfile from "../components/profile/StaticProfile";
import Grid from "@material-ui/core/Grid";

// import ScreamSkeleton from '../util/ScreamSkeleton';
// import ProfileSkeleton from '../util/ProfileSkeleton';

import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
    postIdParam: null // !postIdParam === null
  };
  componentDidMount() {
    // when component did mount, we want to fetch the user's details
    // get username from the url (that's how route was set up)
    const username = this.props.match.params.username; // <Route exact path="/users/:username" component={user} />

    // path="/users/:username/post/:postId"
    const postId = this.props.match.params.postId;

    if (postId) this.setState({ postIdParam: postId });

    // get the user's posts
    this.props.getUserData(username);

    // get any user's details, is a public route
    axios
      .get(`/user/${username}`)
      .then(res => {
        this.setState({
          // set the user profile of user we want to checkout
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { posts, loading } = this.props.data;
    const { postIdParam } = this.state;

    const postsMarkup = loading ? (
      <p>Loading data...</p>
    ) : posts === null ? (
      <p>No posts from this user</p>
    ) : !postIdParam ? (
      // if no specific post ID provided in paramater then show ALL user's posts, if they have them
      posts.map(post => <Post key={post.postId} post={post} />)
    ) : (
      // if do have specific post ID, then open that post when on user's profile page
      posts.map(post => {
        if (post.postId !== postIdParam) {
          return <Post key={post.postId} post={post} />;
        } else return <Post key={post.postId} post={post} openDialog />; // passes openDialog with property true
      })
    );

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading profile...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}
user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getUserData })(user);