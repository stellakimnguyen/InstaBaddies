import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

// Components
import Post from "../components/posts/Post";
import Profile from "../components/profile/Profile";
import PostSkeleton from "../util/PostSkeleton";

// Redux stuff
import { connect } from "react-redux";
import { getPosts } from "../redux/actions/dataActions";

class home extends Component {
  // want to store screams in component state
  // so must initialize as null so we can check in render()
  // whether this state as changed since sending the request
  // the state should change after code in componentDidMount
  // state = {
  //   posts: null
  // }; // state is now obtained from props bc redux

  componentDidMount() {
    this.props.getPosts();
    // axios
    //   .get("/posts")
    //   .then(res => {
    //     console.log(res.data);

    //     this.setState({
    //       posts: res.data
    //     });
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }

  render() {
    // check if we have posts
    // if not then request has not received response yet
    // post is now in the props of Post
    const { posts, loading } = this.props.data;
    let recentPostsMarkup = !loading ? (
      posts.map(post => <Post key={post.postId} post={post} />)
    ) : (
      // <p>Loading ...</p>
      <PostSkeleton />
    );
    return (
      <Grid container spacing={15}>
        <Grid item sm={8} xs={12}>
          {recentPostsMarkup}
        </Grid>
        <Grid item sm={3} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getPosts })(home);
