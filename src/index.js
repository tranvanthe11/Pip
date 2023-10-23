import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";
import "core-js";
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { icons } from "./assets/icons";

import { Provider } from "react-redux";
import store from "./store";
import "antd/dist/antd.css";
import "src/services/i18n";

import { getProvinceThunk } from "src/actions/province";
import { getDistrictThunk } from "src/actions/district";
import { getCarTypeThunk } from "src/actions/carType";
import { getServicesThunk } from "src/actions/services";
import { getAirportThunk } from "src/actions/airport";

React.icons = icons;

store.dispatch(getProvinceThunk);
store.dispatch(getDistrictThunk);
store.dispatch(getCarTypeThunk);
store.dispatch(getServicesThunk);
store.dispatch(getAirportThunk);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
