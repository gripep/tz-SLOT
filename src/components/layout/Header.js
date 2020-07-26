import React, { Component } from "react";

import Headroom from "headroom.js";

import { Button, NavbarBrand, Navbar, Container } from "reactstrap";

export class Header extends Component {
  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }

  onClick = (e) => {
    window.location.reload(true);
  };

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
              <NavbarBrand className="mr-lg-5">
                <Button color="link" onClick={this.onClick}>
                  <h3 className="text-white">SLOT</h3>
                </Button>
              </NavbarBrand>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

export default Header;
