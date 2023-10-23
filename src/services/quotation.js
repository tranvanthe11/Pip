import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function getListQuotation(pagination, filter, sorter, callback) {
  const axios = AxiosConfig();
  let api = "";
  if (Object.keys(pagination).length === 0) {
    if (Object.keys(filter).length === 0) {
      api = "/quotation";
    } else {
      api = `/quotation?${filter.filterStr}`;
    }
  } else {
    if (Object.keys(filter).length === 0) {
      api = `/quotation?page=${pagination.current}&size=${pagination.pageSize}`;
    } else {
      api = `/quotation?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
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
            getListQuotation(pagination, filter, sorter, callback)
          );
        } else {
          callback(err.response.data);
        }
      }
    });
}
