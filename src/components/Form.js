import React, { Component } from "react";
import classnames from "classnames";

import {
  Button,
  Card,
  CardBody,
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

export class Form extends Component {
  state = {};

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  render() {
    return (
      <>
        <main ref="main">
          <section className="section section-lg pt-lg-0 bg-gradient-default">
            <Container>
              <Row></Row>
              <Row className="justify-content-center mt-5">
                <Col lg="8">
                  <Card className="bg-gradient-secondary shadow">
                    <CardBody className="p-lg-5">
                      <h4 className="mb-1">Please enter your hash</h4>
                      <p className="mt-0 mb-0">
                        Enter your hash and click the button below.
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
                            placeholder="Your Hash"
                            type="text"
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
                          type="button"
                        >
                          Submit
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
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
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
        </main>
      </>
    );
  }
}

export default Form;
