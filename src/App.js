import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import Footer from "./components/Footer";
// import Header from "./components/Header";
import Landing from "./components/Landing";
import Stats from "./components/Stats";
import StatsTwo from "./components/StatsTwo";

// import "./assets/css/chart-react.css";
import "./assets/css/argon-dashboard-react.css";

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/single" component={Stats} />
          <Route exact path="/double" component={StatsTwo} />
        </Switch>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
