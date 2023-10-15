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
import { GiftedChat } from 'react-native-gifted-chat';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { FloatingAction } from 'react-native-floating-action';
import ChatDialog from '../components/ChatDialog';
import { endpoints } from '../config/Apis';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";
import ChatIntroduction from "../components/ChatIntroduction";

const Chat = () => {
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userInfo, setUsetInfo] = useState(null)
  const [user, setUser] = useState(null);


  const getUserAndToken = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("user");
      const tokenInfo = await AsyncStorage.getItem("token");
      const parsedUser = JSON.parse(userInfo);
      setUsetInfo(parsedUser);
      if (parsedUser) {
        console.log(parsedUser)
        const newUser = {
          _id: Math.round(Math.random() * 1000000),
          name: parsedUser.firstName,
          avatar: parsedUser.image ? parsedUser.image : ""
        };
        console.log(newUser)
        setUser(newUser);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAndToken();
  }, [])

  useEffect(() => {
    if (connected) {

      const initializeWebSocket = async () => {
        const socket = new SockJS(endpoints["websocket"]);
        const client = Stomp.over(socket);

        client.connect({ roomId: roomId, username: user.name }, () => {

          // Send a join message to the room
          const joinMessage = {
            _id: Math.round(Math.random() * 1000000),
            text: user.name + " đã tham gia phòng.",
            system: true,
          };

          client.send(`/app/send/${roomId}`, JSON.stringify(joinMessage));

          // Subscribe to the chat room
          client.subscribe(`/topic/chat/${roomId}`, (message) => {
            const newMessage = JSON.parse(message.body);

            console.log("ListMessage", newMessage);
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [newMessage])
            );
          });

          setStompClient(client)

        });

      };

      initializeWebSocket();

    } else {
      return () => {
        if (stompClient) {
          stompClient.disconnect();
          setMessages([]);
        }
      };
    }

  }, [connected]);

  const onSend = useCallback(
    (newMessages = []) => {
      const userMessage = newMessages[0].text;


      if (stompClient && roomId) {
        const message = {
          _id: Math.round(Math.random() * 1000000),
          text: userMessage,
          createdAt: new Date(),
          user: user,
        };


        stompClient.send(`/app/send/${roomId}`, JSON.stringify(message));
        console.log("TEST9999", JSON.stringify(message));
      }
    },
    [stompClient, user, roomId]
  );

  const handleLeaveAction = () => {

    if (stompClient) {
      const leaveMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: user.name + " đã rời khỏi phòng.",
        system: true,
      };

      stompClient.send(`/app/send/${roomId}`, JSON.stringify(leaveMessage));
    }

    setConnected(false)
  }
  const ChatHeader = () => {
    return (
      <View style={styles.header}>
        {!connected ? (
          <Text style={styles.titleText}>Trò chuyện</Text>
        ) : (
          <>
            <TouchableOpacity onPress={() => handleLeaveAction()}>
              <Icon name="arrow-left" size={20} color={"#FFFF"} />
            </TouchableOpacity>
            <Text style={styles.titleText}>Phòng {roomId}</Text>
          </>
        )}
      </View>
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
          <ChatIntroduction />
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
            actions={actions}
            onPressItem={(name) => {
              optionHandle(name);
            }}
            floatingIcon={{
              uri: "https://play-lh.googleusercontent.com/64pIxivSTmdI8ngZc8sQESkXKCgqS2bQTGG_29dx052T0Re3csxpKUP0_gMgOErOmUg",
            }}
            iconHeight={60}
            iconWidth={60}
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
    paddingVertical: 10,
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
