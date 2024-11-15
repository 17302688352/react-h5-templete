import "core-js/stable";
import React from "react";
import ReactDOM from "react-dom/client";
import "regenerator-runtime/runtime";
import "antd-mobile/es/global";
import App from "./App";
import "./assets/style/index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
	// <React.StrictMode>
	<App />
	// </React.StrictMode>
);
