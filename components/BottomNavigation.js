import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";

import MedicalRegister from "../screens/MedicalRegister";
import Chatbot from "../screens/Chatbot";
import Home from "../screens/Home";
import News from "../screens/News";
import Setting from "../screens/Setting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DoctorAppointment from "../screens/DoctorAppointment";

const Tab = createBottomTabNavigator();

function BottomNavigation({ navigation }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUserInfo = async () => {
      const res = await AsyncStorage.getItem("user");
      setUser(JSON.parse(res));
    };
    getUserInfo();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
          paddingBottom: 4,
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderWidth: 0.3,
          borderColor: '#ccc',
          position: 'absolute',
          overflow: 'hidden',
        },
      }}
    >
      <Tab.Screen
        name="Nhà"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
          tabBarPress: () => {
            navigation.navigate("Home");
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bài viết"
        component={News}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" size={24} color={color} />
          ),
          tabBarPress: () => {
            navigation.navigate("News");
          },
          headerShown: false,
        }}
      />
      {user && user.userRole === "ROLE_DOCTOR" ? (
        <Tab.Screen
          name="Lịch hẹn "
          component={DoctorAppointment}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="team" size={24} color={color} />
            ),
            tabBarPress: () => {
              navigation.navigate("DoctorAppointment");
            },
            headerShown: false,
          }}
        />
      ) : (
        <Tab.Screen
          name="Lịch hẹn "
          component={MedicalRegister}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="team" size={24} color={color} />
            ),
            tabBarPress: () => {
              navigation.navigate("MedicalRegister");
            },
            headerShown: false,
          }}
        />
      )}

      <Tab.Screen
        name="Chat"
        component={Chatbot}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="message1" size={24} color={color} />
          ),
          tabBarPress: () => {
            navigation.navigate("Chat");
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cài đặt"
        component={Setting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigation;