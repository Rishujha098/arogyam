import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";   // TailwindCSS styles
import App from "./App.jsx";   // 👈 App import karo, Chatbot nahi

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
