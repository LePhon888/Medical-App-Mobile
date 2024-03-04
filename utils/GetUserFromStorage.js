import AsyncStorage from "@react-native-async-storage/async-storage";
export const getUserFromStorage = async () => {
    try {
        const storedUser = await AsyncStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
};

