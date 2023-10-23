import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function updateAvatar(supplier_id, data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/supplier/upload/${supplier_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateAvatar(supplier_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function addAvatar(data, callback) {
  const axios = AxiosConfig();

  axios
    .post(`/supplier/upload`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => addAvatar(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function getListDrivers(pagination, filter, sorter, callback) {
  const axios = AxiosConfig();
  let api = "";
  if (Object.keys(pagination).length === 0) {
    if (Object.keys(filter).length === 0) {
      api = "/supplier";
    } else {
      api = `/supplier?${filter.filterStr}`;
    }
  } else {
    if (Object.keys(filter).length === 0) {
      api = `/supplier?page=${pagination.current}&size=${pagination.pageSize}`;
    } else {
      api = `/supplier?page=${pagination.current}&size=${pagination.pageSize}&${filter.filterStr}`;
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
          // console.log("Dang lay lai token");
          getToken(() => getListDrivers(pagination, filter, sorter, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function createDriver(data, callback) {
  const axios = AxiosConfig();

  axios
    .post(`/supplier`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => createDriver(data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
export function updateDriver(supplier_id, data, callback) {
  const axios = AxiosConfig();

  axios
    .put(`/supplier/detail/${supplier_id}`, data)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateDriver(supplier_id, data, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function getDriverDetails(supplier_id, callback) {
  const axios = AxiosConfig();

  axios
    .get(`/supplier/detail/${supplier_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getDriverDetails(supplier_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}

export function searchDriver(index, callback) {
  const axios = AxiosConfig();

  axios
    .get(`/supplier/search_index?index=${index}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => searchDriver(index, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
