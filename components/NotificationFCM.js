import React, { useContext, useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { UserContext } from '../App';
import Apis, { endpoints } from '../config/Apis';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
const NotificationFCM = () => {

    const { userId } = useUser()
    const [isFetched, setFetched] = useState(false)
    const { state, dispatch } = useNotification()
    const [userDevice, setUserDevice] = useState({
        id: 0,
        userId: 0,
        tokenRegistration: '',
    })

    const registerDevice = async () => {
        try {
            await messaging().requestPermission();
            const fcmToken = await messaging().getToken();
            if (fcmToken && userDevice.tokenRegistration !== fcmToken) {
                createUserDevice(fcmToken);
            }
        } catch (error) {
            console.error('Error registering device for FCM:', error);
        }
    };

    const onTokenRefresh = async (refreshedToken) => {
        try {
            if (refreshedToken && userDevice.tokenRegistration !== refreshedToken) {
                createUserDevice(refreshedToken)
            }
        } catch (error) {
            console.error('Error refreshing FCM token:', error);
        }
    };

    const onMessageRecieved = async (message) => {
        console.log('Android: ', message);
        Toast.show({
            type: 'notification',
            props: {
                title: message.notification.title,
                body: message.notification.body,
                sentTime: message.sentTime,
                clickAction: (() => {
                    console.log('message.data', message.data)
                    console.log('message.data.screen', message.data.screen)
                })
            },
            autoHide: true,
            onShow: (() => {
                console.log('New notification')
                dispatch({ type: 'TOGGLE_REFRESH_DATA' });
            })
        });
    };

    const onBackgoundMessage = async (message) => {
        console.log('Message in background', message);
        console.log('Message in background', message.android);
    }

    const createUserDevice = async (fcmToken) => {
        try {
            const res = await Apis.post(`${endpoints["userDevice"]}/create`, { ...userDevice, tokenRegistration: fcmToken });
            console.log('User device created successfully:', res.data);
            setUserDevice((prev) => ({ ...prev, tokenRegistration: fcmToken }));
        } catch (error) {
            console.error('Error creating user device:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            const getUserDevice = async () => {
                try {
                    setFetched(false)
                    const res = await Apis.get(`${endpoints["userDevice"]}/user/${userId}`);
                    if (res.data) {
                        setUserDevice(res.data)
                    } else {
                        setUserDevice({
                            id: 0,
                            userId: userId
                        })
                    }
                } catch (error) {
                    console.error('Error get user device:', error);
                }
                finally {
                    setFetched(true)
                }
            }
            getUserDevice()
        }
    }, [userId]);


    useEffect(() => {
        if (isFetched && userDevice.userId && userDevice.userId > 0) {
            registerDevice()
            const onMessageUnsubscribe = messaging().onMessage(onMessageRecieved)
            const onTokenRefreshUnsubscribe = messaging().onTokenRefresh(onTokenRefresh)
            messaging().setBackgroundMessageHandler(onBackgoundMessage);
            return () => {
                onMessageUnsubscribe()
                onTokenRefreshUnsubscribe()
            };
        }
    }, [isFetched])

    return null;
};

export default NotificationFCM;
