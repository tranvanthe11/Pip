import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function getListDebt(pagination, filter, sorter, callback) {
  const axios = AxiosConfig();
  let api = "";
  if (Object.keys(pagination).length === 0) {
    if (Object.keys(filter).length === 0) {
      api = "/contract/contract-payment-operator";
    } else {
      api = `/contract/contract-payment-operator?${filter.filterStr}`;
    }
  } else {
    if (Object.keys(filter).length === 0) {
      api = `/contract/contract-payment-operator?page=${pagination.current}&size=${pagination.pageSize}`;
    } else {
      api = `/contract/contract-payment-operator?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
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
          getToken(() => getListDebt(pagination, filter, sorter, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function payDebt(data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/contract/contract-payment-operator/pay`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => payDebt(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
