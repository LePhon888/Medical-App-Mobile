import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { endpoints } from '../../config/Apis';

/**
 * 
 * @param roomId (mandantory) use for create a chat room between users
 * @param payload (mandantory) the payload that will sent to websocket
 * @function onMessageReceived (mandantory) the callback function to handle the incoming response of websocket. 
 * The response structure will be the same with payload
 * @returns 
 */
const InitSocket = ({ roomId, payload, onMessageReceived }) => {
    const [stompClient, setStompClient] = useState(null);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const connectToWebSocket = () => {
            const socket = new SockJS(endpoints["websocket"]);
            const client = Stomp.over(socket);
            client.connect({ roomId: roomId }, () => {
                setStompClient(client);
                subscribeToRoom(client);
            });
        };

        if (roomId) {
            connectToWebSocket();
        }

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [roomId]);

    const sendMessage = (payload) => {
        if (stompClient && stompClient.connected) {
            stompClient.send(`/app/send/${roomId}`, JSON.stringify(payload));
        } else {
            console.error('WebSocket not connected');
        }
    };

    const subscribeToRoom = (client) => {
        const newSubscription = client.subscribe(`/topic/chat/${roomId}`, (message) => {
            const response = JSON.parse(message.body);
            if (onMessageReceived) {
                onMessageReceived(response);
            }
        });

        setSubscription(newSubscription);
    };

    useEffect(() => {
        if (payload && subscription) {
            sendMessage(payload);
        }
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.unsubscribe(roomId)
            }
        };
    }, [payload, subscription]);

    return null;
};

export default InitSocket;
