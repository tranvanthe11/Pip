import axios from "axios";
import { applyMiddleware } from "redux";
import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export const getListFlights = (pagination, filter, sorter, callback) => {
  const axiosConfig = AxiosConfig();
  let api = "";
  if (Object.keys(filter).length === 0) {
    api = `/flight_number?page=${pagination.current}&size=${pagination.pageSize}`;
  } else {
    api = `/flight_number?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
  }
  axiosConfig
    .get(api)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getListFlights(pagination, filter, sorter, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
};
export function createFlightNumber(data, callback) {
  const axios = AxiosConfig();
  axios
    .post(`/flight_number/create`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => createFlightNumber(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function getFlightDetail(flight_id, callback) {
  const axios = AxiosConfig();
  axios
    .get(`/flight_number/${flight_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getFlightDetail(flight_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function removeFlight(flight_id, callback) {
  const axios = AxiosConfig();

  axios
    .delete(`/flight_number/${flight_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => removeFlight(flight_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function updateFlight(flight_id, data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/flight_number/${flight_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateFlight(flight_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
