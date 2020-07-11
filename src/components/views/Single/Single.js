// import React, { Component, Fragment } from "react";

// import { Container, Row } from "reactstrap";

// import Account from "./Account";

// export class Single extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const noToken = (
//       <div className="mt-5 mb-9">
//         <Row className="justify-content-center mt-5 mb-9">
//           <p>
//             <i>No valid Token...</i>
//           </p>
//         </Row>
//         <Row className="justify-content-center mt-5 mb-9">
//           <h1>To compare two tokens, please go through here</h1>
//         </Row>
//       </div>
//     );

//     const dashboard = (
//       <div className="header-body text-center mt-5 mb-5">
//         <Row>
//           <div className="col ml-4 mb-5">
//             <Fragment>
//               <Account accounts={this.props.accounts} />
//             </Fragment>
//           </div>
//         </Row>
//       </div>
//     );

//     return (
//       <Container fluid>
//         {/* {this.props.token1 !== null || this.props.token1 !== ""
//           ? dashboard
//           : noToken} */}
//         {this.props.token1 !== null || this.props.token1 !== "" ? "" : noToken}
//       </Container>
//     );
//   }
// }

// export default Single;
