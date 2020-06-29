import React, { Component } from "react";

import { Button, Container, Row, Col } from "reactstrap";

export class Landing extends Component {
  render() {
    return (
      <>
        <Container fluid className="bg-gradient-default">
          <Row className="justify-content-center">
            <Col className="text-center mt-6" lg="6">
              <h1 className="display-3 text-white">
                <img alt="" src={require("../assets/img/spinning_coin.gif")} />{" "}
                TZ Explorer{" "}
                <img alt="" src={require("../assets/img/spinning_coin.gif")} />
              </h1>
              <p className="lead text-white mb-5">
                <small>
                  TZ Explorer shows you your Tezos tokens stats and KPIs such as
                  total balance, rewards and other lifetime &amp; up to date
                  figures. Check out our graphs to see lifetime bonds and
                  rewards comperaed to thier average returns.
                </small>
              </p>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row className="justify-content-center mt-5">
            <h2>Check out your token stats or compare two tokens!</h2>
          </Row>
          <Row className="justify-content-center mt-5 mb-6">
            <div className="btn-wrapper">
              <Button
                className="mb-3 mb-sm-0 mr-5"
                color="primary"
                href="/single"
                size="lg"
                type="button"
              >
                <span className="btn-inner--text">Single Token</span>
              </Button>
              <Button
                className="mb-3 mb-sm-0 ml-5"
                color="primary"
                href="/double"
                size="lg"
                type="button"
                disabled
              >
                <span className="btn-inner--text">Two Tokens</span>
              </Button>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Landing;
