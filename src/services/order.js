import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function getListOrders(pagination, filter, sorter, callback) {
  const axios = AxiosConfig();
  let api;
  if (Object.keys(pagination).length === 0) {
    if (Object.keys(filter).length === 0) {
      api = "/order";
    } else {
      api = `/order?${filter.filterStr}`;
    }
  } else {
    if (Object.keys(filter).length === 0) {
      api = `/order?page=${pagination.current}&size=${pagination.pageSize}`;
    } else {
      api = `/order?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
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
          getToken(() => getListOrders(pagination, filter, sorter, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function getOrderDetail(_id, callback) {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .get(`/order/detail/${_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getOrderDetail(_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function confirmOrderDetail(_id, callback) {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .put(`/order/confirm/${_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => confirmOrderDetail(_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function cancelOrderDetail(_id, callback) {
  const axiosConfig = AxiosConfig();
  axiosConfig
    .put(`/order/cancel/${_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => cancelOrderDetail(_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
