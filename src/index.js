import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/worker");
  worker.start({
    serviceWorker: {
      url: "/mockServiceWorker.js", // Path to the service worker in the public directory
    },
  });
}

ReactDOM.render(<App />, document.getElementById("root"));
