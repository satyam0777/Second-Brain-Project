
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { setAuthToken } from './api/axios'; 
import ErrorBoundary from './components/ErrorBoundary';

const token = localStorage.getItem("token"); 
if (token) {
  setAuthToken(token); 
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);