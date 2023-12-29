import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  // Login,
  Welcome,
  Signup,
  Home,
  ChatBot,
  Chat,
  MedicalRegister,
  MainScreen,
  Setting,
  AppointmentList,
  News,
  NewsDetail,
} from "./screens";

import DoctorAppointment from "./screens/DoctorAppointment";
import EditProfile from "./screens/EditProfile";
import Doctors from "./screens/Doctors";
import DoctorDetail from "./screens/DoctorDetail";
const Stack = createNativeStackNavigator();
export const UserContext = createContext();

export default function App() {
  const [user, dispatch] = useReducer(
    UserReducer,
    AsyncStorage.getItem("user") || null
  );

  return (
    <UserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="DoctorDetail">
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          /> */}
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ChatBot"
            component={ChatBot}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Setting"
            component={Setting}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MedicalRegister"
            component={MedicalRegister}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="DoctorAppointment"
            component={DoctorAppointment}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AppointmentList"
            component={AppointmentList}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="News"
            component={News}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NewsDetail"
            component={NewsDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Doctors"
            component={Doctors}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DoctorDetail"
            component={DoctorDetail}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}