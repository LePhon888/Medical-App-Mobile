import React, { useEffect, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./Login";
import Loading from "../components/Loading";
import { View } from "react-native";
import { getUserFromStorage } from "../utils/GetUserFromStorage";
import { useUser } from "../context/UserContext";

const MainScreen = () => {
    return <BottomNavigation />
};

export default MainScreen;
