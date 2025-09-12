import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="bg-zinc-50 text-zinc-900 min-h-screen">
      <App />
    </div>
  </React.StrictMode>
);