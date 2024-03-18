import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Button, View, StyleSheet, Text, TextInput } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function VideoHome(props) {
    // const navigation = useNavigation();
    // return (
    //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
    //         <Button title="Call" onPress={() => { navigation.navigate('Call') }} />
    //     </View>
    // )
    const navigation = useNavigation();
    const [roomId, setRoomId] = useState('')
    const onJoinConferencePress = () => {
        navigation.navigate('VideoChat', {
            userId: Math.floor(Math.random() * 100000),
            userName: Math.floor(Math.random() * 100000),
            roomId: 1,
            userImage: 'https://d38b044pevnwc9.cloudfront.net/cutout-nuxt/enhancer/2.jpg'
        });
    };

    const insets = useSafeAreaInsets();
    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}>
            <Text style={[styles.conferenceID, styles.leftPadding]}>
                RoomId:
            </Text>
            <TextInput
                placeholder="Enter the Room ID. e.g. 6666"
                style={[styles.input]}
                onChangeText={text => setRoomId(text)}
                value={roomId}
            />
            <View style={[styles.buttonLine, styles.leftPadding]}>
                <Button
                    style={styles.button}
                    title="Start a conference"
                    onPress={() => {
                        onJoinConferencePress();
                    }}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    buttonLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 42,
    },
    buttonSpacing: {
        width: 13,
    },
    input: {
        height: 42,
        width: 305,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: '#333333',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 35,
        marginBottom: 20,
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
    leftPadding: {
        paddingLeft: 35,
    },
});