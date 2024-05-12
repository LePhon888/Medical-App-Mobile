import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, PermissionsAndroid, Linking, Image } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RTCView, mediaDevices } from 'react-native-webrtc';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import Button from '../components/Button';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import COLORS from '../constants/colors';
import Loading from '../components/Loading';
import { useUser } from '../context/UserContext';
import Apis, { endpoints } from '../config/Apis';
import InputWithRightIcon from '../components/InputWithRightIcon';
export default function VideoHome(props) {
    const navigation = useNavigation();
    const [roomId, setRoomId] = useState('')
    const [loading, setLoading] = useState(false)
    const [localDevice, setLocalDevice] = useState({
        camera: true,
        audio: true,
        grantedAudio: true,
        grantedCamera: true
    })
    const requestPermissionDone = useRef(false)
    const makingLocalStream = useRef(false)
    const [localStream, setLocalStream] = useState(null)
    const { userId } = useUser()
    const userDetail = useRef(null)

    const [validation, setValidation] = useState({
        valid: true,
        message: ''
    })

    const requestCameraPermission = async () => {
        try {
            const grantedCamera = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );

            if (grantedCamera === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                return PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
            }

            setLocalDevice(prev => ({
                ...prev,
                grantedCamera: grantedCamera === PermissionsAndroid.RESULTS.GRANTED,
                camera: grantedCamera === PermissionsAndroid.RESULTS.GRANTED
            }));

            return grantedCamera === PermissionsAndroid.RESULTS.GRANTED

        } catch (error) {
            console.error('Error requesting camera permission:', error);
        }
    };

    const requestAudioPermission = async () => {
        try {
            const grantedAudio = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            );

            if (grantedAudio === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                return PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
            }

            setLocalDevice(prev => ({
                ...prev,
                grantedAudio: grantedAudio === PermissionsAndroid.RESULTS.GRANTED,
                audio: grantedAudio === PermissionsAndroid.RESULTS.GRANTED
            }));

            return grantedAudio === PermissionsAndroid.RESULTS.GRANTED

        } catch (error) {
            console.error('Error requesting audio permission:', error);
        }
    };

    const getLocalStream = async (camera = true, audio = true) => {
        try {
            makingLocalStream.current = true
            console.log('camera', camera)
            console.log('audio', audio)
            const stream = await mediaDevices.getUserMedia({
                video: camera,
                audio: audio,
            });
            console.log(stream)
            setLocalStream(stream)
        } catch (error) {
        } finally {
            makingLocalStream.current = false
        }
    }

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                setLoading(true)
                await requestCameraPermission()
                await requestAudioPermission()
                requestPermissionDone.current = true
            } catch (error) {
                console.error('Error requesting permissions:', error);
            } finally {
                setLoading(false)
            }
        };

        requestPermissions();

    }, []);


    useEffect(() => {
        const getUserInfo = async () => {
            const res = await Apis.get(`${endpoints["user"]}/${userId}`)
            userDetail.current = res.data
        }
        if (userId) {
            getUserInfo()
        }
    }, [userId])

    useEffect(() => {
        if (requestPermissionDone.current && !makingLocalStream.current) {

            if (localStream) {
                const hasVideoTracks = localStream.getVideoTracks().length > 0;
                const hasAudioTracks = localStream.getAudioTracks().length > 0;

                if ((!hasVideoTracks && localDevice.grantedCamera) || (!hasAudioTracks && localDevice.grantedAudio)) {
                    localStream.getTracks().forEach(track => track.stop());
                    setLocalStream(null)
                    getLocalStream(localDevice.grantedCamera, localDevice.grantedAudio);
                }
            } else if (localDevice.grantedCamera || localDevice.grantedAudio) {
                getLocalStream(localDevice.grantedCamera, localDevice.grantedAudio);
            }
        }
    }, [localDevice]);


    const onJoinConferencePress = () => {
        navigation.navigate('VideoChat', {
            roomId: roomId,
            userId: userId,
            userName: userDetail.current?.lastName + ' ' + userDetail.current?.firstName,
            userImage: userDetail.current?.image,
            device: localDevice
        });
    };

    const toggleCamera = async () => {
        try {

            if (!localDevice.grantedCamera) {
                const res = await requestCameraPermission()
                if (res === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Linking.openSettings()
                }
                return;
            }

            if (!localStream) {
                return;
            }

            setLocalDevice(prev => ({ ...prev, camera: !localDevice.camera }));


            localStream.getVideoTracks().forEach(track => {
                track.enabled = !localDevice.camera;
            });

        } catch (err) {
            // Handle Error
            console.log('Error toggling camera:', err);
        }
    }

    const toggleAudio = async () => {
        try {

            if (!localDevice.grantedAudio) {
                const res = await requestAudioPermission()
                if (res === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Linking.openSettings()
                }
                return;
            }

            if (!localStream) {
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

    const onChangeRoomId = (text) => {
        setRoomId(text);
        setValidation({
            valid: !text.includes(' '),
            message: 'Mã phòng không được có khoảng trống.'
        })
    }

    useEffect(() => {
        const { deviceInfo } = props.route?.params || {};
        if (deviceInfo) {
            getLocalStream(true, true)
            setLocalDevice((prev) => ({ ...prev, ...deviceInfo }))
        }
    }, [props.route])


    return (
        <View style={styles.screen}>

            <HeaderWithBackButton title={'Tham Gia Cuộc Gọi'} />

            <View style={styles.videoContainer}>

                {(!localDevice.grantedCamera || !localDevice.camera) &&
                    <View style={styles.imageHolderContainer}>
                        <Image
                            style={styles.imageHolder}
                            source={{ uri: userDetail.current?.image }}
                        />
                    </View>
                }

                {localStream && localDevice.camera && localDevice.grantedCamera &&
                    <RTCView
                        streamURL={localStream.toURL()}
                        objectFit='cover'
                        style={{ flex: 1 }}
                        zOrder={0}
                    />
                }
                <TouchableOpacity style={styles.cameraButton} onPress={toggleCamera}>
                    <MaterialCommunityIcons name={localDevice.camera ? 'video' : 'video-off'} style={styles.icon} />
                    {!localDevice.grantedCamera &&
                        <Text style={styles.notGranted}>{'!'}</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.micButton} onPress={toggleAudio}>
                    <MaterialCommunityIcons name={localDevice.audio ? 'microphone' : 'microphone-off'} style={styles.icon} />
                    {!localDevice.grantedAudio &&
                        <Text style={styles.notGranted}>{'!'}</Text>
                    }
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 16 }}>
                <InputWithRightIcon
                    placeholder={'Nhập mã phòng'}
                    value={roomId}
                    valid={validation.valid}
                    errorMsg={validation.message}
                    iconVisible={roomId.length > 0}
                    onChangeText={(text) => onChangeRoomId(text)}
                    style={{ marginHorizontal: '15%' }}
                    errorMsgStyle={{ textAlign: 'center' }}
                    textStyle={{ textAlign: 'center' }}
                />
            </View>


            <View style={[styles.buttonLine]}>
                <Button
                    filled
                    title={'Tham gia'}
                    onPress={onJoinConferencePress}
                    disabled={!validation.valid || roomId.length < 1}
                    style={{
                        borderRadius: 6,
                        opacity: (!validation.valid || roomId.length < 1) ? 0.6 : 1
                    }}
                />
            </View>

            {loading && <Loading transparent={true} />}
        </View>
    );
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    imageHolderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
    buttonLine: {
        marginHorizontal: '15%'
    },
    buttonSpacing: {
        width: 13,
    },
    input: {
        height: 42,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: COLORS.grey,
        marginVertical: 16,
        padding: 10,
        marginHorizontal: '15%',
        textAlign: 'center',
    },
    userID: {
        fontSize: 14,
        color: '#2A2A2A',
        marginBottom: 27,
        paddingBottom: 12,
        paddingTop: 12,
        paddingLeft: 20,
    },
    conferenceID: {
        fontSize: 14,
        color: '#2A2A2A',
        marginBottom: 5,
    },
    simpleCallTitle: {
        color: '#2A2A2A',
        fontSize: 21,
        width: 330,
        fontWeight: 'bold',
        marginBottom: 27,
    },
    button: {
        height: 42,
        borderRadius: 9,
        backgroundColor: '#F4F7FB',
    },
    videoContainer: {
        marginTop: 16,
        height: '60%',
        backgroundColor: '#202020',
        overflow: 'hidden',
        borderRadius: 25,
        marginHorizontal: '15%'
    },
    cameraButton: {
        position: 'absolute',
        marginHorizontal: 16,
        bottom: 12,
        zIndex: 999
    },
    micButton: {
        position: 'absolute',
        marginHorizontal: 16,
        bottom: 12,
        right: 0,
        zIndex: 999
    },
    icon: {
        color: 'white',
        fontSize: 24,
        backgroundColor: '#0e0e0e',
        borderRadius: 999,
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    notGranted: {
        right: -5,
        top: -5,
        position: 'absolute',
        paddingVertical: 1,
        paddingHorizontal: 7,
        backgroundColor: '#8B0000',
        color: COLORS.white,
        borderRadius: 999,
        fontWeight: 'bold',
        fontSize: 10
    }
});