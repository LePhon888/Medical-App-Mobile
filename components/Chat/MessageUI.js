import moment from 'moment';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import InitSocket from './InitSocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { endpoints } from '../../config/Apis';
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiPicker from './EmojiPicker';
/**
 * The message ui component include the display list of message and input, button to send the message.
 * @param  isBotMode The flag use for indicating if the chat using response from bot.
 * @returns 
 */

const MessageUI = ({ isBotMode }) => {

    const [inputText, setInputText] = useState('');
    const [listMessage, setListMessage] = useState([]);
    const [message, setMessage] = useState(null)
    const [user, setUser] = useState(null)
    const [roomId, setRoomId] = useState('public')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

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

    const onMessageReceived = (message) => {
        setListMessage((previous) => [message, ...previous]);
    };

    const sendPayload = (payload) => {
        setMessage(payload)
    }

    const onBotMessageRecieved = async (message) => {
        const res = await Apis.get(`${endpoints["chatbot"]}?msg=${message}`)
        console.log(res.data)
        sendPayload({
            id: moment().valueOf(),
            text: res.data.message,
            fromUser: 123123,
            avatar: 'https://static.vecteezy.com/system/resources/previews/034/874/115/large_2x/ai-generated-doctor-medic-avatar-icon-clip-art-sticker-decoration-simple-background-free-photo.jpg',
            timestamp: moment(),
            isShowTimestamp: false,
        })
    }

    const sendOnClick = () => {
        if (!isInputTextEmpty()) {
            sendPayload({
                id: moment().valueOf(),
                text: inputText,
                fromUser: user.id,
                avatar: '',
                timestamp: moment(),
                isShowTimestamp: isShowTimestamp(moment())
            })
            if (isBotMode) {
                onBotMessageRecieved(inputText)
            }
            setInputText('');
        }
    };

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await AsyncStorage.getItem("user")
            setUser(JSON.parse(res))

            if (isBotMode) {
                setRoomId(`AI${res.id}`)
                // send welcome message if this is bot mode
                sendPayload({
                    id: moment().valueOf(),
                    text: 'Chào mừng bạn đến với hệ thống trò chuyện y tế của chúng tôi. Hãy đặt câu hỏi hoặc chia sẻ thông tin y tế của bạn để chúng tôi có thể hỗ trợ bạn tốt nhất.',
                    fromUser: 123123,
                    avatar: 'https://static.vecteezy.com/system/resources/previews/034/874/115/large_2x/ai-generated-doctor-medic-avatar-icon-clip-art-sticker-decoration-simple-background-free-photo.jpg',
                    timestamp: moment(),
                    isShowTimestamp: false,
                })
            }
        }
        getUserInfo()
    }, [])

    const renderMessageItem = ({ item }) => {
        return (
            <View>
                { /* Show timestamp of message */}
                {item.timestamp && item.isShowTimestamp && (
                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
                    </View>
                )}
                { /* If the message is from current user */
                    item.fromUser === user.id ? (
                        <View style={[styles.messageContentContainer, styles.fromUser]}>
                            <Text style={styles.messageText}>{item.text}</Text>
                        </View>
                    ) : ( /* ELse if the message is from other user */
                        <View style={styles.fromOtherContainer}>
                            <View style={[styles.messageContentContainer, styles.fromOther]}>
                                <Text style={styles.messageText}>{item.text}</Text>
                            </View>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.avatarImage}
                                    source={{ uri: item.avatar || `https://cdn-icons-png.flaticon.com/512/9131/9131529.png` }}
                                />
                            </View>
                        </View>
                    )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Init the websocket connection */}
            <InitSocket roomId={roomId} payload={message} onMessageReceived={onMessageReceived} />

            {/* View of messages list */}
            <FlatList
                style={styles.listMessage}
                data={listMessage}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessageItem}
                inverted
            />
            {/* View of input text and button send */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn"
                    value={inputText}
                    onChangeText={(text) => setInputText(text)}
                />
                {/* Emoji button */}
                <TouchableOpacity style={styles.emojiButton} onPress={toggleEmojiPicker}>
                    <MaterialCommunityIcons name="emoticon-happy-outline" size={20} color="#a5abb3" />
                </TouchableOpacity>
                {/* Send button */}
                <TouchableOpacity style={styles.sendButton} onPress={sendOnClick} disabled={!user || isInputTextEmpty()}>
                    <Icon name="send-outline" size={20} color={isInputTextEmpty() ? '#a5abb3' : '#52D3D8'} />
                </TouchableOpacity>
            </View>
            {showEmojiPicker && <EmojiPicker onEmojiSelected={onEmojiSelected} />}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    fromOtherContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    listMessage: {
        paddingHorizontal: 20,
    },
    imageContainer: {
        width: 27,
        height: 27,
    },
    avatarImage: {
        flex: 1,
        borderRadius: 20,
    },
    messageContentContainer: {
        maxWidth: '80%',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#ECE5DD',
        marginVertical: 7,
    },
    messageText: {
        color: '#5c5c5c',
        fontSize: 20
    },
    fromUser: {
        alignSelf: 'flex-end',
        backgroundColor: '#e2f2ff',
        borderBottomRightRadius: 0,
    },
    fromOther: {
        alignSelf: 'flex-start',
        backgroundColor: '#f8f9fd',
        marginLeft: 30,
        marginBottom: 5,
        borderBottomLeftRadius: 0,
    },
    messageText: {
        color: '#39393b',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 20,
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
        fontSize: 13,
    },
});

export default MessageUI;
