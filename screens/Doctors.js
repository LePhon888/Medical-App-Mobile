import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DoctorList from "../components/Doctor/DoctorList";
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
const Doctors = () => {
    const [activeTab, setActiveTab] = useState(2);
    const tabs = [
        { key: 1, title: 'Bệnh viện & Phòng khám', },
        { key: 2, title: 'Bác sỹ' },
    ];

    return (
        <View style={styles.container}>
            {/*Header View */}
            <View style={styles.header}>

                {/* Location */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='location-outline' color={'#3984dd'} size={25} />
                        <Text style={{ fontSize: 17, fontWeight: '500', marginHorizontal: 7 }}>Tất cả</Text>
                        <FontAwesome name='sort-down' style={{ marginBottom: 5 }}></FontAwesome>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={{ color: '#3386e7', fontWeight: '500', fontSize: 16 }}>Hủy</Text>
                    </TouchableOpacity>
                </View>

                {/* Search input */}
                <TouchableOpacity>

                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Image source={require('../assets/health.png')} style={styles.image} />
                    <Text style={styles.searchInput}>Đa khoa</Text>
                    <Feather name="search" size={20} color="#000" style={styles.icon} />
                </View>
            </View>
            {/* Tab View */}
            <View style={styles.tabContainer}>
                {tabs.map((t) => (
                    <TouchableOpacity
                        key={t.key} style={[styles.tab, { backgroundColor: activeTab === t.key ? '#2a87f1' : '#f8f9fd' }]}
                        onPress={() => setActiveTab(t.key)}>
                        <Text style={[styles.tabTitle, { color: activeTab === t.key ? '#FFFF' : '#504f54' }]}>{t.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {/* Filter and Result */}
            <View style={styles.filterContainer}>
                <Text style={{ fontWeight: '500' }}>2 Kết quả</Text>
                <TouchableOpacity style={styles.filter}>
                    <Text><FontAwesome size={17} name="sliders" color={'#6199d1'}></FontAwesome>  Lọc</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 2 && <DoctorList />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFF',
        marginBottom: 30
    },
    header: {
        backgroundColor: '#e1f1ff',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d0d6dd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 15,
        backgroundColor: 'white'
    },
    searchInput: {
        flex: 1,
        height: 40,
        textAlignVertical: 'center'
    },
    icon: {
        marginHorizontal: 5,
    },
    tabContainer: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tab: {
        width: 180,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tabTitle: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    filter: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: '#e1f1ff',
        borderRadius: 5,
    }
});

export default Doctors;
