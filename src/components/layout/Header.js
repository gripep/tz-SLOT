import React, { Component } from "react";
// import { Link } from "react-router-dom";

import Headroom from "headroom.js";

import { NavbarBrand, Navbar, Container } from "reactstrap";

export class Header extends Component {
  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }

  render() {
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-dark bg-gradient-primary headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              {/* <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                <h3 className="text-white">TZ Explorer</h3>
              </NavbarBrand> */}
              <NavbarBrand className="mr-lg-5">
                <h3 className="text-white">TZ Explorer</h3>
              </NavbarBrand>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

export default Header;
