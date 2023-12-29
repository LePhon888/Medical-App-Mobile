// Import necessary libraries and modules

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const SERVER = "http://localhost:8080";

const SERVER = "http://192.168.1.12:8080";
const CHATBOT = "http://192.168.1.12:8000";

export const endpoints = {
  login: `${SERVER}/auth/login`,
  signup: `${SERVER}/auth/register`,
  currentUser: `${SERVER}/auth/current-user`,
  hours: `${SERVER}/api/hours`,
  doctors: `${SERVER}/api/doctors/department`,
  departments: `${SERVER}/api/departments`,
  appointment: `${SERVER}/api/appointment`,
  payment: `${SERVER}/api/payment/create-payment`,
  user: `${SERVER}/api/user`,
  websocket: `${SERVER}/ws`,
  news: `${SERVER}/api/scrape`,
  googleLogin: `${SERVER}/login-google/auth-google`,
  chatbot: `${CHATBOT}/api/get/`,
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