import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import moment from "moment";

export default function Weight({ route }) {
    const weightList = route.params;
    const data = [
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
        { day: '04/04/2004, 11:51 AM', weight: '62 kg' },
    ]

    return (
        <View style={styles.container}>
            <HeaderWithBackButton title={'Lịch sử cân nặng'} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15 }}>
                <View style={{
                    borderRadius: 10,
                    backgroundColor: '#fff',
                }}>
                    {weightList?.map((item, index) => {
                        return (
                            <View key={index} style={{ paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', borderBottomWidth: 0.2, borderBottomColor: '#ccc', backgroundColor: index % 2 == 0 ? '#f8f9fd' : '#fff' }}>
                                <Text style={{ marginRight: '46%', color: '#2b2b2b', fontSize: 16, fontWeight: 400 }}>{moment(item.date).format('DD/MM/YYYY')} {moment(item.time, 'HH:mm:ss').format('HH:mm')}</Text>
                                <Text style={{ color: '#2b2b2b', fontSize: 16, fontWeight: 500 }}>{item.number} kg</Text>
                            </View>
                        )
                    })}

                </View>

            </ScrollView >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
});