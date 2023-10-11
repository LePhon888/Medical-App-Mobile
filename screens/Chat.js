import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import an icon library
import { GiftedChat } from "react-native-gifted-chat";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { FloatingAction } from "react-native-floating-action";
import ChatDialog from "../components/ChatDialog";
import { endpoints } from "../config/Apis";
import COLORS from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";

const Chat = () => {
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState(null);

  const getUserAndToken = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("user");
      const tokenInfo = await AsyncStorage.getItem("token");
      setUserInfo(JSON.parse(currentUser));
      setToken(tokenInfo);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (connected) {
      const initializeWebSocket = async () => {
        const socket = new SockJS(endpoints["websocket"]); // Replace with your WebSocket server URL
        const client = Stomp.over(socket);

        client.connect({}, () => {
          setStompClient(client);

          // Subscribe to a specific chat topic (e.g., /topic/chat)
          client.subscribe(`/topic/chat/${roomId}`, (message) => {
            const newMessage = JSON.parse(message.body);

            console.log("ListMessage", newMessage);
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [newMessage])
            );
          });
        });
      };

      initializeWebSocket();

      const newUser = {
        _id: Math.round(Math.random() * 1000000),
        name: userInfo.firstName,
        avatar: userInfo.image,
      };

      setUser(newUser);
    } else {
      return () => {
        if (stompClient) {
          stompClient.disconnect();
          setMessages([]);
        }
      };
    }

    if (!userInfo) getUserAndToken();
  }, [connected]);

  const onSend = useCallback(
    (newMessages = []) => {
      // Extract the user's message text
      const userMessage = newMessages[0].text;

      // Send the user's message to the WebSocket server with the room ID
      if (stompClient && roomId) {
        const message = {
          _id: Math.round(Math.random() * 1000000), // Generate a unique ID
          text: userMessage,
          createdAt: new Date(),
          user: user,
        };

        // Send the message to the specific room's WebSocket topic
        stompClient.send(`/app/send/${roomId}`, JSON.stringify(message));
        console.log("TEST9999", JSON.stringify(message));
      }
    },
    [stompClient, user, roomId]
  );
  const ChatHeader = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          {!connected ? (
            <Text style={styles.titleText}>Trò chuyện</Text>
          ) : (
            <>
              <TouchableOpacity onPress={() => setConnected(false)}>
                <Icon name="arrow-left" size={20} color={"#FFFF"} />
              </TouchableOpacity>
              <Text style={styles.titleText}>Phòng {roomId}</Text>
            </>
          )}
        </View>
        <View style={styles.empty}>
          <FeatherIcon color="#94A3B8" name="mail" size={36} />

          <Text style={styles.emptyTitle}>Không có trò chuyện nào</Text>

          <Text style={styles.emptyDescription}>Hãy bắt đầu</Text>

          <TouchableOpacity onPress={() => setConnected(false)}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Bắt đầu bằng cuộc hẹn</Text>

              <FeatherIcon
                color="#fff"
                name="message-circle"
                size={18}
                style={{ marginLeft: 12 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const actions = [
    {
      text: "Tạo phòng",
      icon: (
        <Image
          style={{ width: 40, height: 40 }}
          source={{
            uri: "https://www.iconsdb.com/icons/preview/white/plus-5-xxl.png",
          }}
        />
      ),
      name: "createMeeting",
      position: 1,
      buttonSize: 40,
      color: "#138de7",
    },
    {
      text: "Tham gia",
      icon: (
        <Image
          style={{ width: 40, height: 40 }}
          source={{
            uri: "https://www.iconsdb.com/icons/preview/white/arrow-28-xxl.png",
          }}
        />
      ),
      name: "joinMeeting",
      position: 2,
      buttonSize: 40,
      color: "#138de7",
    },
  ];

  const optionHandle = (name) => {
    console.log(name);
    switch (name) {
      case "joinMeeting":
        showDialog();
        break;

      default:
        setRoomId(Math.random().toString(16).slice(10));
        setConnected(true);
        break;
    }
  };

  const showDialog = () => {
    setVisible(true);
  };

  const closeDialog = () => {
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <ChatHeader />
      {connected && (
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={user}
        />
      )}

      {!connected && (
        <>
          <ChatDialog
            visible={visible}
            closeDialog={closeDialog}
            setRoomId={setRoomId}
            setJoin={() => {
              setVisible(false);
              setConnected(true);
            }}
          />
          <FloatingAction
            color="#0097cb"
            actions={actions}
            onPressItem={(name) => {
              optionHandle(name);
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  connectSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    borderRadius: 15,
    width: "60%",
    height: 45,
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    color: "black",
    paddingHorizontal: 10,
  },
  loginBtn: {
    width: "60%",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1877F2",
  },
  loginText: {
    color: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 26,
    paddingHorizontal: 16,
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  empty: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#878787",
    marginBottom: 24,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#2b64e3",
    borderColor: "#2b64e3",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
export default Chat;
