import axios from "axios";
import { getToken } from "./auth";

export function getAirportDetail(airport_id, callback) {
  axios
    .get(`${process.env.REACT_APP_API}/airport/detail/${airport_id}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 403) {
          getToken(() => getAirportDetail(airport_id, callback));
        } else {
          callback(err.response.data);
        }
      }
    });
}
