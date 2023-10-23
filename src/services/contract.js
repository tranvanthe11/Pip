import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

// const axios = AxiosConfig();

export function getListContracts(pagination, filter, sorter, callback) {
  console.log(Object.keys(pagination).length, Object.keys(filter).length);
  const axios = AxiosConfig();
  let api = "";
  if (Object.keys(pagination).length === 0) {
    if (Object.keys(filter).length === 0) {
      api = "/contract";
    } else {
      api = `/contract?${filter.filterStr}`;
    }
  } else {
    if (Object.keys(filter).length === 0) {
      api = `/contract?page=${pagination.current}&size=${pagination.pageSize}`;
    } else {
      api = `/contract?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
    }
  }
  axios
    .get(api)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response.status === 403) {
        getToken(() => getListContracts(pagination, filter, sorter, callback));
      } else {
        callback(err.response.data);
      }
    });
}

export function getContractDetail(id, callback) {
  const axios = AxiosConfig();

  axios
    .get(`/contract/detail/${id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403 || err.response.status === 403) {
          getToken(() => getContractDetail(id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function createContract(data, callback) {
  const axios = AxiosConfig();

  axios
    .post(`/contract`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => createContract(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function updateContract(contract_id, data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/contract/detail/${contract_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateContract(contract_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function searchDriver(phone, car_type, callback) {
  const axios = AxiosConfig();
  axios
    .get(`/supplier/search?phone=${phone}&car_type=${car_type}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => searchDriver(phone, car_type, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function searchCustomer(phone, callback) {
  const axios = AxiosConfig();
  axios
    .get(`/customer/search?phone=${phone}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => searchDriver(phone, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function completeContract(contract_id, callback) {
  const axios = AxiosConfig();
  axios
    .put(`/contract/complete-contract/${contract_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => searchDriver(contract_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function cancelContract(contract_id, callback) {
  const axios = AxiosConfig();
  axios
    .put(`/contract/cancel-contract/${contract_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => searchDriver(contract_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function dropContract(contract_id, callback) {
  const axios = AxiosConfig();
  axios
    .put(`/contract/drop-contract/${contract_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => searchDriver(contract_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
