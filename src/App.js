import React from "react";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Stats from "./components/Stats";

import "./assets/css/chart-react.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Stats />
      <Footer />
    </div>
  );
}

export default App;
