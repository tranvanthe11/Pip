import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function getListVouchers(pagination, filter, sorter, callback) {
    const axios = AxiosConfig();
    let api = "";
    if (Object.keys(pagination).length === 0) {
      if (Object.keys(filter).length === 0) {
        api = "/voucher";
      } else {
        api = `/voucher?${filter.filterStr}`;
      }
    } else {
      if (Object.keys(filter).length === 0) {
        api = `/voucher?page=${pagination.current}&size=${pagination.pageSize}`;
      } else {
        api = `/voucher?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
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
              getListVouchers(pagination, filter, sorter, callback)
            );
          } else {
            callback(err.response.data);
          }
        }
      });
  }
  export function getVoucherDetails(voucher_id, callback) {
    const axios = AxiosConfig();
  
    axios
      .get(`/voucher/detail/${voucher_id}`)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            getToken(() => getVoucherDetails(voucher_id, callback));
          } else {
            callback(err.response.data);
          }
        }
      });
  }

export function createVoucher(data, callback) {
    const axios = AxiosConfig();
  
    axios
      .post(`/voucher`, data)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            getToken(() => createVoucher(data, callback));
          } else {
            callback(err.response.data);
          }
        }
      });
  }

  export function updateVoucher(voucher_id, data, callback) {
    const axios = AxiosConfig();
  
    axios
      .put(`/voucher/detail/${voucher_id}`, data)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            getToken(() => updateVoucher(voucher_id, data, callback));
          } else {
            callback(err.response.data);
          }
        }
      });
  }

  export function searchVoucher(voucher_name, callback) {
    const axios = AxiosConfig();
  
    axios
      .get(`/voucher/search?voucher_name=${voucher_name}`)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            getToken(() => searchVoucher(voucher_name, callback));
          } else {
            callback(err.response.data);
          }
        }
      });
  }

  export function deleteVoucher(voucher_id, callback) {
    const axios = AxiosConfig();
    axios
      .delete(`/voucher/${voucher_id}`)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            getToken(() => deleteVoucher(voucher_id, callback));
          } else {
            callback(err.response.data);
          }
        }
      });
  }