import React, { Component } from "react";

import axios from "axios";
import classnames from "classnames";

import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

export class Stats extends Component {
  state = {
    hasResponse: false,
    token: null,
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    axios
      .post("api/upload", this.state.token, {})
      .then((res) => {
        this.setState({
          hasResponse: true,
        });
      })
      .catch((err) => {
        console.log(err.response.status);
      });

    console.log(this.state.token);
  };

  render() {
    const { hasResponse } = this.state;

    const stats = (
      <div className="text-center mt--100">
        <h5 className="floating">Stats...</h5>
      </div>
    );

    const wait = (
      <div className="text-center mt--100">
        <img
          alt="..."
          className="img-fluid floating"
          src={require("../assets/img/address.png")}
        />
        <h6 className="ml-5 mt-5">Waiting for Token Address...</h6>
      </div>
    );

    return (
      <>
        <section className="section section-lg pt-lg-0 bg-gradient-default">
          <Container>
            <Row></Row>
            <Row className="justify-content-center mt-5">
              <Col lg="8">
                <Form onSubmit={this.onSubmit}>
                  <Card className="bg-gradient-secondary shadow">
                    <CardBody className="p-lg-5">
                      <h4 className="mb-1">Please enter a Token Address</h4>
                      <p className="mt-0 mb-0">
                        Enter your Token Address and click the button below.
                      </p>
                      <FormGroup
                        className={classnames({
                          focused: this.state.boxFocused,
                        })}
                      >
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <FontAwesomeIcon icon={faKey} />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Your Token Address"
                            autoComplete="false"
                            name="token"
                            type="text"
                            onChange={this.onChange}
                            onFocus={(e) => this.setState({ boxFocused: true })}
                            onBlur={(e) => this.setState({ boxFocused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div>
                        <Button
                          block
                          className="btn-round"
                          color="default"
                          size="lg"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
        <section className="section section-lg pt-lg-0t">
          <Container>
            <Row className="justify-content-center mt-5 mb-5">
              <Col lg="8">{hasResponse ? stats : wait}</Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }
}

export default Stats;
