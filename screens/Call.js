import ZegoUIKitPrebuiltCall, { GROUP_VOICE_CALL_CONFIG, GROUP_VIDEO_CALL_CONFIG, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { Image, View } from 'react-native';

export default function Call(props) {
    let randomUserID = String(Math.floor(Math.random() * 100000));

    return (
        <View style={{ flex: 1 }}>
            <ZegoUIKitPrebuiltCall
                appID={1208546669}
                appSign='e58bf8cf2ecfb64064dac777c83fe2f7e6241dbacf03e068848fecbf639c200e'
                userID={randomUserID}
                userName={'user_' + randomUserID}
                callID='testCallID'

                config={{
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onHangUp: () => { props.navigation.navigate('VideoHome') },
                    onOnlySelfInRoom: () => { props.navigation.navigate('VideoHome') },
                }}
            />

        </View>
    );
}