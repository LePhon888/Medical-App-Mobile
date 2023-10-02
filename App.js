import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { createContext, useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Welcome from "./screens/Welcome";
// import Login from "./screens/Login";
// import Signup from "./screens/Signup";
// import MainScreen from "./screens/MainScreen";
// import ChatBot from "./screens/Chatbot";
// import Home from "./screens/Home";
// import Setting from "./screens/Setting";

import {
  Login,
  Welcome,
  Signup,
  Home,
  ChatBot,
  Chat,
  MedicalRegister,
  MainScreen,
  Setting,
} from "./screens";
import DoctorAppointment from "./screens/DoctorAppointment";
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
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
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
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}