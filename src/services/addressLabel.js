import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export function getAddressLabelDetail(id, callback) {
    const axios = AxiosConfig();
  
    axios
      .get(`/address-label/detail/${id}`)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403 || err.response.status === 403) {
            getToken(() => getAddressLabelDetail(id, callback));
          } else {
            callback(err.response.data);
          }
        }
      });
  }

export function updateAddressLabel(id, data, callback) {
    const axios = AxiosConfig();

    axios.put(`/address-label/update/${id}`, data).then(res => {
        callback(res.data);
    }).catch(err => {
        if (err.response) {
            if (err.response.status === 403) {
                getToken(() => updateAddressLabel(id, data, callback));
            } else {
                callback(err.response.data);
            }
        }
    });
}

export function deleteAddressLabel(id, callback) {
    const axios = AxiosConfig();
  
    axios
      .delete(`/address-label/delete/${id}`)
      .then((res) => {
        callback(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) {
            getToken(() => deleteAddressLabel(id, callback));
          } else {
            callback(err.response.data);
          }
        }
      });
  }