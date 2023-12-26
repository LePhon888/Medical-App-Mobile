import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";

import MedicalRegister from "../screens/MedicalRegister";
import Chat from "../screens/Chat";
import Home from "../screens/Home";
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
          fontSize: 10,
          fontWeight: "600",
          marginBottom: 5
        },
        tabBarStyle: {
          height: 52,
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
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" size={24} color={color} />
          ),
          tabBarPress: () => {
            navigation.navigate("Home");
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
        component={Chat}
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