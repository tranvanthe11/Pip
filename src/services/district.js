import axios from "axios";

export const getDistrictByProvinces = (province_id = 1, callback) => {
  axios
    .get(`${process.env.REACT_APP_API}/district/province/${province_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        callback(err.response.data);
      }
    });
};
