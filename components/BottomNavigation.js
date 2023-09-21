import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Chat, ChatBot, MedicalRegister } from "../screens";
import Icon from "react-native-vector-icons/FontAwesome"; // Import an icon library

const Tab = createBottomTabNavigator();

function BottomNavigation({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Đăng ký khám"
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
        name="Trợ lý AI"
        component={ChatBot}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="robot" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="comments" size={size} color={color} />
          ),
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
