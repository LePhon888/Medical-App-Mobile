import axios from "axios";

const SERVER_CONTEXT = "/Clinic";
const SERVER = "http://localhost:8080";

export const endpoints = {
  login: `${SERVER_CONTEXT}/api/login/`,
};

export const authApi = () => {
  return axios.create({
    baseURL: SERVER,
    headers: {
      Authorization: "Bearer " + AsyncStorage.getItem("token"),
    },
  });
};

export default axios.create({
  baseURL: SERVER,
});
