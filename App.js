import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, CardStyleInterpolators } from "@react-navigation/native-stack";
import React, { createContext, useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Login, Welcome, Signup, Home, ChatBot, Chat, MainScreen, Setting,
  AppointmentList, News, NewsDetail, Call, VideoHome, AppointmentRegister, Category,
  Notification, MedicineList, Status, JoinScreen, IncomingCallScreen, OutgoingCallScreen, VideoConferencePage,
  Weight, WeightHistory, SyntheticNews, SyntheticNewsDetail, SavedNews, HealthChild, SelectChild
} from "./screens";

import DoctorAppointment from "./screens/DoctorAppointment";
import EditProfile from "./screens/EditProfile";
import Doctors from "./screens/Doctors";
import DoctorDetail from "./screens/DoctorDetail";
import MedicationBox from "./screens/MedicationSchedule/MedicationBox";
import AddMedicine from "./screens/MedicationSchedule/AddMedicine";
import ScheduleTime from "./screens/MedicationSchedule/ScheduleTime";
import MedicationSchedule from "./screens/MedicationSchedule/MedicationSchedule";
import { useEffect } from "react";
import NotificationFCM from "./components/NotificationFCM";
import { getUserFromStorage } from "./utils/GetUserFromStorage";
import { UserProvider } from "./context/UserContext";
import ToastConfig from "./components/ToastConfig";
import { NotificationProvider } from "./context/NotificationContext";
import { navigationRef } from "./utils/GlobalNavigation";
import HistoryMedication from "./screens/MedicationSchedule/HistoryMedication";
import VideoChat from "./screens/VideoChat";
import Apis, { endpoints } from "./config/Apis";
import { Cache } from "react-native-cache";
import optionCache from "./utils/optionCache";
import { DoctorRatingProvider } from "./context/DoctorRatingContext";
import AddGroupMedicine from "./screens/MedicationSchedule/AddGroupMedicine";
import ForgotPassword from "./screens/ForgotPassword";
import DoctorOffDutyScheduleList from "./screens/DoctorOffDutyScheduleList";
import DoctorCreateOffDutySchedule from "./screens/DoctorCreateOffDutySchedule";

const Stack = createNativeStackNavigator();
export const UserContext = createContext();

export default function App({ navigation }) {
  const cache = new Cache(optionCache);
  const [user, dispatch] = useReducer(UserReducer, null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await getUserFromStorage();
        dispatch({ type: 'login', payload: storedUser ? storedUser : null });
      } catch (error) {
        console.error('Error retrieving user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Apis.get(endpoints.medicineList)
        await cache.set("medicineList", res.data);
        const resNews = await Apis.get(endpoints.news)
        await cache.set("news", resNews.data);
      } catch (error) {
        console.error("Error fetching medicine list:", error);
      }
    };
    fetchData();
  }, [])



  const initScreen = 'Login'

  return (
    <DoctorRatingProvider>
      <NotificationProvider>
        <UserProvider>
          <UserContext.Provider value={[user, dispatch]}>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator initialRouteName={initScreen}>
                <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Chatbot" component={ChatBot} options={{ headerShown: false }} />
                <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
                <Stack.Screen name="DoctorAppointment" component={DoctorAppointment} options={{ headerShown: false }} />
                <Stack.Screen name="AppointmentList" component={AppointmentList} options={{ headerShown: false }} />
                <Stack.Screen name="AppointmentRegister" component={AppointmentRegister} options={{ headerShown: false }} />
                <Stack.Screen name="News" component={News} options={{ headerShown: false }} />
                <Stack.Screen name="NewsDetail" component={NewsDetail} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
                <Stack.Screen name="Doctors" component={Doctors} options={{ headerShown: false }} />
                <Stack.Screen name="DoctorDetail" component={DoctorDetail} options={{ headerShown: false }} />
                <Stack.Screen name="VideoChat" component={VideoChat} options={{ headerShown: false }} />
                <Stack.Screen name="VideoHome" component={VideoHome} options={{ headerShown: false }} />
                <Stack.Screen name="Call" component={Call} options={{ headerShown: false }} />
                <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
                <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
                <Stack.Screen name="MedicineList" component={MedicineList} options={{ headerShown: false }} />
                <Stack.Screen name="MedicationBox" component={MedicationBox} options={{ headerShown: false }} />
                <Stack.Screen name="AddMedicine" component={AddMedicine} options={{ headerShown: false }} />
                <Stack.Screen name="AddGroupMedicine" component={AddGroupMedicine} options={{ headerShown: false }} />
                <Stack.Screen name="HistoryMedication" component={HistoryMedication} options={{ headerShown: false }} />
                <Stack.Screen name="MedicationSchedule" component={MedicationSchedule} options={{ headerShown: false }} />
                <Stack.Screen name="ScheduleTime" component={ScheduleTime} options={{ headerShown: false }} />
                <Stack.Screen name="Status" component={Status} options={{ headerShown: false }} />
                <Stack.Screen name="JoinScreen" component={JoinScreen} options={{ headerShown: false }} />
                <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OutgoingCallScreen" component={OutgoingCallScreen} options={{ headerShown: false }} />
                <Stack.Screen name="VideoConferencePage" component={VideoConferencePage} options={{ headerShown: false }} />
                <Stack.Screen name="Weight" component={Weight} options={{ headerShown: false }} />
                <Stack.Screen name="WeightHistory" component={WeightHistory} options={{ headerShown: false }} />
                <Stack.Screen name="SyntheticNews" component={SyntheticNews} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                <Stack.Screen name="SyntheticNewsDetail" component={SyntheticNewsDetail} options={{ headerShown: false }} />
                <Stack.Screen name="SavedNews" component={SavedNews} options={{ headerShown: false }} />
                <Stack.Screen name="HealthChild" component={HealthChild} options={{ headerShown: false }} />
                <Stack.Screen name="SelectChild" component={SelectChild} options={{ headerShown: false }} />
                <Stack.Screen name="DoctorOffDutyScheduleList" component={DoctorOffDutyScheduleList} options={{ headerShown: false }} />
                <Stack.Screen name="DoctorCreateOffDutySchedule" component={DoctorCreateOffDutySchedule} options={{ headerShown: false }} />
              </Stack.Navigator>
            </NavigationContainer>
            <ToastConfig />
            <NotificationFCM />
          </UserContext.Provider>
        </UserProvider>
      </NotificationProvider>
    </DoctorRatingProvider>
  );
}
