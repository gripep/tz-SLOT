import React, { Component } from "react";

import { Container, Row, Col } from "reactstrap";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const noToken = (
      <div className="mt-5 mb-9">
        <p>
          <i>No valid Token...</i>
        </p>
      </div>
    );

    const redirect = (
      <Row className="justify-content-center mt-5 mb-9">
        <h1>To compare two tokens, please go through here</h1>
      </Row>
    );

    return (
      <Container fluid>
        <Row className="justify-content-center mt-3">
          <Col className="text-center">
            {this.props.token1 !== null ? (
              <h1>{this.props.token1}</h1>
            ) : (
              noToken
            )}
          </Col>
          <Col className="text-center">
            {this.props.token2 !== null ? (
              <h1>{this.props.token2}</h1>
            ) : (
              noToken
            )}
          </Col>
        </Row>
        {this.props.token1 === null || this.props.token2 === null
          ? redirect
          : ""}
      </Container>
    );
  }
}

export default Dashboard;
