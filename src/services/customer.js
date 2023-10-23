import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function getListCustomers(pagination, filter, sorter, callback) {
  const axios = AxiosConfig();
  let api = "";
  if (Object.keys(pagination).length === 0) {
    if (Object.keys(filter).length === 0) {
      api = "/customer";
    } else {
      api = `/customer?${filter.filterStr}`;
    }
  } else {
    if (Object.keys(filter).length === 0) {
      api = `/customer?page=${pagination.current}&size=${pagination.pageSize}`;
    } else {
      api = `/customer?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
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
            getListCustomers(pagination, filter, sorter, callback)
          );
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function getCustomerDetails(customer_id, callback) {
  const axios = AxiosConfig();

  axios
    .get(`/customer/detail/${customer_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getCustomerDetails(customer_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function createCustomer(data, callback) {
  const axios = AxiosConfig();

  axios
    .post(`/customer`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => createCustomer(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function updateCustomer(customer_id, data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/customer/detail/${customer_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateCustomer(customer_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function updateCustomerLevel(customer_id, data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/customer/detail/set-level/${customer_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateCustomerLevel(customer_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function searchCustomer(index, callback) {
  const axios = AxiosConfig();

  axios
    .get(`/customer/search_index?index=${index}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => searchCustomer(index, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
