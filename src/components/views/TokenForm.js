import React, { Component } from "react";

import classnames from "classnames";
import axios from "axios";

import Chart from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  chartOptions,
  parseOptions,
  linechart,
  barchart,
} from "../charts/charts.js";

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
  faDollarSign,
  faRedoAlt,
  faCoins,
  faChartLine,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

export class TokenForm extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     compare: false,
  //     token1: null,
  //     token2: null,
  //   };
  // }

  state = {
    compare: false,
    token1: null,
    token2: null,
    submitted: false,
    accounts: {
      data1: {
        address: null,
        first_in_time: null,
        last_out_time: null,
        full_balance: null,
        total_rewards_earned: null,
        active_delegations: null,
      },
      data2: {
        address: null,
        first_in_time: null,
        full_balance: null,
        total_rewards_earned: null,
      },
    },
    activeCycle: {
      cycle1: null,
      cycle2: null,
    },
    income: {
      data1: {
        marketCap: null,
        totalBonds: null,
        averageBondReturn: null,
        rewardsAvg: null,
        delegationsAvg: null,
      },
      data2: {
        marketCap: null,
        averageBondReturn: null,
      },
    },
    tickers: {
      XTZ_USD: null,
    },
    chartData: {
      line1: null,
      line2: null,
      bar1: null,
      bar2: null,
    },
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // chart options
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  formatDate = (date) => {
    return date.replace("T", ", ").replace("Z", "");
  };

  getVariance = (a, b) => {
    return ((a - b) / a) * 100;
  };

  getMarketCap = (accountData, bakingIncome, exchange, cycle) => {
    return Intl.NumberFormat().format(
      Math.round(
        (accountData.staking_balance +
          accountData.total_rewards_earned +
          (accountData.total_rewards_earned +
            bakingIncome[bakingIncome.length - 1] * 0.74) /
            cycle) *
          exchange *
          100
      ) / 100
    );
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onClick = (e) => this.setState({ submitted: true });

  onCompare = (e) => {
    this.setState({
      compare: !this.state.compare,
      submitted: false,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    // API call to ticker
    // it is needed for both single and compare
    let XTZ_USD = null;
    axios
      // .get("https://api.tzstats.com/markets/tickers")
      .get("/.netlify/functions/tickers")
      .then((res) => {
        let tickersData = res.data;

        // find XTZ_USD ticker under coinbasepro exchange
        let i;
        for (i = 0; i < tickersData.length; i++) {
          let curr = tickersData[i];
          if (curr.pair === "XTZ_USD" && curr.exchange === "coinbasepro") {
            // this.state.tickers.XTZ_USD = curr.last;
            XTZ_USD = curr.last;
            break;
          }
        }
      });

    // if tokens not compared, API calls for one (2)
    // else API calls for two (2 for each token)
    if (!this.state.compare) {
      axios
        .all([
          // axios.get(
          //   `https://api.tzstats.com/explorer/account/${this.state.token1}`
          // ),
          // axios.get(
          //   `https://api.tzstats.com/tables/income?address=${this.state.token1}`
          // ),

          axios.post("/.netlify/functions/account", {
            token: this.props.token1,
          }),
          axios.post("/.netlify/functions/income", {
            token: this.props.token1,
          }),
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

            const activeCycle = incomeData[i];

            // store all cycles
            let cycles = [];
            let j;
            for (j = 0; j <= i; j++) {
              cycles.push(j);
            }

            // store all bonds (for line chart)
            let bonds = [];
            // store bonds weighted average per cycle (for line chart)
            let bonds_w_avg = [];
            let bond_x_weight_sum = 0;
            let weight_sum = 0;
            // store baking income per cycle (for market cap)
            let bakingIncome = [];
            // store average rewards per cycle (for bar chart)
            let avg_rewards = [];
            // store all rewards (for bar chart)
            let rewards = [];
            // store delegations (for wnd rewards card)
            let delegations = [];

            let k;
            for (k = 0; k <= i; k++) {
              // bonds
              bonds.push(incomeData[k][22]);
              // bonds weighted average
              let bond = incomeData[k][22];
              let roll = incomeData[k][3];
              bond_x_weight_sum += bond * roll;
              weight_sum += roll;
              bonds_w_avg.push(bond_x_weight_sum / weight_sum);
              // baking income
              bakingIncome.push(incomeData[k][23]);
              // average rewards
              avg_rewards.push(incomeData[k][23] / incomeData[k][6]);
              // rewards
              rewards.push(incomeData[k][23]);
              // delegations
              delegations.push(incomeData[k][6]);
            }

            this.setState({
              accounts: {
                data1: {
                  address: accountData.address,
                  first_in_time: this.formatDate(accountData.first_in_time),
                  last_out_time: this.formatDate(accountData.last_out_time),
                  full_balance: accountData.staking_balance,
                  total_rewards_earned: accountData.total_rewards_earned,
                  active_delegations: accountData.active_delegations,
                },
                data2: {
                  address: "",
                  first_in_time: "",
                },
              },
              activeCycle: {
                cycle1: i,
              },
              income: {
                data1: {
                  marketCap: this.getMarketCap(
                    accountData,
                    bakingIncome,
                    XTZ_USD,
                    i
                  ),
                  totalBonds: activeCycle[22],
                  averageBondReturn: bond_x_weight_sum / weight_sum,
                  rewardsAvg: Math.round(
                    rewards.reduce((a, b) => a + b, 0) / i
                  ),
                  delegationsAvg: Math.round(
                    delegations.reduce((a, b) => a + b, 0) / i
                  ),
                },
                data2: {
                  marketCap: -1,
                },
              },
              tickers: {
                XTZ_USD: XTZ_USD,
              },
              chartData: {
                line1: {
                  labels: cycles,
                  datasets: [
                    {
                      label: "Bonds: ",
                      data: bonds.slice(0, bonds.length - 2),
                    },
                    {
                      label: "Bonds w-avg: ",
                      data: bonds_w_avg.slice(0, bonds_w_avg.length - 2),
                      borderColor: "rgba(45, 206, 137, 1)",
                    },
                  ],
                },
                bar1: {
                  labels: cycles,
                  datasets: [
                    {
                      label: "Avg Rewatds: ",
                      data: avg_rewards.slice(0, avg_rewards.length - 2),
                      type: "line",
                    },
                    {
                      label: "Rewards: ",
                      data: rewards.slice(0, rewards.length - 2),
                    },
                  ],
                },
              },
            });
          })
        )
        .catch((err) => {
          console.log(err);
        });
    } else {
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
        ])
        .then(
          axios.spread((account1, income1, account2, income2) => {
            const accountData1 = account1.data;
            const incomeData1 = income1.data;
            const accountData2 = account2.data;
            const incomeData2 = income2.data;

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

            const activeCycle1 = incomeData1[i];
            const activeCycle2 = incomeData2[ii];

            // store baking income per cycle (for market cap)
            let bakingIncome1 = [];
            let bakingIncome2 = [];

            let j;
            for (j = 0; j < i; j++) {
              // baking income
              bakingIncome1.push(incomeData1[j][23]);
            }

            let jj;
            for (jj = 0; jj < ii; jj++) {
              // baking income
              bakingIncome2.push(incomeData2[jj][23]);
            }

            // store all bonds (for line chart)
            let bonds1 = [];
            // store bonds weighted average per cycle (for line chart)
            let bonds_w_avg1 = [];
            let bond_x_weight_sum1 = 0;
            let weight_sum1 = 0;
            // store average rewards per cycle (for bar chart)
            let avg_rewards1 = [];
            // store all rewards (for bar chart)
            let rewards1 = [];

            let k;
            for (k = 0; k <= i; k++) {
              // bonds
              bonds1.push(incomeData1[k][22]);
              // bonds weighted average
              let bond = incomeData1[k][22];
              let roll = incomeData1[k][3];
              bond_x_weight_sum1 += bond * roll;
              weight_sum1 += roll;
              bonds_w_avg1.push(bond_x_weight_sum1 / weight_sum1);
              // average rewards
              avg_rewards1.push(incomeData1[k][23] / incomeData1[k][6]);
              // rewards
              rewards1.push(incomeData1[k][23]);
            }

            // store all bonds (for line chart)
            let bonds2 = [];
            // store bonds weighted average per cycle (for line chart)
            let bonds_w_avg2 = [];
            let bond_x_weight_sum2 = 0;
            let weight_sum2 = 0;
            // store average rewards per cycle (for bar chart)
            let avg_rewards2 = [];
            // store all rewards (for bar chart)
            let rewards2 = [];

            let kk;
            for (kk = 0; kk <= ii; kk++) {
              // bonds
              bonds2.push(incomeData2[kk][22]);
              // bonds weighted average
              let bond = incomeData2[kk][22];
              let roll = incomeData2[kk][3];
              bond_x_weight_sum2 += bond * roll;
              weight_sum2 += roll;
              bonds_w_avg2.push(bond_x_weight_sum2 / weight_sum2);
              // average rewards
              avg_rewards2.push(incomeData2[kk][23] / incomeData2[kk][6]);
              // rewards
              rewards2.push(incomeData2[kk][23]);
            }

            // store all cycles
            let cycle1 = [];
            let l;
            for (l = 0; l <= i; l++) {
              cycle1.push(l);
            }

            let cycle2 = [];
            let ll;
            for (ll = 0; ll <= ii; ll++) {
              cycle2.push(ll);
            }

            this.setState({
              submitted: true,
              accounts: {
                data1: {
                  address: accountData1.address,
                  first_in_time: this.formatDate(accountData1.first_in_time),
                  full_balance: accountData1.staking_balance,
                  total_rewards_earned: accountData1.total_rewards_earned,
                },
                data2: {
                  address: accountData2.address,
                  first_in_time: this.formatDate(accountData2.first_in_time),
                  full_balance: accountData2.staking_balance,
                  total_rewards_earned: accountData2.total_rewards_earned,
                },
              },
              activeCycle: {
                cycle1: activeCycle1,
                cycle2: activeCycle2,
              },
              income: {
                data1: {
                  marketCap: this.getMarketCap(
                    accountData1,
                    bakingIncome1,
                    XTZ_USD,
                    i
                  ),
                  averageBondReturn: bond_x_weight_sum1 / weight_sum1,
                },
                data2: {
                  marketCap: this.getMarketCap(
                    accountData2,
                    bakingIncome2,
                    XTZ_USD,
                    ii
                  ),
                  averageBondReturn: bond_x_weight_sum2 / weight_sum2,
                },
              },
              tickers: {
                XTZ_USD: XTZ_USD,
              },
              chartData: {
                line1: {
                  labels: cycle1,
                  datasets: [
                    {
                      label: "Bonds: ",
                      data: bonds1.slice(0, bonds1.length - 2),
                    },
                    {
                      label: "Bonds w-avg: ",
                      data: bonds_w_avg1.slice(0, bonds_w_avg1.length - 2),
                      borderColor: "rgba(45, 206, 137, 1)",
                    },
                  ],
                },
                line2: {
                  labels: cycle2,
                  datasets: [
                    {
                      label: "Bonds: ",
                      data: bonds2.slice(0, bonds2.length - 2),
                    },
                    {
                      label: "Bonds w-avg: ",
                      data: bonds_w_avg2.slice(0, bonds_w_avg2.length - 2),
                      borderColor: "rgba(45, 206, 137, 1)",
                    },
                  ],
                },
                bar1: {
                  labels: cycle1,
                  datasets: [
                    {
                      label: "Avg Rewatds: ",
                      data: avg_rewards1.slice(0, avg_rewards1.length - 2),
                      type: "line",
                    },
                    {
                      label: "Rewards: ",
                      data: rewards1.slice(0, rewards1.length - 2),
                    },
                  ],
                },
                bar2: {
                  labels: cycle2,
                  datasets: [
                    {
                      label: "Avg Rewatds: ",
                      data: avg_rewards2.slice(0, avg_rewards2.length - 2),
                      type: "line",
                    },
                    {
                      label: "Rewards: ",
                      data: rewards2.slice(0, rewards2.length - 2),
                    },
                  ],
                },
              },
            });
          })
        )
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const {
      accounts,
      activeCycle,
      chartData,
      compare,
      income,
      submitted,
    } = this.state;

    const single = (
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
            name="token1"
            type="text"
            onChange={this.onChange}
            onFocus={(e) => this.setState({ boxFocused: true })}
            onBlur={(e) => this.setState({ boxFocused: false })}
          />
        </InputGroup>
      </FormGroup>
    );

    const double = (
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
    );

    const stats = (
      <Container>
        {/* header */}
        <div className="header-body">
          <Row>
            <div className="col ml-4">
              <h4>
                <u>{accounts.data1.address}</u>
              </h4>
              <p>Joined {accounts.data1.first_in_time}</p>
            </div>
          </Row>

          <hr />

          {/* account cards */}
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
                        <u>Full Balance</u>
                      </CardTitle>
                      <span className="h4 font-weight-bold mb-2">
                        {accounts.data1.full_balance} XTZ
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
                      <span className="h4 font-weight-bold mb-2">
                        {accounts.data1.total_rewards_earned}
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
              <Card className="shadow border-0">
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
                        {accounts.data1.active_delegations}
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
              <Card className="shadow border-0">
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
                        {accounts.data1.last_out_time}
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

        {/* line chart (bonds) and income cards */}
        <div className="text-center mt-5">
          <Row>
            {/* Line Chart */}
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
                  <div className="chart">
                    <Line data={chartData.line1} options={linechart.options} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* Cards */}
            <Col className="mt-3 mb-5 mb-xl-0" xl="4">
              <Card className="mb-3 shadow border-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h4"
                        className="text-uppercase text-muted mb-2"
                      >
                        <u>Market Cap</u>
                      </CardTitle>
                      <span className="h4 font-weight-bold">
                        {income.data1.marketCap} USD
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                        <FontAwesomeIcon icon={faDollarSign} />
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
                        {activeCycle.cycle1}
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
                        {income.data1.totalBonds}
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
                        {income.data1.averageBondReturn}
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
            </Col>
          </Row>
        </div>

        <hr />

        {/* bar chart (rewards) and other income cards */}
        <div className="text-center mt-5">
          <Row>
            {/* Bar Chart */}
            <Col className="mb-5 mb-xl-0" xl="8">
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
                  <div className="chart">
                    <Bar data={chartData.bar1} options={barchart.options} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* Cards */}
            <Col className="mt-5 mb-5 mb-xl-0" xl="4">
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
                        {income.data1.rewardsAvg}
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
                        {income.data1.delegationsAvg}
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
            </Col>
          </Row>
        </div>
      </Container>
    );

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

    const getStats = (accountData, incomeData, linechartData, barchartData) => (
      <Container>
        {/* header */}
        <div className="header-body">
          <Row className="justify-content-center">
            <div className="text-center col ml-4">
              <h4>
                <u>{accountData.address}</u>
              </h4>
              <p>Joined {accountData.first_in_time}</p>
            </div>
          </Row>
        </div>

        <hr />

        {/* market cap card */}
        <Row>
          <Col>
            <Card className="shadow border-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h4"
                      className="text-center text-uppercase text-muted mb-2"
                    >
                      <u>Slot Market Cap</u>
                    </CardTitle>
                    <Row>
                      <Col className="text-center" lg="9">
                        <Row className="justify-content-center">
                          <span className="h4 font-weight-bold mt-3">
                            {incomeData.marketCap} USD
                          </span>
                        </Row>
                      </Col>
                      <Col className="text-center mr-3">
                        {this.getVariance(20, 10) >= 0 ? pos(10) : neg(20)}
                      </Col>
                    </Row>
                  </div>
                  <Col className="col-auto mr-3">
                    <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                      <FontAwesomeIcon icon={faDollarSign} />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Line Chart */}
        <div className="text-center mt-5">
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Average Bond Return
                      </h6>
                      <h4 className="text-white text-muted ls-1 mb-1">
                        {incomeData.averageBondReturn}
                      </h4>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Line data={linechartData} options={linechart.options} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <hr />

        {/* staking balance card */}
        <Row>
          <Col>
            <Card className="shadow border-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle
                      tag="h4"
                      className="text-center text-uppercase text-muted mb-2"
                    >
                      <u>Staking Balance</u>
                    </CardTitle>
                    <Row>
                      <Col className="text-center" lg="9">
                        <Row className="justify-content-center">
                          <span className="h4 font-weight-bold mt-3">
                            {accountData.full_balance}
                          </span>
                        </Row>
                      </Col>
                      <Col className="text-center mr-3">
                        {this.getVariance(10, 20) >= 0 ? pos(10) : neg(20)}
                      </Col>
                    </Row>
                  </div>
                  <Col className="col-auto mr-3">
                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                      <FontAwesomeIcon icon={faWallet} />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Bar Chart */}
        <div className="text-center mt-3">
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow mt-4">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Rewards Earned
                      </h6>
                      <h4 className="text-muted ls-1 mb-1">
                        {accountData.total_rewards_earned}
                      </h4>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart">
                    <Bar data={barchartData} options={barchart.options} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    );

    const comparison = (
      <Row>
        <Col>
          {getStats(
            accounts.data1,
            income.data1,
            chartData.line1,
            chartData.bar1
          )}
        </Col>
        <Col>
          {getStats(
            accounts.data2,
            income.data2,
            chartData.line2,
            chartData.bar2
          )}
        </Col>
      </Row>
    );

    return (
      <>
        <Container fluid className="bg-gradient-primary">
          <Row className="justify-content-center mb-5">
            <Col className="text-center mt-3" lg="12">
              <img
                alt="..."
                className="img-fluid floating"
                src={require("../../assets/img/address.png")}
              />
            </Col>
          </Row>
          <Row className="justify-content-center mt-5">
            <Col className="mt-5 mb-9" lg="8">
              <Form onSubmit={this.onSubmit}>
                <Card className="bg-gradient-secondary shadow mb-5">
                  <CardBody className="p-lg-5">
                    {!compare ? single : double}
                    <Row>
                      <Col>
                        <Button
                          block
                          className="btn-round"
                          color="default"
                          onClick={this.onClick}
                          size="lg"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          block
                          className="btn-round"
                          color="primary"
                          onClick={this.onCompare}
                          outline
                          size="lg"
                        >
                          {!compare ? "Compare" : "Back"}
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col className="text-center mt--150">
              {submitted ? (
                <img
                  alt="..."
                  className="img-fluid floating"
                  src={require("../../assets/img/arrow-48.png")}
                />
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Container>
        <Container fluid className={submitted ? "mt-5 mb-5" : ""}>
          {submitted ? (!compare ? stats : comparison) : ""}
        </Container>
      </>
    );
  }
}

export default TokenForm;
