import AsyncStorage from "@react-native-async-storage/async-storage";

const UserReducer = async (currentState, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      const u = await AsyncStorage.getItem("user");
      if (u.provider === "GOOGLE") await GoogleSignin.signOut();
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      return null;
    case 'update':
      return {
        ...currentState,
        ...action.payload,
      };
  }
  return currentState;
};

export default UserReducer;
