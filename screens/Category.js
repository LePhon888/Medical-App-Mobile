import { Image, SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import COLORS from '../constants/colors';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useEffect, useState } from 'react';
import Apis, { endpoints } from '../config/Apis';
const departmentImages = {
    Allergeries: require('../assets/images/departments/Allergeries.png'),
    Blood: require('../assets/images/departments/Blood.png'),
    Brain: require('../assets/images/departments/Brain.png'),
    Cancer: require('../assets/images/departments/Cancer.png'),
    Diabetes: require('../assets/images/departments/Diabetes.png'),
    Digestive: require('../assets/images/departments/Digestive.png'),
    ENT: require('../assets/images/departments/ENT.png'),
    Healthy: require('../assets/images/departments/Healthy.png'),
    Heart: require('../assets/images/departments/Heart.png'),
    Infectious: require('../assets/images/departments/Infectious.png'),
    Mens: require('../assets/images/departments/Mens.png'),
    Oral: require('../assets/images/departments/Oral.png'),
    Orthopedics: require('../assets/images/departments/Orthopedics.png'),
    Respiratory: require('../assets/images/departments/Respiratory.png'),
    Urological: require('../assets/images/departments/Urological.png'),

};
export default function Category({ departments }) {

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', position: 'absolute', zIndex: 10, top: 160, bottom: 0 }}>
            {/* <HeaderWithBackButton title={'Khám theo chuyên khoa'} /> */}
            {/* <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', marginHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginBottom: 20, marginTop: 10 }}>
                <AntDesign name="search1" size={21} color={COLORS.black} style={{ marginLeft: 15, marginTop: 3 }} />
                <TextInput
                    placeholder="Tìm kiếm"
                    placeholderTextColor={COLORS.black}
                    keyboardType="default"
                    style={{
                        marginHorizontal: 10,
                        width: '90%'
                    }}
                >
                </TextInput>
            </View> */}
            <ScrollView >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 3 }}>
                    {departments?.map((item, index) => {
                        return (
                            <TouchableOpacity style={{ width: '30%', marginHorizontal: 6, marginBottom: 30 }} key={index}>
                                <View key={index} style={{ borderWidth: 0.4, borderColor: '#ccc', borderRadius: 10, padding: 20 }}>
                                    <Image source={departmentImages[item.image]} style={{ width: '90%', height: 84 }} />
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