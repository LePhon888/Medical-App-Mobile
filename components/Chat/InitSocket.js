import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { endpoints } from '../../config/Apis';

/**
 * 
 * @param roomId (mandantory) use for create a chat room between users
 * @param sendMessage (mandantory) the function to send message with payload
 * @function onMessageReceived (mandantory) the callback function to handle the incoming response of websocket. 
 * The response structure will be the same with payload
 * @returns 
 */

const InitSocket = ({ userId, userName, roomId, sendMessage, onMessageReceived, videoChat = false, onWebSocketConnected, disconnected = false }) => {
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);

    const destination = {
        send: videoChat ? `/app/offer/${roomId}` : `/app/send/${roomId}`,
        receive: videoChat ? `/topic/video-call/${roomId}` : `/topic/chat/${roomId}`
    }

    const headers = {
        userId: userId,
        userName: userName,
        roomId: roomId
    }

    useEffect(() => {
        const connectToWebSocket = () => {
            const socket = new SockJS(endpoints["websocket"]);
            const client = Stomp.over(socket, { debug: false });
            client.connect(headers, () => {
                stompClientRef.current = client;
                subscribeToRoom(client);
                onWebSocketConnected(client)
            }, () => {
                onWebSocketConnected()
            });
        };

        if (roomId) {
            connectToWebSocket();
        }

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect();
            }
        };
    }, [roomId]);

    const send = (payload) => {
        try {
            if (payload.destination) {
                stompClientRef.current.send(payload.destination, JSON.stringify(payload.data));
            } else {
                stompClientRef.current.send(destination.send, JSON.stringify(payload));
            }

        } catch (error) {
            console.error('WebSocket not connected', error);
        }
    };

    const subscribeToRoom = (client) => {
        subscriptionRef.current = client.subscribe(destination.receive, (message) => {
            const response = JSON.parse(message.body);
            if (onMessageReceived) {
                onMessageReceived(response);
            }
        });
    };

    useEffect(() => {
        if (sendMessage && subscriptionRef.current) {
            send(sendMessage);
        }
        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.unsubscribe(subscriptionRef.current)
            }
        };
    }, [sendMessage]);

    useEffect(() => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.disconnect();
            stompClientRef.current.unsubscribe(subscriptionRef.current)
        }
    }, [disconnected])

    return null;
};

export default InitSocket;