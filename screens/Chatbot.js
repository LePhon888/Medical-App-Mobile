import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import TypingIndicator from "../components/TypingIndicator";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import an icon library
import COLORS from "../constants/colors";
import { endpoints } from "../config/Apis";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import MessageUI from "../components/Chat/MessageUI";

const ChatBot = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <HeaderWithBackButton title={"Chat AI"} navigation={navigation} />
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
