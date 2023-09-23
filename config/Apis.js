// Import necessary libraries and modules

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER = "http://localhost:8080";
// const SERVER = "http://192.168.1.7:8080";

export const endpoints = {
  login: `${SERVER}/auth/login`,
  signup: `${SERVER}/auth/register`,
  currentUser: `${SERVER}/auth/current-user`,
};

// export const authApi = async () => {
//   const token = await AsyncStorage.getItem("token");

//   const instance = axios.create({
//     baseURL: SERVER,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return instance;
// };

export default axios.create({
  baseURL: SERVER,
});
