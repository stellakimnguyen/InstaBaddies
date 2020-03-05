import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

// Components
import Post from "../components/Post";
import Profile from "../components/Profile";
class home extends Component {
  // want to store screams in component state
  // so must initialize as null so we can check in render()
  // whether this state as changed since sending the request
  // the state should change after code in componentDidMount
  state = {
    posts: null
  };

  componentDidMount() {
    axios
      .get("/posts")
      .then(res => {
        console.log(res.data);

        this.setState({
          posts: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    // check if we have posts
    // if not then request has not received response yet
    // post is now in the props of Post
    let recentPostsMarkup = this.state.posts ? (
      this.state.posts.map(post => <Post key={post.postId} post={post} />)
    ) : (
      <p>Loading ...</p>
    );
    return (
      <Grid container spacing={16}>
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

export default home;
