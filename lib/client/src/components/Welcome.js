import React from 'react';
import { Link } from 'react-router-dom';

export default class Welcome extends React.Component {
  render() {
    return (
      <div class="row mt-5">
        <div class="col-md-6 m-auto">
          <div class="card card-body text-center">
            <h1><i class="material-icons fa-4x">
              home
          </i></h1>
            <p>Create an account or login</p>
            <Link to="/signup" class="btn btn-primary btn-block mb-2">
              Signup
            </Link>
            <Link to="/login" class="btn btn-secondary btn-block">Login</Link>
          </div>
        </div>
      </div>
    )
  }
}