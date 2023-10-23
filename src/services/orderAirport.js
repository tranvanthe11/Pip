import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function getListOrderAirports(pagination, filter, sorter, callback) {
  const axios = AxiosConfig();
  let api;
  if (Object.keys(pagination).length === 0) {
    if (Object.keys(filter).length === 0) {
      api = "/order_airport";
    } else {
      api = `/order_airport?${filter.filterStr}`;
    }
  } else {
    if (Object.keys(filter).length === 0) {
      api = `/order_airport?page=${pagination.current}&size=${pagination.pageSize}`;
    } else {
      api = `/order_airport?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
    }
  }
  axios
    .get(api)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() =>
            getListOrderAirports(pagination, filter, sorter, callback)
          );
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function getOrderAirportDetail(order_airport_id, callback) {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .get(`/order_airport/detail/${order_airport_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getOrderAirportDetail(order_airport_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export const getPriceDistrict = (data, callback) => {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .post(`/first_protocol/sales/quotation`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getPriceDistrict(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
};

export function updateOrderAirport(_id, data, callback) {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .put(`/order_airport/${_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateOrderAirport(_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function removeOrderAirport(_id, callback) {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .put(`/order_airport/cancel/${_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => removeOrderAirport(_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function completeOrderAirport(_id, callback) {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .put(`/order_airport/complete/${_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => completeOrderAirport(_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
