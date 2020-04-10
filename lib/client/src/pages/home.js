import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import styled from 'styled-components';

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
    console.log(this.props);
    const { posts, loading } = this.props.data;

    let recentPostsMarkup = !loading ? (
      posts.map(post => <Post key={post.postId} post={post} />)
    ) : (
      // <p>Loading ...</p>
      <PostSkeleton />
    );
    return (
      <Content container spacing={10}>
        <Posts>
          {recentPostsMarkup}
        </Posts>
        <Spacing />
        <ProfileSidebar>
          <Profile />
        </ProfileSidebar>
      </Content>
    );
  }
}

const Content = styled(Grid)`
  margin: 0 0 0 8px;
  width: 100%;
  transform: translate(0, 0);
`

const Posts = styled.div`
  flex: 3.5;
`

const Spacing = styled.div`
  flex: 0.08;
`

const ProfileSidebar = styled.div`
  flex: 1;
  margin-right: 15px;
`

home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getPosts })(home);
