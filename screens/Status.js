import { Image, SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import COLORS from '../constants/colors';
import Button from '../components/Button';

export default function Status({ status = 1, navigation }) {
    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <View >
                <View style={{ alignItems: 'center' }}>
                    {status == 1 ?
                        <View style={{ width: 180, height: 180, backgroundColor: '#d4efe6', marginTop: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 1000, }}>
                            <View style={{ width: 150, height: 150, backgroundColor: '#79cfb2', marginTop: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 1000, }}>
                                <Image source={require(`../assets/images/success.png`)} style={{ width: 120, height: 120 }} />
                            </View>
                        </View> :
                        <View View style={{ width: 180, height: 180, backgroundColor: '#f0d7d3', marginTop: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 1000, }}>
                            <View style={{ width: 150, height: 150, backgroundColor: '#dc8880', marginTop: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 1000, }}>
                                <Image source={require(`../assets/images/fail.png`)} style={{ width: 120, height: 120 }} />
                            </View>
                        </View>
                    }

                </View>
                <View>
                    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 90, fontWeight: 600 }}>Đặt lịch hẹn{status == 1 ? '' : ' không'} thành công</Text>
                    <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 12, color: '#9da4a9' }}>Bấm nút quay lại để về trang chủ</Text>
                </View>
                <Button title={'Quay lại'} filled style={{ borderRadius: 6, marginHorizontal: 18, marginTop: 50, backgroundColor: status == 1 ? '#22b07e' : '#f44236', borderWidth: 0 }} onPress={() => navigation.navigate('MainScreen')} />
            </View>
        </SafeAreaView >
    );
}