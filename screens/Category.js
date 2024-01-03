import { Image, SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import { departments } from '../config/data';
import COLORS from '../constants/colors';
import AntDesign from "react-native-vector-icons/AntDesign";

export default function Category() {

    return (
        <SafeAreaView style={{ backgroundColor: '#fff' }}>
            <HeaderWithBackButton title={'Khám theo chuyên khoa'} />
            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', marginHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginBottom: 20, marginTop: 10 }}>
                <AntDesign name="search1" size={21} color={COLORS.black} style={{ marginLeft: 15, marginTop: 3 }} />
                <TextInput
                    placeholder="Tìm kiếm"
                    placeholderTextColor={COLORS.black}
                    keyboardType="default"
                    style={{
                        marginHorizontal: 10,
                        width: '90%'
                    }}
                // onChangeText={(text) => setFirstName(text)}
                >
                </TextInput>
            </View>
            <ScrollView >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 3, marginBottom: 150 }}>
                    {departments.map((item, index) => {
                        return (
                            <TouchableOpacity style={{ width: '30%', marginHorizontal: 6, marginBottom: 30 }} key={index}>
                                <View key={index} style={{ borderWidth: 0.4, borderColor: '#ccc', borderRadius: 10, padding: 20 }}>
                                    <Image source={item.path} style={{ width: '90%', height: 84 }} />
                                </View>
                                <View style={{ alignItems: 'center', marginTop: 4 }}>
                                    <Text>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}