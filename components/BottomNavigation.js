import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome"; // Import an icon library
import MedicalRegister from "../screens/MedicalRegister";
import Chat from "../screens/Chat";
import Home from "../screens/Home";
import Setting from "../screens/Setting";

const Tab = createBottomTabNavigator();

function BottomNavigation({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Nhà"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          tabBarPress: () => {
            navigation.navigate("Home");
          },
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Lịch khám "
        component={MedicalRegister}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-md" size={size} color={color} />
          ),
          tabBarPress: () => {
            navigation.navigate("MedicalRegister");
          },
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="comments" size={size} color={color} />
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
            <Icon name="cog" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
