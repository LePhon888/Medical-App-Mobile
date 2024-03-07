// Import necessary libraries and modules

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const SERVER = "http://localhost:8080";

const SERVER = "http://192.168.1.14:8080";
const CHATBOT = "http://192.168.1.14:8000";
//const SERVER = "http://medicalapp.com";

export const endpoints = {
  login: `${SERVER}/auth/login`,
  signup: `${SERVER}/auth/register`,
  currentUser: `${SERVER}/auth/current-user`,
  hours: `${SERVER}/api/hours`,
  doctors: `${SERVER}/api/doctors`,
  doctorDetail: `${SERVER}/api/doctor-detail`,
  rating: `${SERVER}/api/rating`,  // doctors: `${SERVER}/api/doctors/department`,
  departments: `${SERVER}/api/departments`,
  appointment: `${SERVER}/api/appointment`,
  payment: `${SERVER}/api/payment/create-payment`,
  user: `${SERVER}/api/user`,
  websocket: `${SERVER}/ws`,
  news: `${SERVER}/api/post`,
  googleLogin: `${SERVER}/login-google/auth-google`,
  chatbot: `${CHATBOT}/api/get/`,
  medicine: `${SERVER}/api/medicine`,
  medicineUnit: `${SERVER}/api/medicine-unit`,
  medicationSchedule: `${SERVER}/api/medication-schedule`,
  scheduleTime: `${SERVER}/api/schedule-time`,
  scheduleTimeDetail: `${SERVER}/api/schedule-time-detail`,
  category: `${SERVER}/api/category`,
  postBycategory: `${SERVER}/api/post/`,
  userDevice: `${SERVER}/api/user-device`,
  notification: `${SERVER}/api/notification`
};

// export const authApi = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const instance = axios.create({
//       baseURL: SERVER,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return instance;
//   } catch (error) {
//     console.error('Error getting token:', error);
//     throw error;
//   }
// };

const Apis = axios.create({
  baseURL: SERVER,
});

// Add an interceptor to set the Authorization header before each request is sent
// Apis.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       console.log('ApisToken', token)
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.error('Error getting token:', error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default Apis;
