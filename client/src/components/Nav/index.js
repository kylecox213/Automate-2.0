import React from "react";
import API from "../../utils/API";
import "./style.css";

class Nav extends React.Component {

  logout = () => {
    API.userLogout()
      .then(response => {
        console.log("Response from logout function:")
        console.log(response);
        API.userLoginCheck()
          .then(resp => {
            console.log("Response from post-logout check user function:")
            console.log(resp.data);
          })
      })
  }

  render() {
    return (
      <nav className="navbar">
        <a className="app-name" href="/">
          AutoMate
        </a>
        <a className="navbar-brand" href="/">
          Home
      </a>
        <a className="navbar-brand" href="/app/search">
          Search
      </a>
        <a className="navbar-brand" href="/" onClick={this.logout}>
          Logout
      </a>
      </nav>
    );
  }
}

export default Nav;
