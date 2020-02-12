import React from "react";
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
  render() {
    return (
      <div class="row mt-5">
        <div class="col-md-6 m-auto">
          <div class="card card-body">
            <h1 class="text-center mb-3"><i class="fas fa-sign-in-alt"></i>  Login</h1>

            <form action="/users/login" method="POST">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-control"
                  placeholder="Enter Email"
                />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="form-control"
                  placeholder="Enter Password"
                />
              </div>
              <button type="submit" class="btn btn-primary btn-block">Login</button>
            </form>
            <p class="lead mt-4">
              No Account? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
}