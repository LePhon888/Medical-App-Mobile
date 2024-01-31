import React from 'react';
import { StyleSheet, View } from 'react-native';
import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn';

export default function VideoConferencePage(props) {
    const { route } = props;
    const { params } = route;
    const { userID, userName, conferenceID } = params;
    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltVideoConference
                appID={1208546669}
                appSign='e58bf8cf2ecfb64064dac777c83fe2f7e6241dbacf03e068848fecbf639c200e'
                userID={userID}
                userName={userName}
                conferenceID={conferenceID}
                config={{
                    onLeave: () => {
                        props.navigation.navigate('HomePage');
                    },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
});