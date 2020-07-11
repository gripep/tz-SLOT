import React from "react";
// import React, { Component } from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

// import Footer from "./components/Footer";
// import Header from "./components/Header";
// import Landing from "./components/Landing";
// import Stats from "./components/Stats";
// import StatsTwo from "./components/StatsTwo";

// import Dashboard from "./components/views/Compare/Dashboard";
// import Single from "./components/views/Single/Single";
import TokenForm from "./components/views/TokenForm";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

// import "./assets/css/chart-react.css";
import "./assets/css/argon-dashboard-react.css";

function App() {
  return (
    // <BrowserRouter>
    //   {/* <Header /> */}
    //   <div className="App">
    //     <Switch>
    //       <Route exact path="/" component={Landing} />
    //       <Route exact path="/single" component={Stats} />
    //       <Route exact path="/double" component={StatsTwo} />
    //     </Switch>
    //   </div>
    //   <Footer />
    // </BrowserRouter>

    <BrowserRouter>
      <Header />
      <div className="App">
        <Switch>
          <Route exact path="/" component={TokenForm} />
          {/* <Route exact path="/compare" component={Dashboard} /> */}
          {/* <Route exact path="/stats" component={Single} /> */}
        </Switch>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

// class App extends Component {
//   state = {
//     token1: "tz3RDC3Jdn4j15J7bBHZd29EUee9gVB1CxD9",
//     token2: null,
//   };

//   // state = {
//   //   token1: "tz3RDC3Jdn4j15J7bBHZd29EUee9gVB1CxD9",
//   //   token2: "tz1eEnQhbwf6trb8Q8mPb2RaPkNk2rN7BKi8",
//   // };

//   render() {
//     return (
//       <BrowserRouter>
//         <Header />
//         <div className="App">
//           <Switch>
//             <Route
//               exact
//               path="/"
//               component={() => (
//                 <TokenForm
//                   token1={this.state.token1}
//                   token2={this.state.token2}
//                 />
//               )}
//             />
//             <Route
//               exact
//               path="/compare"
//               component={() => (
//                 <Dashboard
//                   token1={this.state.token1}
//                   token2={this.state.token2}
//                 />
//               )}
//             />
//             <Route
//               exact
//               path="/stats"
//               component={() => (
//                 <Single token1={this.state.token1} token2={this.state.token2} />
//               )}
//             />
//           </Switch>
//         </div>
//         <Footer />
//       </BrowserRouter>
//     );
//   }
// }

// export default App;
