import React, { Fragment } from "react";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import TokenForm from "./components/views/TokenForm";

import "./assets/css/index.css";

function App() {
  return (
    <div className="App">
      <Fragment>
        <Header />
        <TokenForm />
        <Footer />
      </Fragment>
    </div>
  );
}

export default App;
