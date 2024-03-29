import axios from "axios";

export const AxiosConfig = () => {
  const token = localStorage.getItem(
    `${process.env.REACT_APP_PREFIX_LOCAL}_access_token`
  );
  // console.log('t', token);
  const instance = axios.create({
    baseURL: `${process.env.REACT_APP_API}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return instance;
};
