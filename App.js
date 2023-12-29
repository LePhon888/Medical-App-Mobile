import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
        <Stack.Navigator initialRouteName="VideoHome">
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
          <Stack.Screen
            name="VideoHome"
            component={VideoHome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Call"
            component={Call}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
function HomePage(props) {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Button title="Call" onPress={() => { navigation.navigate('CallPage') }} />
    </View>
  )
}

import ZegoUIKitPrebuiltCall, { GROUP_VOICE_CALL_CONFIG, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import Call from "./screens/Call";
import VideoHome from "./screens/VideoHome";

function CallPage(props) {
  let randomUserID = String(Math.floor(Math.random() * 100000));

  return (
    <View style={{ flex: 1 }}>
      <ZegoUIKitPrebuiltCall
        appID={1208546669}
        appSign='e58bf8cf2ecfb64064dac777c83fe2f7e6241dbacf03e068848fecbf639c200e'
        userID={randomUserID}
        userName={'user_' + randomUserID}
        callID='testCallID'

        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onHangUp: () => { props.navigation.navigate('HomePage') },
        }}
      />
    </View>
  );
}
