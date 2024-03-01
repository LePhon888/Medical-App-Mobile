import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Login, Welcome, Signup, Home, ChatBot, Chat, MedicalRegister, MainScreen, Setting,
  AppointmentList, News, NewsDetail, Call, VideoHome, AppointmentRegister, Category,
  Notification, MedicineList, Status, JoinScreen, IncomingCallScreen, OutgoingCallScreen, VideoConferencePage
} from "./screens";

import DoctorAppointment from "./screens/DoctorAppointment";
import EditProfile from "./screens/EditProfile";
import Doctors from "./screens/Doctors";
import DoctorDetail from "./screens/DoctorDetail";
import MedicationBox from "./screens/MedicationSchedule/MedicationBox";
import AddMedicine from "./screens/MedicationSchedule/AddMedicine";
import ScheduleTime from "./screens/MedicationSchedule/ScheduleTime";
import MedicationSchedule from "./screens/MedicationSchedule/MedicationSchedule";
import ToastConfig from "./config/Toast";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();
export const UserContext = createContext();

export default function App() {
  const [user, dispatch] = useReducer(
    UserReducer,
    AsyncStorage.getItem("user") || null
  );

  const initScreen = 'MedicationBox'

  return (
    <UserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initScreen}>
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChatBot" component={ChatBot} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
          <Stack.Screen name="MedicalRegister" component={MedicalRegister} options={{ headerShown: false }} />
          <Stack.Screen name="DoctorAppointment" component={DoctorAppointment} options={{ headerShown: false }} />
          <Stack.Screen name="AppointmentList" component={AppointmentList} options={{ headerShown: false }} />
          <Stack.Screen name="AppointmentRegister" component={AppointmentRegister} options={{ headerShown: false }} />
          <Stack.Screen name="News" component={News} options={{ headerShown: false }} />
          <Stack.Screen name="NewsDetail" component={NewsDetail} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="Doctors" component={Doctors} options={{ headerShown: false }} />
          <Stack.Screen name="DoctorDetail" component={DoctorDetail} options={{ headerShown: false }} />
          <Stack.Screen name="VideoHome" component={VideoHome} options={{ headerShown: false }} />
          <Stack.Screen name="Call" component={Call} options={{ headerShown: false }} />
          <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
          <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
          <Stack.Screen name="MedicineList" component={MedicineList} options={{ headerShown: false }} />
          <Stack.Screen name="MedicationBox" component={MedicationBox} options={{ headerShown: false }} />
          <Stack.Screen name="AddMedicine" component={AddMedicine} options={{ headerShown: false }} />
          <Stack.Screen name="MedicationSchedule" component={MedicationSchedule} options={{ headerShown: false }} />
          <Stack.Screen name="ScheduleTime" component={ScheduleTime} options={{ headerShown: false }} />
          <Stack.Screen name="Status" component={Status} options={{ headerShown: false }} />
          <Stack.Screen name="JoinScreen" component={JoinScreen} options={{ headerShown: false }} />
          <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OutgoingCallScreen" component={OutgoingCallScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VideoConferencePage" component={VideoConferencePage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
