import React from 'react';
import axios from 'axios';

class Post extends React.Component {
  state = {
    // id: null
    post: null
  }
  componentDidMount() {
    console.log(this.props);
    // look for in browser console
    // using the id we grab from the route
    // we can get that photo specific to the id
    let id = this.props.match.params.post_id;

    axios.get('https://jsonplaceholder.typicode.com/photos/' + id)
      .then(res => {
        this.setState({
          post: res.data
        })
        console.log(res)
      })
      .catch(err => {
        console.error(err);
      })

    // this.setState({
    //   id: id
    // });
  }
  render() {

    const post = this.state.post ? (
      <div className="post">
        <h4 className="center">{this.state.post.title}</h4>
        <p><img src={this.state.post.thumbnailUrl} /></p>
      </div>
    ) : (
        <div className="center">Loading post ...</div>
      )

    return (
      <div className="container">
        <h4>{post}</h4>
      </div>
    )
  }
}

export default Post;