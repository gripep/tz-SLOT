// import React, { Component } from "react";

// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Form,
//   FormGroup,
//   Input,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroup,
//   Container,
//   Row,
//   Col,
// } from "reactstrap";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faWallet,
//   faStar,
//   faUsers,
//   faCalendarAlt,
// } from "@fortawesome/free-solid-svg-icons";

// export class Account extends Component {
//   constructor(props) {
//     super(props);
//   }

//   formatDate = (date) => {
//     return date.replace("T", ", ").replace("Z", "");
//   };

//   render() {
//     return (
//       <Container>
//         <div className="header-body">
//           <Row>
//             <div className="col ml-4 mb-5">
//               <h4>
//                 <u>{this.props.accounts.data1.address}</u>
//               </h4>
//               <p>Joined {this.props.accounts.data1.first_in_time}</p>
//             </div>
//           </Row>
//           <Row>
//             <div className="col col-6">
//               <Card className="card-lift--hover shadow border-0">
//                 <CardBody>
//                   <Row>
//                     <div className="col">
//                       <CardTitle
//                         tag="h4"
//                         className="text-uppercase text-muted mb-2"
//                       >
//                         <u>Full Balance</u>
//                       </CardTitle>
//                       <span className="h4 font-weight-bold mb-2">
//                         {this.props.accounts.data1.full_balance} XTZ
//                       </span>
//                     </div>
//                     <Col className="col-auto">
//                       <div className="icon icon-shape bg-info text-white rounded-circle shadow">
//                         <FontAwesomeIcon icon={faWallet} />
//                       </div>
//                     </Col>
//                   </Row>
//                 </CardBody>
//               </Card>
//             </div>

//             <div className="col col-6">
//               <Card className="card-lift--hover shadow border-0">
//                 <CardBody>
//                   <Row>
//                     <div className="col">
//                       <CardTitle
//                         tag="h4"
//                         className="text-uppercase text-muted mb-2"
//                       >
//                         <u>Rewards Earned</u>
//                       </CardTitle>
//                       <span className="h4 font-weight-bold mb-2">
//                         {this.props.accounts.data1.total_rewards_earned}
//                       </span>
//                     </div>
//                     <Col className="col-auto">
//                       <div className="icon icon-shape bg-info text-white rounded-circle shadow">
//                         <FontAwesomeIcon icon={faStar} />
//                       </div>
//                     </Col>
//                   </Row>
//                 </CardBody>
//               </Card>
//             </div>
//           </Row>
//           <Row>
//             <div className="col col-6 mt-5">
//               <Card className="card-lift--hover shadow border-0">
//                 <CardBody>
//                   <Row>
//                     <div className="col">
//                       <CardTitle
//                         tag="h4"
//                         className="text-uppercase text-muted mb-0"
//                       >
//                         <u>Active Delegations</u>
//                       </CardTitle>
//                       <span className="h4 font-weight-bold mb-0">
//                         {this.props.accounts.data1.active_delegations}
//                       </span>
//                     </div>
//                     <Col className="col-auto">
//                       <div className="icon icon-shape bg-info text-white rounded-circle shadow">
//                         <FontAwesomeIcon icon={faUsers} />
//                       </div>
//                     </Col>
//                   </Row>
//                 </CardBody>
//               </Card>
//             </div>

//             <div className="col col-6 mt-5">
//               <Card className="card-lift--hover shadow border-0">
//                 <CardBody>
//                   <Row>
//                     <div className="col">
//                       <CardTitle
//                         tag="h4"
//                         className="text-uppercase text-muted mb-0"
//                       >
//                         <u>Last Active</u>
//                       </CardTitle>
//                       <span className="h4 font-weight-bold mb-0">
//                         {this.props.accounts.data1.last_out_time}
//                       </span>
//                     </div>
//                     <Col className="col-auto">
//                       <div className="icon icon-shape bg-info text-white rounded-circle shadow">
//                         <FontAwesomeIcon icon={faCalendarAlt} />
//                       </div>
//                     </Col>
//                   </Row>
//                 </CardBody>
//               </Card>
//             </div>
//           </Row>
//         </div>
//       </Container>
//     );
//   }
// }

// export default Account;
