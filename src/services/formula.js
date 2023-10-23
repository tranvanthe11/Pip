import axios from "axios";
import { applyMiddleware } from "redux";
import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export const getListFormulas = (pagination, filter, sorter, callback) => {
  const axiosConfig = AxiosConfig();
  let api = "";
  if (Object.keys(pagination).length === 0) {
    api = '/first_protocol'
  }
  if (Object.keys(filter).length === 0) {
    api = `/first_protocol?page=${pagination.current}&size=${pagination.pageSize}`;
  } else {
    api = `/first_protocol?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
  }
  axiosConfig
    .get(api)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getListFormulas(pagination, filter, sorter, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
};

export function createFormula(data, callback) {
  const axios = AxiosConfig();
  axios
    .post(`/first_protocol`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => createFormula(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function getFormulaDetail(formula_id, callback) {
  const axios = AxiosConfig();
  axios
    .get(`/first_protocol/detail/${formula_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getFormulaDetail(formula_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function removeFormula(formula_id, callback) {
  const axios = AxiosConfig();

  axios
    .delete(`/first_protocol/${formula_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => removeFormula(formula_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function updateFormula(formula_id, data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/first_protocol/${formula_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateFormula(formula_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
