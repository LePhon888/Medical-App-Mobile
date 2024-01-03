import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Doctors from '../assets/SampleDoctors.json';
import DoctorInfo from '../components/Doctor/DoctorInfo';

const DoctorDetail = ({ userId }) => {
    const doctor = Doctors.at(0);
    const [activeTab, setActiveTab] = useState(1);
    const tabs = [
        { key: 1, title: 'Thông tin cơ bản', },
        { key: 2, title: 'Đánh giá' },
    ];
    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.flexRowCenter}>
                    {/* Back icon */}
                    <View style={styles.backIcon}>
                        <Ionicons size={20} name="chevron-back-outline"></Ionicons>
                    </View>
                    {/* rating */}
                    <View style={styles.rating}>
                        <Text style={{ fontSize: 10 }}>⭐</Text>
                        <Text style={{ fontWeight: '500' }}>{`${doctor.rating}/5`}</Text>
                    </View>
                    {/* favourite */}
                    <View style={styles.favourite}>
                        <MaterialCommunityIcons size={20} name="heart-plus-outline"></MaterialCommunityIcons>
                    </View>
                </View>
            </View>
            {/* Center item */}
            <View style={styles.avatarContainer}>
                <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.name}>BS.CKI {doctor.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.department}>
                        {doctor.department}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.consultation}>{doctor.consultation}</Text>
                    </View>
                </View>
            </View>
            {/* Main Content */}
            <View style={styles.content}>
                {/* Target: adult or children */}
                <View style={{ flexDirection: 'row', marginBottom: 10, }}>
                    {doctor.target.map((target, index) => (
                        <Text style={styles.target} key={index}>
                            {target === 'adult' ? 'Dành cho người lớn' : target === 'children' ? 'Dành cho trẻ em' : ''}
                        </Text>
                    ))}
                </View>
                {/* Fee */}
                <View style={styles.flexRowCenter}>
                    <View style={styles.dollar}>
                        <Feather name='dollar-sign' color={'#f0983f'} size={12} />
                    </View>
                    <Text style={styles.fee}>
                        Phí thăm khám cố định<Text style={{ fontSize: 13, color: '#0e8558', fontWeight: '500' }}>{` ${Number(doctor.fee).toLocaleString('vi-VN')} đ`}</Text></Text>
                </View>
                {/* Address */}
                <View style={styles.flexRowCenter}>
                    <View style={styles.dollar}>
                        <MaterialCommunityIcons name='map-marker-outline' color={'#f0983f'} size={12} />
                    </View>
                    <Text style={[styles.fee, { color: '#717171' }]}>{doctor.address}</Text>
                </View>
                {/* Tab View for switching info and rating */}
                <View style={styles.tabContainer}>
                    {tabs.map((t) => (
                        <TouchableOpacity
                            key={t.key} style={[styles.tab, { backgroundColor: activeTab === t.key ? '#2a87f1' : '#f8f9fd' }]}
                            onPress={() => setActiveTab(t.key)}>
                            <Text style={[styles.tabTitle, { color: activeTab === t.key ? '#FFFF' : '#504f54' }]}>{t.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {activeTab === 1 && <DoctorInfo />}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 300
    },
    flexRowCenter: {
        flexDirection: 'row', alignItems: 'center'
    },
    header: {
        paddingHorizontal: 10,
        backgroundColor: '#d5ecfe',
        paddingTop: 20,
        paddingBottom: '20%',
    },
    backIcon: {
        padding: 10,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    rating: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 10,
        color: '#212025',
        backgroundColor: '#faf9fe',
        borderRadius: 10,
    },
    favourite: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    avatarContainer: {
        top: -10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 150
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: 'white',
        borderWidth: 5,
    },
    name: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#425463',
    },
    department: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    consultation: {
        marginTop: 3,
        marginBottom: 3,
        paddingVertical: 3,
        paddingHorizontal: 10,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        color: '#0e8558',
        borderWidth: 1,
        backgroundColor: '#d7ffed',
        borderColor: '#0e8558',
        borderRadius: 15,
    },
    content: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    target: {
        borderRadius: 15,
        fontSize: 13,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        backgroundColor: '#faf9fe',
    },
    dollar: {
        borderWidth: 1,
        borderColor: '#4d85be',
        borderRadius: 25,
        padding: 1,
        marginRight: 5,
    },
    fee: {
        marginVertical: 5,
        fontSize: 13,
        color: '#282828',
    },
    tabContainer: {
        marginVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tabTitle: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },

});

export default DoctorDetail;
