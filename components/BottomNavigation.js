import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome"; // Import an icon library
import MedicalRegister from "../screens/MedicalRegister";
import Chat from "../screens/Chat";
import Home from "../screens/Home";

const Tab = createBottomTabNavigator();

function BottomNavigation({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 15,
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 60
        }
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
        }}
      />
      <Tab.Screen
        name="Cài đặt"
        component={MedicalRegister}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
