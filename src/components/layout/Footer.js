import React, { Component } from "react";

import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export class Footer extends Component {
  render() {
    return (
      <>
        <footer className="footer bg-light">
          <Container>
            <Row className="row-grid align-items-center mb-1">
              <Col lg="6">
                <h4 className="mb-0 font-weight-light">
                  Find out more on Github!
                </h4>
              </Col>
              <Col className="text-lg-center btn-wrapper" lg="6">
                <Button
                  className="btn-icon-only rounded-circle ml-1"
                  color="github"
                  href="https://github.com/gripep/tzstats"
                  id="tooltip495507257"
                  target="_blank"
                >
                  <span className="btn-inner">
                    <FontAwesomeIcon icon={faGithub} />
                  </span>
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip495507257">
                  Check it out!
                </UncontrolledTooltip>
              </Col>
            </Row>
            <hr />
            <Row className=" align-items-center justify-content-md-between">
              <Col md="6">
                <div className=" copyright">
                  © {new Date().getFullYear()} gripep.
                </div>
              </Col>
              <Col md="6">
                <Nav className=" nav-footer justify-content-end">
                  <NavItem>
                    <NavLink
                      href="https://tzstats.com/docs/api/index.html"
                      target="_blank"
                    >
                      Tezos API
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="https://github.com/gripep/tzstats/blob/master/LICENSE.md"
                      target="_blank"
                    >
                      MIT License
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Footer;
