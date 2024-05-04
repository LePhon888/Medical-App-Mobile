import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import InitSocket from './InitSocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { endpoints } from '../../config/Apis';
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiPicker from './EmojiPicker';
import { useUser } from '../../context/UserContext';
import { data } from '../../config/data';
import TypingAnimation from '../TypingAnimation';
import Toast from 'react-native-toast-message';
import Header from '../../common/Header';
import Loading from '../Loading';
import COLORS from '../../constants/colors';
/**
 * The message ui component include the display list of message and input, button to send the message.
 * @param  isBotMode The flag use for indicating if the chat using response from bot.
 * @returns 
 */

const MessageUI = ({ isBotMode, setTitle }) => {

    const [inputText, setInputText] = useState('')
    const [listMessage, setListMessage] = useState([])
    const [message, setMessage] = useState(null)
    const { userId } = useUser()
    const [roomId, setRoomId] = useState('PUBLIC')
    const [socketConnected, setSocketConnected] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [loading, setLoading] = useState(false)
    const userDetail = useRef(null)
    const prevSender = useRef(null)

    const [remoteUser, setRemoteUser] = useState({
        userName: '',
        fromUser: 'AI',
        avatar: 'https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?size=626&ext=jpg&ga=GA1.1.34619204.1714543244&semt=sph',
        typing: false,
    })

    // const toggleEmojiPicker = () => {
    //     setShowEmojiPicker(!showEmojiPicker);
    // };

    const onEmojiSelected = (emoji) => {
        setInputText(inputText + emoji);
    };

    const isInputTextEmpty = () => {
        return inputText.trim().length === 0
    }
    const formatTimestamp = (timestamp) => {
        return moment(timestamp).format('HH:mm');
    };

    const isShowTimestamp = (timestamp) => {
        return !listMessage.some((message) =>
            formatTimestamp(message.timestamp) === formatTimestamp(timestamp) && message.isShowTimestamp
        );
    };

    const onMessageReceived = (payload) => {
        switch (payload.type) {
            case 'message':
                setListMessage((previous) => [{ ...payload, isBreak: (!prevSender.current || prevSender.current !== payload.fromUser) }, ...previous]);
                prevSender.current = payload.fromUser
                // Show the bot typing if current mode is bot mode
                if (isBotMode && payload.fromUser === userId) {
                    onBotMessageRecieved(payload.text)
                }
                break
            case 'typing':
                if (payload.fromUser !== userId) {
                    setRemoteUser(prev => ({
                        ...prev,
                        fromUser: payload.fromUser,
                        avatar: payload.avatar,
                        typing: payload.typing,
                        userName: payload.userName
                    }));
                }
                break
            case 'leaveRoom':
                if (payload.data.userId !== userId) {
                    Toast.show({ type: 'info', text1: `${payload.data.userName} vừa thoát khỏi phòng` })
                }
                break
            case 'joinRoom':
                if (payload.data.userId !== userId) {
                    Toast.show({ type: 'info', text1: `${payload.data.userName} vừa tham gia phòng` });
                }
                break
            default:
                break
        }
    };

    const sendPayload = (payload) => {
        setMessage(payload)
    }

    const sendMessage = (userId, avatar, text, isShowTimestamp) => {
        sendPayload({
            type: 'message',
            id: moment().valueOf(),
            text: text,
            isShowTimestamp: isShowTimestamp,
            fromUser: userId,
            avatar: avatar,
            timestamp: moment()
        })
    }

    const onBotMessageRecieved = async (message) => {
        try {
            setRemoteUser((prev) => ({ ...prev, typing: true }));
            const res = await Apis.get(`${endpoints["chatbot"]}/?msg=${message}`)
            sendMessage(
                remoteUser.fromUser,
                remoteUser.avatar,
                res.data.message,
                false)
        } catch (error) {
            console.error("onBotMessageRecieved", error)
        } finally {
            setRemoteUser((prev) => ({ ...prev, typing: false }));
        }

    }

    const onChangeInputText = (text) => {
        setInputText(text)
    }

    const sendOnClick = () => {
        if (!isInputTextEmpty()) {
            sendMessage(
                userId,
                userDetail.current.image,
                inputText,
                isShowTimestamp(moment())
            )
            setInputText('')
        }
    };

    useEffect(() => {
        sendPayload({
            type: 'typing',
            fromUser: userId,
            avatar: userDetail.current?.image,
            userName: `${userDetail.current?.name}`,
            typing: inputText.length > 0
        })
    }, [inputText])

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                setLoading(true)
                const res = await Apis.get(`${endpoints["user"]}/${userId}`)
                userDetail.current = { ...res.data, name: `${res.data.lastName} ${res.data.firstName}` }
            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        if (userId) {
            getUserInfo()
        }
    }, [userId])

    useEffect(() => {
        if (setTitle) {
            setTitle(roomId)
        }
    }, [roomId])

    useEffect(() => {

        if (!socketConnected && isBotMode) {
            setRoomId(`AI${userId}`)
        }

        if (isBotMode && socketConnected) {
            // send welcome message if this is bot mode
            sendMessage(
                remoteUser.fromUser,
                remoteUser.avatar,
                'Chào mừng bạn đến với hệ thống trò chuyện y tế của chúng tôi. Hãy đặt câu hỏi hoặc chia sẻ thông tin y tế của bạn để chúng tôi có thể hỗ trợ bạn tốt nhất.',
                false)
        }
    }, [socketConnected])

    const renderMessageItem = ({ item }) => {
        return (
            <View>
                { /* Show timestamp of message */}
                {/*item.timestamp && item.isShowTimestamp &&
                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
                    </View>
                */}
                { /* If the message is from current user */
                    item.fromUser === userId ?
                        <View>
                            {item.isBreak &&
                                <Text style={[styles.timestamp, { alignSelf: 'flex-end' }]}>{formatTimestamp(item.timestamp)}</Text>
                            }
                            <View style={[styles.messageContentContainer, styles.fromUser]}>
                                <Text style={styles.messageText}>{item.text}</Text>
                            </View>
                        </View>

                        :  /* ELse if the message is from other user */
                        <View>
                            {item.isBreak &&
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.remoteUserName}>{remoteUser.userName}</Text>
                                    <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                                </View>
                            }

                            <View style={styles.fromOtherContainer}>
                                <View style={[styles.imageContainer, { opacity: item.isBreak ? 1 : 0 }]}>
                                    <Image
                                        style={styles.avatarImage}
                                        source={{ uri: item.avatar || `https://cdn-icons-png.flaticon.com/512/9131/9131529.png` }}
                                    />
                                </View>
                                <View style={[styles.messageContentContainer, styles.fromOther]}>
                                    <Text style={styles.messageText}>{item.text}</Text>
                                </View>
                            </View>
                        </View>
                }
            </View>
        );
    };

    const onWebSocketConnected = (stompClient) => {
        if (!stompClient) {
            console.error('Connect to websocket failed')
            setSocketConnected(false)
        } else {
            setSocketConnected(true)
        }
    }

    return (
        <View style={styles.container}>
            {/* Init the websocket connection */}
            {!loading && userDetail.current &&
                <InitSocket
                    userId={userDetail.current.id}
                    userName={userDetail.current.name}
                    roomId={roomId}
                    sendMessage={message}
                    onMessageReceived={onMessageReceived}
                    onWebSocketConnected={(stompClient) => onWebSocketConnected(stompClient)} />
            }
            {/* View of messages list */}
            <FlatList
                style={styles.listMessage}
                data={listMessage}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessageItem}
                ListHeaderComponent={
                    remoteUser.typing &&
                    <View style={styles.fromOtherContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.avatarImage}
                                source={{ uri: remoteUser.avatar || `https://cdn-icons-png.flaticon.com/512/9131/9131529.png` }}
                            />
                        </View>
                        <View style={[styles.messageContentContainer, styles.fromOther]}>
                            <TypingAnimation />
                        </View>
                    </View>
                }
                inverted
            />
            {/* View of input text and button send */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn"
                    value={inputText}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(text) => onChangeInputText(text)}
                />
                {/* Emoji button */}
                {/* <TouchableOpacity style={styles.emojiButton} onPress={toggleEmojiPicker}>
                    <MaterialCommunityIcons name="emoticon-happy-outline" size={20} color="#a5abb3" />
                </TouchableOpacity> */}
                {/* Send button */}
                <TouchableOpacity style={styles.sendButton} onPress={sendOnClick} disabled={!userId || isInputTextEmpty()}>
                    <Icon name="send-outline" size={24} color={isInputTextEmpty() ? '#a5abb3' : '#52D3D8'} />
                </TouchableOpacity>
            </View>
            {showEmojiPicker && <EmojiPicker onEmojiSelected={onEmojiSelected} />}
            {loading && <Loading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    typingContainer: {

    },
    fromOtherContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    listMessage: {
        paddingHorizontal: 14,
    },
    imageContainer: {
        marginTop: 5,
        width: 32,
        height: 32,
    },
    avatarImage: {
        flex: 1,
        borderRadius: 20,
    },
    messageContentContainer: {
        maxWidth: '80%',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#ECE5DD',
        marginTop: 3,
        marginBottom: 2,
    },
    fromUser: {
        alignSelf: 'flex-end',
        backgroundColor: '#e2f2ff',

    },
    fromOther: {
        alignSelf: 'flex-start',
        backgroundColor: '#f8f9fd',
        marginLeft: 8,
    },
    messageText: {
        color: '#39393b',
        fontSize: 14,
        lineHeight: 22
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        padding: 10,

        borderRadius: 5,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    timestampContainer: {
        alignSelf: 'center',
        marginVertical: 10,
    },
    timestampText: {
        color: '#5c5c5c',
        fontWeight: 'bold',
        fontSize: 14,
    },
    timestamp: {
        color: '#5e5e5e',
        fontSize: 12
    },
    remoteUserName: {
        marginLeft: '12%',
        marginRight: 8,
        fontSize: 13,
        color: COLORS.textLabel
    }
});

export default MessageUI;
