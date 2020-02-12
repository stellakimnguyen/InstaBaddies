// src/components/instabaddiesHeader.js
/* <div>
<center><h1>ICU</h1></center>
</div> */
/* <span class="navbar-brand mb-0 h1">ICU</span> */

import React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">

        <Link to="/">ICU</Link>
        <Link to="/user">My Profile</Link>
      </nav>
    )
  }
};