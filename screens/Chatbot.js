import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import TypingIndicator from "../components/TypingIndicator";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import an icon library
import COLORS from "../constants/colors";

const ChatBot = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [botIsTyping, setBotIsTyping] = useState(false);

  const user = {
    _id: 1,
    name: "User",
  };

  const bot = {
    _id: 2,
    name: "Bot",
    avatar:
      "https://cdn.dribbble.com/userupload/2798813/file/original-a9da6aa3bf061621ab9d8c97a226a358.png",
  };

  useEffect(() => {
    // Initialize the chat with a welcome message
    setMessages([
      {
        _id: Math.round(Math.random() * 1000000),
        text: `Xin chào, tôi có thể giúp gì cho bạn?`,
        createdAt: new Date(),
        user: bot,
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    // Append the user's input message to the chat
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    // Extract the user's message text
    const userMessage = newMessages[0].text;

    // Make a request to your API to fetch the bot's response
    fetchReponse(userMessage);
  }, []);

  const fetchReponse = async (message) => {
    setBotIsTyping(true); // Set botIsTyping to true while fetching the response

    const response = await fetch(
      `http://192.168.1.105:8000/api/get/?msg=${message}`
    );
    const responseData = await response.json();
    const botResponse = responseData.message; // Adjust this based on your API response structure
    setBotIsTyping(false); // Set botIsTyping back to false when the response is received

    // Create a new message for the bot's response
    const newBotMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: botResponse,
      createdAt: new Date(),
      user: bot,
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [newBotMessage])
    );
  };

  const renderFooter = (props) => {
    return botIsTyping ? <TypingIndicator /> : null;
  };

  const ChatHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={"#FFFF"} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Trợ lý ảo</Text>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "#ffff", flex: 1 }}>
      <ChatHeader />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        renderFooter={renderFooter}
        shouldUpdateMessage={() => true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});

export default ChatBot;
