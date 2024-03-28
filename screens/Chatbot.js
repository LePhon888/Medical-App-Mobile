import React from "react";
import { StyleSheet, View } from "react-native";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import MessageUI from "../components/Chat/MessageUI";

const ChatBot = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <HeaderWithBackButton title={"Chatbot AI"} navigation={navigation} />
      <MessageUI isBotMode={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
})
export default ChatBot;
