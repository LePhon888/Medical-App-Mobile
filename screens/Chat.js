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
import ChatDialog from '../components/Chat/ChatDialog';
import { endpoints } from '../config/Apis';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";
import ChatIntroduction from "../components/Chat/ChatIntroduction";
import Header from "../common/Header";

import MessageUI from "../components/Chat/MessageUI";
import HeaderWithBackButton from "../common/HeaderWithBackButton";

const Chat = ({ route }) => {
  const { roomId } = route?.params || ''
  return (
    <View style={styles.container}>
      <HeaderWithBackButton title={`Phòng ${roomId}`} />
      <MessageUI isBotMode={false} room={roomId} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default Chat;
