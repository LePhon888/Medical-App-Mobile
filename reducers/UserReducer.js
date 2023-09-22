const UserReducer = async (currentState, action) => {
  switch (action.type) {
    case "login":
      await AsyncStorage.setItem("token", action.payload.token);
      await AsyncStorage.setItem("user", JSON.stringify(action.payload.user));
      return action.payload;
    case "logout":
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      return null;
  }
  return currentState;
};

export default UserReducer;
