import AsyncStorage from "@react-native-async-storage/async-storage";

const UserReducer = async (currentState, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      return null;
  }
  return currentState;
};

export default UserReducer;
