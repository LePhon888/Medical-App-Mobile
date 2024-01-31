import { Text, TouchableOpacity, View } from 'react-native';
import CallEnd from '../assets/svg/CallEnd';

export default function OutgoingCallScreen({ }) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'space-around',
                backgroundColor: '#050A0E',
            }}>
            <View
                style={{
                    padding: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 14,
                }}>
                <Text
                    style={{
                        fontSize: 16,
                        color: '#D0D4DD',
                    }}>
                    Calling to...
                </Text>

                <Text
                    style={{
                        fontSize: 36,
                        marginTop: 12,
                        color: '#ffff',
                        letterSpacing: 6,
                    }}>
                    {/* {otherUserId.current} */}
                    09786134
                </Text>
            </View>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <TouchableOpacity
                    onPress={() => {
                        // setType('JOIN');
                        // otherUserId.current = null;
                    }}
                    style={{
                        backgroundColor: '#FF5D5D',
                        borderRadius: 30,
                        height: 60,
                        aspectRatio: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <CallEnd width={50} height={12} />
                </TouchableOpacity>
            </View>
        </View>
    );
};