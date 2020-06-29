import React, { Fragment } from "react";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Footer from "./components/Footer";
// import Header from "./components/Header";
import Stats from "./components/Stats";

import "./assets/css/chart-react.css";

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        {/* <Header /> */}
        <div className="App">
          <Switch>
            {/* <Route exact path="/" component={Landing} /> */}
            <Route exact path="/" component={Stats} />
            <Redirect to="/" />
          </Switch>
        </div>
        <Footer />
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
