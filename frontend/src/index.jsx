// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";

// 1) Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// 2) Bootstrap JS (incluye Popper): activa el colapso del navbar, tooltips, etc.
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
