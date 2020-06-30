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
  faDollarSign,
  faStar,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

export class StatsTwo extends Component {
  state = {
    hasResponse: false,
    token1: null,
    token2: null,
    stats: {
      account: {
        address: [],
        first_in_time: [],
        last_out_time: [],
        full_balance: [],
        total_rewards_earned: [],
      },
      income: {
        marketCap: [],
        bonds: [],
        average_return: [],
        average_rewards: [],
        start_time: [],
        end_time: [],
      },
      tickers: {
        to_USD: null,
      },
    },
    linechartData: null,
    barchartData: null,
  };

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

    axios
      .all([
        // axios.get(
        //   `https://api.tzstats.com/explorer/account/${this.state.token1}`
        // ),
        // axios.get(
        //   `https://api.tzstats.com/tables/income?address=${this.state.token1}`
        // ),
        // axios.get(
        //   `https://api.tzstats.com/explorer/account/${this.state.token2}`
        // ),
        // axios.get(
        //   `https://api.tzstats.com/tables/income?address=${this.state.token2}`
        // ),
        // axios.get("https://api.tzstats.com/markets/tickers"),

        axios.post("/.netlify/functions/account", {
          token: this.state.token1,
        }),
        axios.post("/.netlify/functions/income", {
          token: this.state.token1,
        }),
        axios.post("/.netlify/functions/account", {
          token: this.state.token2,
        }),
        axios.post("/.netlify/functions/income", {
          token: this.state.token2,
        }),
        axios.get("/.netlify/functions/tickers"),
      ])
      .then(
        axios.spread((account1, income1, account2, income2, tickers) => {
          const accountData1 = account1.data;
          const incomeData1 = income1.data;
          const accountData2 = account2.data;
          const incomeData2 = income2.data;

          const tickersData = tickers.data;

          // find active cycles
          let i;
          for (i = incomeData1.length - 1; i >= 0; i--) {
            // When total_bonds (i 22 of response Array) is not 0,
            // an active cycle is found.
            // 'i' will represent its position in the result Array
            if (incomeData1[i][22] !== 0) break;
          }

          let ii;
          for (ii = incomeData2.length - 1; ii >= 0; ii--) {
            // When total_bonds (i 22 of response Array) is not 0,
            // an active cycle is found.
            // 'i' will represent its position in the result Array
            if (incomeData2[ii][22] !== 0) break;
          }

          const active_cycle1 = incomeData1[i];
          const active_cycle2 = incomeData2[ii];

          // calculate max cycle and
          // store all cycle 0 to MAX
          let max_cycle = Math.max(active_cycle1[1], active_cycle2[1]);
          let cycles = [];
          let l;
          for (l = 0; l <= max_cycle; l++) {
            cycles.push(l);
          }

          // TODO: Refactor code below!!!

          // Array storing the bonds ans rewards over time
          let bonds_over_time1 = [];
          let avg_bonds_per_cycle1 = [];
          let rewards_over_time1 = []; // baking_income
          let avg_rewards_per_cycle1 = [];
          let tot_rewards1 = 0;

          // Each roll represents a weight which
          // multiplies the number of bonds
          // the sum of all teh weights (roll) is kept to
          // calculate the weighted average
          let bond_x_weight_sum1 = 0;
          let weight_sum1 = 0; // rolls' sum

          let j;
          for (j = 0; j <= i; j++) {
            bonds_over_time1.push(incomeData1[j][22]);
            rewards_over_time1.push(incomeData1[j][23]);
            tot_rewards1 += incomeData1[j][23];
            // avg_rewards_per_cycle.push(tot_rewards / tot_delegations);
            avg_rewards_per_cycle1.push(incomeData1[j][23] / incomeData1[j][6]);

            let bonds = incomeData1[j][22];
            let rolls = incomeData1[j][3];
            bond_x_weight_sum1 += bonds * rolls;
            weight_sum1 += rolls;
            avg_bonds_per_cycle1.push(bond_x_weight_sum1 / weight_sum1);
          }

          // repeat
          // Array storing the bonds ans rewards over time
          let bonds_over_time2 = [];
          let avg_bonds_per_cycle2 = [];
          let rewards_over_time2 = []; // baking_income
          let avg_rewards_per_cycle2 = [];
          let tot_rewards2 = 0;

          // Each roll represents a weight which
          // multiplies the number of bonds
          // the sum of all teh weights (roll) is kept to
          // calculate the weighted average
          let bond_x_weight_sum2 = 0;
          let weight_sum2 = 0; // rolls' sum

          let jj;
          for (jj = 0; jj <= ii; jj++) {
            bonds_over_time2.push(incomeData2[jj][22]);
            rewards_over_time2.push(incomeData2[jj][23]);
            tot_rewards2 += incomeData2[jj][23];
            // avg_rewards_per_cycle.push(tot_rewards / tot_delegations);
            avg_rewards_per_cycle2.push(
              incomeData2[jj][23] / incomeData2[jj][6]
            );

            let bonds = incomeData2[jj][22];
            let rolls = incomeData2[jj][3];
            bond_x_weight_sum2 += bonds * rolls;
            weight_sum2 += rolls;
            avg_bonds_per_cycle2.push(bond_x_weight_sum2 / weight_sum2);
          }

          // find XTZ_USD ticker under coinbasepro exchange
          let USD_exchange = null;
          let m;
          for (m = 0; m < tickersData.length; m++) {
            let curr = tickersData[m];
            if (curr.pair === "XTZ_USD" && curr.exchange === "coinbasepro") {
              USD_exchange = curr;
              break;
            }
          }

          this.setState({
            hasResponse: true,
            stats: {
              account: {
                address: [accountData1.address, accountData2.address],
                first_in_time: [
                  accountData1.first_in_time
                    .replace("T", ", ")
                    .replace("Z", ""),
                  accountData2.first_in_time
                    .replace("T", ", ")
                    .replace("Z", ""),
                ],
                last_out_time: [
                  accountData1.last_out_time
                    .replace("T", ", ")
                    .replace("Z", ""),
                  accountData2.last_out_time
                    .replace("T", ", ")
                    .replace("Z", ""),
                ],
                full_balance: [
                  accountData1.staking_balance,
                  accountData2.staking_balance,
                ],
                // accountData.total_balance + accountData.frozen_rewards,
                total_rewards_earned: [
                  accountData1.total_rewards_earned,
                  accountData2.total_rewards_earned,
                ],
              },
              income: {
                marketCap: [
                  Math.round(
                    (accountData1.staking_balance +
                      accountData1.total_rewards_earned +
                      (accountData1.total_rewards_earned +
                        rewards_over_time1[rewards_over_time1.length - 1] *
                          0.74) /
                        i) *
                      USD_exchange.last *
                      100
                  ) / 100,
                  Math.round(
                    (accountData2.staking_balance +
                      accountData2.total_rewards_earned +
                      (accountData2.total_rewards_earned +
                        rewards_over_time2[rewards_over_time2.length - 1] *
                          0.74) /
                        ii) *
                      USD_exchange.last *
                      100
                  ) / 100,
                ],
                bonds: [bonds_over_time1, bonds_over_time2],
                average_return: [
                  bond_x_weight_sum1 / weight_sum1,
                  bond_x_weight_sum2 / weight_sum2,
                ],
                average_rewards: [
                  Math.round(tot_rewards1 / active_cycle1[1]),
                  Math.round(tot_rewards2 / active_cycle2[1]),
                ],
                start_time: [active_cycle1[39], active_cycle2[39]],
                end_time: [active_cycle1[40], active_cycle2[40]],
              },
              ticker: {
                to_USD: USD_exchange,
              },
            },
            linechartData: {
              labels: cycles,
              datasets: [
                {
                  label: "T1 Bonds: ",
                  data: bonds_over_time1.slice(0, bonds_over_time1.length - 2),
                },
                {
                  label: "T1 Bonds w-avg: ",
                  data: avg_bonds_per_cycle1.slice(
                    0,
                    bonds_over_time1.length - 2
                  ),
                  borderColor: "rgba(45, 206, 137, 1)",
                },

                {
                  label: "T2 Bonds: ",
                  data: bonds_over_time2.slice(0, bonds_over_time2.length - 2),
                  borderColor: "rgba(137, 101, 244, 1)",
                },
                {
                  label: "T2 Bonds w-avg: ",
                  data: avg_bonds_per_cycle2.slice(
                    0,
                    bonds_over_time2.length - 2
                  ),
                  borderColor: "rgba(245, 54, 92, 1)",
                },
              ],
            },
            barchartData: {
              labels: cycles,
              datasets: [
                {
                  label: "T1 Avg Rewatds: ",
                  data: avg_rewards_per_cycle1.slice(
                    0,
                    avg_rewards_per_cycle1.length - 2
                  ),
                  type: "line",
                  borderColor: "rgba(45, 206, 137, 1)",
                },
                {
                  label: "T1 Rewards: ",
                  data: rewards_over_time1.slice(
                    0,
                    rewards_over_time1.length - 2
                  ),
                },

                {
                  label: "T2 Avg Rewatds: ",
                  data: avg_rewards_per_cycle2.slice(
                    0,
                    avg_rewards_per_cycle2.length - 2
                  ),
                  type: "line",
                  borderColor: "rgba(245, 54, 92, 1)",
                },
                {
                  label: "T2 Rewards: ",
                  data: rewards_over_time2.slice(
                    0,
                    rewards_over_time2.length - 2
                  ),
                  borderColor: "rgba(137, 101, 244, 1)",
                },
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
  };

  render() {
    const { hasResponse, stats } = this.state;

    const pos = (diff) => (
      <p className="mt-3 mb-0 text-muted text-md">
        <span className="text-success">
          <FontAwesomeIcon className="mr-2" icon={faArrowUp} />
          {diff}%
        </span>
      </p>
    );

    const neg = (diff) => (
      <p className="mt-3 mb-0 text-muted text-md">
        <span className="text-danger">
          <FontAwesomeIcon className="mr-2" icon={faArrowDown} />
          {diff}%
        </span>
      </p>
    );

    const dashboard = (
      <div className="text-center">
        <Container fluid>
          <div className="header-body">
            <Row className="justify-content-center">
              <Col className="text-center" lg="5">
                <h4>
                  <u>{stats.account.address[0]}</u>
                </h4>
                <p>Joined {stats.account.first_in_time[0]}</p>
              </Col>
              <Col lg="2">
                <h4>VS</h4>
              </Col>
              <Col className="text-center" lg="5">
                <h4>
                  <u>{stats.account.address[1]}</u>
                </h4>
                <p>Joined {stats.account.first_in_time[1]}</p>
              </Col>
            </Row>
            <Row>
              <div className="col col-6">
                <Card className="shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Market Cap</u>
                        </CardTitle>
                        <Row>
                          <Col className="text-center" lg="9">
                            <Row className="justify-content-center">
                              <span className="h4 font-weight-bold mb-2">
                                {Intl.NumberFormat().format(
                                  stats.income.marketCap[0]
                                )}{" "}
                                USD
                              </span>
                            </Row>
                            <Row className="justify-content-center">
                              <span className="h4 font-weight-bold mb-2">
                                {Intl.NumberFormat().format(
                                  stats.income.marketCap[1]
                                )}{" "}
                                USD
                              </span>
                            </Row>
                          </Col>
                          <Col className="text-center">
                            {Math.round(
                              ((stats.income.marketCap[0] -
                                stats.income.marketCap[1]) /
                                stats.income.marketCap[0]) *
                                100
                            ) /
                              100 >=
                            0
                              ? pos(
                                  Math.round(
                                    ((stats.income.marketCap[0] -
                                      stats.income.marketCap[1]) /
                                      stats.income.marketCap[0]) *
                                      100
                                  ) / 100
                                )
                              : neg(
                                  Math.round(
                                    ((stats.income.marketCap[0] -
                                      stats.income.marketCap[1]) /
                                      stats.income.marketCap[0]) *
                                      100
                                  ) / 100
                                )}
                          </Col>
                        </Row>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faDollarSign} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>

              <div className="col col-6">
                <Card className="shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-2"
                        >
                          <u>Rewards Earned</u>
                        </CardTitle>
                        <Row>
                          <Col className="text-center" lg="9">
                            <Row className="justify-content-center">
                              <span className="h4 font-weight-bold mb-2">
                                {stats.account.total_rewards_earned[0]}
                              </span>
                            </Row>
                            <Row className="justify-content-center">
                              <span className="h4 font-weight-bold mb-2">
                                {stats.account.total_rewards_earned[1]}
                              </span>
                            </Row>
                          </Col>
                          <Col className="text-center">
                            {Math.round(
                              ((stats.account.total_rewards_earned[0] -
                                stats.account.total_rewards_earned[1]) /
                                stats.account.total_rewards_earned[0]) *
                                100
                            ) /
                              100 >=
                            0
                              ? pos(
                                  Math.round(
                                    ((stats.account.total_rewards_earned[0] -
                                      stats.account.total_rewards_earned[1]) /
                                      stats.account.total_rewards_earned[0]) *
                                      100
                                  ) / 100
                                )
                              : neg(
                                  Math.round(
                                    ((stats.account.total_rewards_earned[0] -
                                      stats.account.total_rewards_earned[1]) /
                                      stats.account.total_rewards_earned[0]) *
                                      100
                                  ) / 100
                                )}
                          </Col>
                        </Row>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Row>
          </div>

          <div className="text-center mt-5">
            <Row>
              <Col className="mb-5 mb-xl-0" xl="12">
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
              </Col>
            </Row>
            <br />
            <Row>
              <Col className="mb-5 mb-xl-0" xl="12">
                <Card className="shadow mt-4">
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
            </Row>
          </div>

          <div className="text-center mt-5">
            <Row className="justify-content-center mt-5">
              <div className="col mt-5">
                <p>
                  Data provided by <a href="https://tezos.com/">Tezos</a>
                </p>
              </div>
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
                        Enter <strong>TWO</strong> of your Token Addresses and
                        click the button below.
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
                          placeholder="Token Address 1"
                          autoComplete="false"
                          name="token1"
                          type="text"
                          onChange={this.onChange}
                          onFocus={(e) => this.setState({ boxFocused: true })}
                          onBlur={(e) => this.setState({ boxFocused: false })}
                        />
                      </InputGroup>
                      <InputGroup className="input-group-alternative mt-2">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <FontAwesomeIcon icon={faKey} />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Token Address 2"
                          autoComplete="false"
                          name="token2"
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

export default StatsTwo;
