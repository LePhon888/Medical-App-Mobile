// VideoChat.js

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Modal, Image } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices } from 'react-native-webrtc';
import InitSocket from '../components/Chat/InitSocket';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Loading from '../components/Loading';
import BottomSheet from '../components/BottomSheet';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import ToastConfig from '../components/ToastConfig';
import { text } from '@fortawesome/fontawesome-svg-core';
import { CommonActions } from '@react-navigation/native';
import COLORS from '../constants/colors';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import * as GlobalNavigation from '../utils/GlobalNavigation'
import { PanResponder } from 'react-native';

const VideoChat = ({ navigation, route }) => {

    const [message, setMessage] = useState(null)
    const [isShowButtons, setShowButtons] = useState(true)
    const [isFrontCamera, setFrontCamera] = useState(true)
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)

    const [stompClient, setStompClient] = useState(null)
    const makingOffer = useRef(false)
    const ignoreOffer = useRef(false)
    const polite = useRef(true)
    const videoCallConnected = useRef(false)
    const socketDisconnected = useRef(false)
    const remoteCandidates = useRef([])
    const peerConnection = useRef(null)
    const broadCaster = useRef(true)
    const doneOffer = useRef(false)
    const { params } = route;
    const { roomId, userId, userName, userImage, device } = params

    const [localDevice, setLocalDevice] = useState({
        userId: userId,
        userName: userName,
        userImage: userImage,
        ...device
    })

    const [remoteDevice, setRemoteDevice] = useState({
        userId: '',
        userName: '',
        userImage: '',
        camera: true,
        audio: true,
        grantedAudio: true,
        grantedCamera: true
    })

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: "stun:stun.relay.metered.ca:80" },
            { urls: "turn:asia-east.relay.metered.ca:80", "username": "b53f27633883eac1523a1f09", "credential": "kUmedgnWMTl01F6F" },
            { urls: "turn:asia-east.relay.metered.ca:80?transport=tcp", "username": "b53f27633883eac1523a1f09", "credential": "kUmedgnWMTl01F6F" },
            { urls: "turn:asia-east.relay.metered.ca:443", "username": "b53f27633883eac1523a1f09", "credential": "kUmedgnWMTl01F6F" },
            { urls: "turns:asia-east.relay.metered.ca:443?transport=tcp", "username": "b53f27633883eac1523a1f09", "credential": "kUmedgnWMTl01F6F" }
        ]
    };

    const sendMessage = (message) => {
        setMessage(message)
    };

    const showButton = () => {
        setShowButtons(!isShowButtons)
    }

    const initializeWebRTC = async () => {
        try {
            peerConnection.current = createPeerConnection();
            const stream = await mediaDevices.getUserMedia({ audio: localDevice.grantedAudio, video: localDevice.grantedCamera });
            stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
            setLocalStream(stream);
        } catch (error) {
            //console.error('initializeWebRTC', error)
        }
    };


    useEffect(() => {
        initializeWebRTC()

        return () => {
            if (peerConnection.current) {
                peerConnection.current.close()
            }
            remoteCandidates.current = [];
            peerConnection.current = null;
            localStream && localStream.getTracks().forEach((track) => track.stop());
        };

    }, []);

    useEffect(() => {
        if (videoCallConnected.current) {
            sendDeviceInfo()
        }
    }, [localDevice])


    useEffect(() => {
        if (stompClient && localStream && !doneOffer.current) {
            sendMessage({ destination: `/app/ready-offer/${roomId}`, data: localDevice });
            doneOffer.current = true
        }
    }, [localStream, stompClient]);


    const createPeerConnection = () => {
        const pc = new RTCPeerConnection(configuration);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage({
                    type: 'candidate',
                    candidate: event.candidate
                });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0])
        }

        pc.onsignalingstatechange = () => {
            console.log('pc.signalingState', pc.signalingState)
        }

        pc.onicecandidateerror = (event) => {
            console.error(event)
        };

        pc.oniceconnectionstatechange = (event) => {
            console.log('ICE connection state: ', pc.iceConnectionState);
            switch (pc.iceConnectionState) {
                case 'connected':
                    // Ensure videoCallConnected.current is properly initialized and updated elsewhere
                    videoCallConnected.current = true;
                    // If video call is connected, send device info
                    sendDeviceInfo();
                    break;
                case 'disconnected':
                    handleLeaveRoom();
                    break
                case 'failed':
                    pc.restartIce();
                    remoteCandidates.current = []
                    break;
                case 'closed':
                    pc.restartIce();
                    remoteCandidates.current = []
                    break
                default:
                    console.log('ICE connection state: ' + pc.iceConnectionState);
                    break;
            }
        };


        console.log('PeerConnection created');
        return pc;
    };

    const sendDeviceInfo = () => {
        sendMessage({ type: 'userDevice', deviceInfo: localDevice })
    }

    const sendOffer = async () => {
        let sessionConstraints = {
            mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true,
                VoiceActivityDetection: true
            }
        };

        try {
            makingOffer.current = true
            const offerDescription = await peerConnection.current.createOffer(sessionConstraints);
            await peerConnection.current.setLocalDescription(offerDescription);
            sendMessage({ type: offerDescription.type, sdp: offerDescription.sdp }
            );
        } catch (error) {
            console.log('Send offer error:', error);
        } finally {
            makingOffer.current = false
        }
    };

    const processCandidates = () => {
        if (remoteCandidates.current.length < 1) {
            return;
        }
        remoteCandidates.current.forEach(candidate => peerConnection.current.addIceCandidate(candidate));
        remoteCandidates.current.length = 0; // Clear the array
    };

    const handleRemoteCandidate = (candidate) => {
        if (peerConnection.current.remoteDescription === null) {
            remoteCandidates.current.push(candidate);
        } else {
            peerConnection.current.addIceCandidate(candidate);
        }
    };

    const leaveCall = () => {
        socketDisconnected.current = true

        // Close the peer connection if it exists
        if (peerConnection && peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        // Stop tracks and clear local stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        navigation.navigate('VideoHome', { deviceInfo: localDevice })
    };

    const handleLeaveRoom = async () => {
        // Close the peer connection if it exists

        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        // Stop tracks and clear local stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        // Clear the remote stream
        setRemoteStream(null);

        // Reset state variables
        broadCaster.current = true;
        polite.current = true;
        videoCallConnected.current = false;
        remoteCandidates.current = []

        // Reinitialize WebRTC for a new connection
        await initializeWebRTC();
    };



    const onMessageReceived = async (message) => {
        try {

            if (socketDisconnected.current) {
                return;
            }

            if (message.type) {
                const offerCollision = message.type === 'offer' && (makingOffer.current || peerConnection.current.signalingState !== 'stable');
                ignoreOffer.current = !polite.current && offerCollision;
                if (ignoreOffer.current) {
                    return;
                }

                switch (message.type) {
                    case 'offer':
                        const offerDescription = new RTCSessionDescription(message);
                        await peerConnection.current.setRemoteDescription(offerDescription);
                        const answerDescription = await peerConnection.current.createAnswer();
                        await peerConnection.current.setLocalDescription(answerDescription);
                        processCandidates();
                        sendMessage({ type: answerDescription.type, sdp: answerDescription.sdp });
                        break;
                    case 'answer':
                        await peerConnection.current.setRemoteDescription(message);
                        break;
                    case 'candidate':
                        console.log('Received ICE candidate:', message.candidate);
                        handleRemoteCandidate(message.candidate);
                        break;
                    case 'leaveRoom':
                        if (message.data.userId !== userId) {
                            Toast.show({ type: 'info', text1: `${message.data.userName} vừa thoát khỏi phòng` });
                            handleLeaveRoom()
                        }
                        break
                    case 'joinRoom':
                        if (message.data.userId !== userId) {
                            Toast.show({ type: 'info', text1: `${message.data.userName} vừa tham gia phòng` });
                        }
                        break
                    case 'userOffer':
                        console.log('userOffer', message);
                        if (message.data.userId === userId) {
                            broadCaster.current = false
                            polite.current = false;
                            await sendOffer()
                        }
                        break
                    case 'userDevice':
                        if (message.deviceInfo.userId !== userId) {
                            setRemoteDevice(message.deviceInfo)
                        }
                        break
                    default:
                        console.log('Unexpected message type:', message.type);
                        break;
                }
            }
        } catch (error) {

        }
    }

    const toggleCamera = async () => {
        try {

            console.log(localDevice)

            if (!localDevice.grantedCamera) {
                return;
            }

            localStream.getVideoTracks().forEach(track => {
                track.enabled = !localDevice.camera;
            });

            setLocalDevice(prev => ({ ...prev, camera: !localDevice.camera }));
        } catch (err) {

        }
    }

    const toggleAudio = async () => {
        try {

            if (!localDevice.grantedAudio) {
                return;
            }

            setLocalDevice(prev => ({ ...prev, audio: !localDevice.audio }));

            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });

        } catch (err) {
            // Handle Error
            console.log('Error toggling audio:', err);
        }
    };


    const toggleFlipCamera = async () => {
        try {
            const videoTrack = await localStream.getVideoTracks()[0];
            videoTrack._switchCamera();
            setFrontCamera(!isFrontCamera)
        } catch (err) {
            // Handle Error
        };
    }

    const onWebSocketConnected = (stompClient) => {
        if (!stompClient) {
            Toast.show({
                type: 'error',
                text1: "Lỗi kết nối, vui lòng thử lại sau!",
                onPress: () => Toast.hide(),
                visibilityTime: 5000
            })
        }
        setStompClient(stompClient)
    }

    return (
        <TouchableWithoutFeedback onPress={() => showButton()}>
            <View style={styles.screen}>
                <InitSocket
                    userId={userId}
                    userName={userName}
                    roomId={roomId}
                    sendMessage={message}
                    onMessageReceived={onMessageReceived}
                    videoChat={true}
                    disconnected={socketDisconnected.current}
                    onWebSocketConnected={(stompClient) => onWebSocketConnected(stompClient)} />

                {isShowButtons &&
                    <TouchableOpacity
                        style={{ ...styles.topContainer, opacity: isShowButtons ? 1 : 0 }}
                        activeOpacity={1}
                        onPress={() => showButton()}>
                        <View style={styles.header}>
                            <Text style={styles.roomName}>{`Phòng ${roomId}`}</Text>
                        </View>
                    </TouchableOpacity>
                }


                <View style={[styles.videoContainer, isShowButtons && { marginHorizontal: 24, marginVertical: 16 }]}>

                    {remoteStream &&
                        <View style={styles.remoteVideo}>
                            {remoteDevice.camera && remoteDevice.grantedCamera ?
                                <RTCView
                                    streamURL={remoteStream.toURL()}
                                    style={{ flex: 1 }}
                                    objectFit='cover'
                                    zOrder={0}
                                /> :
                                <View style={styles.imageHolderContainer}>
                                    <Image
                                        style={styles.imageHolder}
                                        source={{ uri: remoteDevice.userImage }}
                                    />
                                </View>
                            }
                            <Text style={styles.userName}>{remoteDevice.userName}</Text>
                            {!remoteDevice.audio && <MaterialCommunityIcons name={'microphone-off'} style={styles.microphoneOffIcon} />}
                        </View>
                    }

                    {localStream &&
                        <View style={!remoteStream ? { flex: 1 }
                            : [styles.localVideo]}>
                            {localDevice.camera && localDevice.grantedCamera ?
                                <RTCView
                                    streamURL={localStream.toURL()}
                                    style={{ flex: 1, backgroundColor: 'red' }}
                                    objectFit='cover'
                                    zOrder={1}
                                />
                                :
                                <View style={[styles.imageHolderContainer, remoteStream && { backgroundColor: '#2A2A2A' }]}>
                                    <Image
                                        style={[styles.imageHolder, remoteStream && { width: 75, height: 75 }]}
                                        source={{ uri: localDevice.userImage }}
                                    />
                                </View>

                            }
                            {!localDevice.audio && <MaterialCommunityIcons name={'microphone-off'} style={styles.microphoneOffIcon} />}
                        </View>
                    }
                </View>


                {isShowButtons &&
                    <TouchableOpacity
                        style={{ ...styles.bottomContainer }}
                        activeOpacity={1}
                        onPress={() => showButton()}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.iconContainer} onPress={leaveCall}>
                                <MaterialCommunityIcons name={'phone-hangup'} style={{ ...styles.icon, backgroundColor: COLORS.toastError }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={toggleCamera}>
                                <MaterialCommunityIcons name={localDevice.grantedCamera && localDevice.camera ? 'video' : 'video-off'} style={styles.icon} />
                                {!localDevice.grantedCamera &&
                                    <Text style={styles.notGranted}>{'!'}</Text>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={toggleFlipCamera}>
                                <MaterialCommunityIcons name={'camera-flip'} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={toggleAudio}>
                                <MaterialCommunityIcons name={localDevice.grantedAudio && localDevice.audio ? 'microphone' : 'microphone-off'} style={styles.icon} />
                                {!localDevice.grantedAudio &&
                                    <Text style={styles.notGranted}>{'!'}</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                }
            </View>

        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#0e0e0e',
        position: 'relative'
    },
    noCamera: {
        backgroundColor: '#2c2c2c',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomName: {
        fontSize: 20,
        color: COLORS.white,
        marginRight: 'auto'
    },
    userName: {
        position: 'absolute',
        left: 12,
        bottom: 12,
        fontSize: 16,
        color: COLORS.white,
        fontWeight: '500',
        zIndex: 9
    },
    microphoneOffIcon: {
        top: 5,
        right: 5,
        position: 'absolute',
        zIndex: 9,
        fontSize: 16,
        color: COLORS.white,
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: '#45444a',
        borderRadius: 999,
    },
    placeholderImage: {
        width: 128,
        height: 128,
    },
    videoContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        borderRadius: 8,
    },
    remoteVideo: {
        flex: 1
    },
    localVideo: {
        position: 'absolute',
        backgroundColor: 'transparent',
        width: 100,
        height: 120,
        right: 16,
        bottom: 16,
        zIndex: 3,
        borderRadius: 8,
        overflow: 'hidden'
    },
    topContainer: {
        paddingHorizontal: 16,
        marginVertical: 8
    },
    bottomContainer: {
        paddingBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    iconContainer: {
        marginHorizontal: 16,
        zIndex: 999,
    },
    icon: {
        color: 'white',
        fontSize: 24,
        backgroundColor: '#45444a',
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    imageHolderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#202020',

    },
    imageHolder: {
        width: 120,
        height: 120,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    notGranted: {
        right: 0,
        top: -2,
        position: 'absolute',
        paddingVertical: 1,
        paddingHorizontal: 8,
        backgroundColor: '#8B0000',
        color: COLORS.white,
        borderRadius: 999,
        fontWeight: 'bold',
        fontSize: 11
    }
})


export default VideoChat;
