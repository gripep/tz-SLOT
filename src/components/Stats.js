import React, { Component } from "react";

import axios from "axios";
import classnames from "classnames";

import Chart from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  chartOptions,
  parseOptions,
  linechart,
  barchart,
} from "./charts/charts.js";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
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
import {
  faKey,
  faWallet,
  faStar,
  faUsers,
  faCalendarAlt,
  faRedoAlt,
  faCoins,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export class Stats extends Component {
  state = {
    hasResponse: false,
    token: null,
    stats: {
      account: {
        address: null,
        first_in_time: null,
        last_out_time: null,
        active_delegations: null,
        full_balance: null,
        total_rewards_earned: null,
      },
      income: {
        cycle: null,
        bonds: [],
        total_bonds: null,
        average_return: null,
        average_delegations: [],
        average_rewards: [],
        start_time: null,
        end_time: null,
      },
    },
    linechartData: null,
    barchartData: null,
  };

  // Intl.NumberFormat().format(
  //   Math.round(
  //     bonds.balance[bonds.balance.length - 1] * 100
  //   ) / 100
  //  )

  // new Intl.DateTimeFormat("en-US", {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // }).format(bonds.start_time[bonds.start_time.length - 1])}

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    // // prod
    // const fetchAccount = async () => {
    //   await (
    //     await fetch("./netlyfy/lambda-functions/account", {
    //       method: "POST",
    //       headers: {
    //         "Content-type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         token: this.state.token,
    //       }),
    //     })
    //   ).json();
    // };

    // // dev
    // const fetchAccountDev = async () => {
    //   await (
    //     await fetch("http://localhost:9000/account", {
    //       method: "POST",
    //       headers: {
    //         "Content-type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         token: this.state.token,
    //       }),
    //     })
    //   ).json();
    // };

    // // prod
    // const fetchIncome = async () => {
    //   await (
    //     await fetch("./netlyfy/lambda-functions/income", {
    //       method: "POST",
    //       headers: {
    //         "Content-type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         token: this.state.token,
    //       }),
    //     })
    //   ).json();
    // };

    // // dev
    // const fetchIncomeDev = async () => {
    //   await (
    //     await fetch("http://localhost:9000/income", {
    //       method: "POST",
    //       headers: {
    //         "Content-type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         token: this.state.token,
    //       }),
    //     })
    //   ).json();
    // };

    const fetchAccount = async () => {
      await (
        await fetch("./netlyfy/functions/account", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            token: this.state.token,
          }),
        })
      ).json();
    };

    fetchAccount().then((res) => {
      console.log(res);
    });
    // axios
    //   .post("http://localhost:9000/.netlify/account", {
    //     body: {
    //       token: this.state.token,
    //     },
    //   })
    //   .then((res) => {
    //     console.log("res...");
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log("err...");
    //     console.log(err);
    //   });

    axios
      .all([
        axios.get(
          `https://api.tzstats.com/explorer/account/${this.state.token}`
        ),
        axios.get(
          `https://api.tzstats.com/tables/income?address=${this.state.token}`
        ),
      ])
      .then(
        axios.spread((account, income) => {
          const accountData = account.data;
          const incomeData = income.data;

          // find active cycle
          let i;
          for (i = incomeData.length - 1; i >= 0; i--) {
            // When total_bonds (i 22 of response Array) is not 0,
            // an active cycle is found.
            // 'i' will represent its position in the result Array
            if (incomeData[i][22] !== 0) break;
          }

          // Array storing the bonds ans rewards over time
          let bonds_over_time = [];
          let delegations_over_time = [];
          let tot_delegations = 0;
          let rewards_over_time = []; // baking_income
          let tot_rewards = 0;

          // Each roll represents a weight which
          // multiplies the number of bonds
          // the sum of all teh weights (roll) is kept to
          // calculate the weighted average
          let bond_x_weight_sum = 0;
          let weight_sum = 0; // rolls' sum

          let j;
          for (j = 0; j <= i; j++) {
            bonds_over_time.push(incomeData[j][22]);
            delegations_over_time.push(incomeData[j][6]);
            tot_delegations += incomeData[j][6];
            rewards_over_time.push(incomeData[j][23]);
            tot_rewards += incomeData[j][23];

            let bonds = incomeData[j][22];
            let rolls = incomeData[j][3];
            bond_x_weight_sum += bonds * rolls;
            weight_sum += rolls;
          }
          const active_cycle = incomeData[i];

          // calculate all cycles
          let cycles = [];
          let l;
          for (l = 0; l <= i; l++) {
            cycles.push(l);
          }

          this.setState({
            hasResponse: true,
            stats: {
              account: {
                address: accountData.address,
                first_in_time: accountData.first_in_time
                  .replace("T", ", ")
                  .replace("Z", ""),
                last_out_time: accountData.last_out_time
                  .replace("T", ", ")
                  .replace("Z", ""),
                active_delegations: accountData.active_delegations,
                full_balance:
                  accountData.total_balance + accountData.frozen_rewards,
                total_rewards_earned: accountData.total_rewards_earned,
              },
              income: {
                cycle: active_cycle[1],
                bonds: bonds_over_time,
                total_bonds: active_cycle[22],
                average_return: bond_x_weight_sum / weight_sum,
                average_delegations: Math.round(
                  tot_delegations / active_cycle[1]
                ),
                average_rewards: Math.round(tot_rewards / active_cycle[1]),
                start_time: active_cycle[39],
                end_time: active_cycle[40],
              },
            },
            linechartData: {
              labels: cycles,
              datasets: [
                {
                  label: "Bonds: ",
                  data: bonds_over_time,
                },
                // {
                //   label: "Rewards: ",
                //   data: rewards_over_time,
                //   type: "bar",
                // },
              ],
            },
            barchartData: {
              labels: cycles,
              datasets: [
                {
                  label: "Rewards: ",
                  data: rewards_over_time,
                },
                // {
                //   label: "Delegations: ",
                //   data: delegations_over_time,
                //   type: "line",
                // },
              ],
            },
          });
          // console.log(this.state.stats);
          // console.log(accountData);
          // console.log(incomeData);
          // console.log(active_cycle);
        })
      )
      .catch((err) => {
        console.log(err);
      });

    // Promise.all([
    //   fetch(`https://api.tzstats.com/explorer/account/${this.state.token}`),
    //   fetch(
    //     `https://api.tzstats.com/tables/income?address=${this.state.token}`
    //   ),
    // ])
    //   .then(([account, income]) => Promise.all([account.json(), income.json()]))
    //   .then(([accountData, incomeData]) => {
    //     // find active cycle
    //     let i;
    //     for (i = incomeData.length - 1; i >= 0; i--) {
    //       // When total_bonds (index 22 of result Array) is not 0,
    //       // an active cycle is found.
    //       // 'i' will represent its position in the result Array
    //       if (incomeData[i][22] !== 0) break;
    //     }
    //     // create an array containing the bonds over time
    //     let bonds_over_time = [];
    //     let j;
    //     for (j = 0; j <= i; j++) {
    //       bonds_over_time.push(incomeData[j][22]);
    //     }
    //     // find tot bonds for average_return by
    //     // calculating the difference between consecutive bonds
    //     let tot = 0;
    //     let k;
    //     for (k = 1; k <= i; k++) {
    //       tot += incomeData[k][22] - incomeData[k - 1][22];
    //     }
    //     const active_cycle = incomeData[i];
    //     // calculate last 7 cycles
    //     let last_7_cycles = [];
    //     let l;
    //     for (l = 0; l < 7; l++) {
    //       last_7_cycles.push(active_cycle[1] - l);
    //     }
    //     this.setState({
    //       hasResponse: true,
    //       stats: {
    //         account: {
    //           address: accountData.address,
    //           first_in_time: accountData.first_in_time
    //             .replace("T", ", ")
    //             .replace("Z", ""),
    //           last_out_time: accountData.last_out_time
    //             .replace("T", ", ")
    //             .replace("Z", ""),
    //           active_delegations: accountData.active_delegations,
    //           full_balance:
    //             accountData.total_balance + accountData.frozen_rewards,
    //           total_rewards_earned: accountData.total_rewards_earned,
    //         },
    //         income: {
    //           cycle: active_cycle[1],
    //           bonds: bonds_over_time,
    //           total_bonds: active_cycle[22],
    //           average_return: tot / active_cycle[1],
    //           start_time: active_cycle[39],
    //           end_time: active_cycle[40],
    //         },
    //       },
    //       linechartData: {
    //         labels: last_7_cycles.reverse(),
    //         datasets: [
    //           {
    //             label: "Bonds",
    //             data: bonds_over_time.slice(
    //               bonds_over_time.length - 7,
    //               bonds_over_time.length - 1
    //             ),
    //           },
    //         ],
    //       },
    //     });
    //     // console.log(this.state.stats);
    //     // console.log(accountData);
    //     // console.log(incomeData);
    //     // console.log(active_cycle);
    //   });
  };

  render() {
    const { hasResponse, stats } = this.state;

    const dashboard = (
      <div className="text-center">
        <Container fluid>
          <div className="header-body">
            <Row>
              <div className="col ml-4 mb-5">
                <h4>
                  <u>{stats.account.address}</u>
                </h4>
                <p>Joined {stats.account.first_in_time}</p>
              </div>
            </Row>
            <Row>
              <div className="col col-6">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Full Balance</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-2">
                          {stats.account.full_balance} XTZ
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faWallet} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>

              <div className="col col-6">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Rewards Earned</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-2">
                          {stats.account.total_rewards_earned}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Row>
            <Row>
              <div className="col col-6 mt-5">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Active Delegations</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {stats.account.active_delegations}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>

              <div className="col col-6 mt-5">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Last Active</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {stats.account.last_out_time}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Row>
          </div>
          <hr />
          <div className="text-center mt-5">
            <Row>
              <Col className="mb-5 mb-xl-0" xl="8">
                <Card className="bg-gradient-default shadow">
                  <CardHeader className="bg-transparent">
                    <Row className="align-items-center">
                      <div className="col">
                        <h6 className="text-uppercase text-muted ls-1 mb-1">
                          Bonds
                        </h6>
                        <h2 className="text-white mb-0">Bonds per cycle</h2>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}
                    <div className="chart">
                      <Line
                        data={this.state.linechartData}
                        options={linechart.options}
                        getDatasetAtEvent={(e) => console.log(e)}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="shadow mt-5">
                  <CardHeader className="bg-transparent">
                    <Row className="align-items-center">
                      <div className="col">
                        <h6 className="text-uppercase text-muted ls-1 mb-1">
                          Rewards
                        </h6>
                        <h2 className="mb-0">Rewards per cycle</h2>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}
                    <div className="chart">
                      <Bar
                        data={this.state.barchartData}
                        options={barchart.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Deposit Time</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold">
                          <p>
                            First Deposit:{" "}
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(stats.income.start_time)}
                          </p>
                          <p>
                            Last Deposit:{" "}
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(stats.income.end_time)}
                          </p>
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Cycle</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold">
                          {stats.income.cycle}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faRedoAlt} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Total Bonds</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold">
                          {stats.income.total_bonds}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faCoins} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Avg Bond Return</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold">
                          {stats.income.average_return}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faChartLine} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Avg Rewards per Cycle</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold">
                          {stats.income.average_rewards}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Avg Delegations per Cycle</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold">
                          {stats.income.average_delegations}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Row className="justify-content-center mt-5">
                  <div className="col mt-5">
                    <p>
                      Data provided by <a href="https://tezos.com/">Tezos</a>
                    </p>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );

    const wait = (
      <div className="text-center mt-5">
        <img
          alt="..."
          className="img-fluid floating"
          src={require("../assets/img/address.png")}
        />
        <h4 className="ml-5 mt-5">Waiting for Token Address...</h4>
      </div>
    );

    return (
      <>
        {/* <section className="section section-lg pt-lg-0 bg-gradient-default"> */}
        <Container fluid className="bg-gradient-default">
          <Row></Row>
          <Row className="justify-content-center mt-5">
            <Col lg="8">
              <Form onSubmit={this.onSubmit}>
                <Card className="bg-gradient-secondary shadow mb-5">
                  <CardBody className="p-lg-5">
                    <h3 className="mb-1">Please enter a Token Address</h3>
                    <p className="mt-0 mb-1">
                      <small>
                        Enter your Token Address and click the button below.
                      </small>
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
        {/* </section> */}
        <section className="section section-lg pt-lg-0t">
          <Container>
            <Row className="justify-content-center mt-5 mb-5">
              <Col lg="12">{hasResponse ? dashboard : wait}</Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }
}

export default Stats;
