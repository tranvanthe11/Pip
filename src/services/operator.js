import { AxiosConfig } from "src/configs";
import { getToken } from "./auth";

export const updateContractsOperator = (_id, supplier_id, callback) => {
  const axios = AxiosConfig();
  axios
    .put(`${process.env.REACT_APP_API}/contract/add-driver/${_id}`, {
      supplier_id,
    })
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => updateContractsOperator(_id, supplier_id));
        } else {
          callback(err.response.data);
        }
      }
    });
};
