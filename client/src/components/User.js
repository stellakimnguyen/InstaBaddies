import React from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class User extends React.Component {
    // initial state, posts empty
    state = {
        posts: []
    }
    componentDidMount() {
        axios.get('https://jsonplaceholder.typicode.com/photos')
            .then(res => {
                // response contains data from that endpoint
                console.log(res);
                // get first 10 posts
                this.setState({
                    posts: res.data.slice(0, 10)
                });
            });
    }

    fileSelectedHandler = event => {
        console.log(event)
    }

    test() {
        console.log("Hello");
    }

    render() {
        const { posts } = this.state;
        // check if posts have any data in them then cycle thru them
        const postList = posts.length ? (
            posts.map(post => {
                return (
                    <div className="post card" key={post.id}>
                        <div className="card-content">
                            <span className="card-title">{post.title}</span>
                            <p>{post.thumbnailUrl}</p>
                            <Link to={'/user/' + post.id}>
                                <img src={post.thumbnailUrl} />
                            </Link>

                        </div>
                    </div>
                )
            })
        ) : (
                <div className="center">No posts yet</div>
            )



        return (

            <div className='p-5'>
                <h3>The User Page</h3>
                <p>User info: </p>
                <button onClick={this.test}>Follow</button>
                <input type='file' onChange={this.fileSelectedHandler} />
                {postList}
            </div>
        )
    }
}