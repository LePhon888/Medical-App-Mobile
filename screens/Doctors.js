import { Animated, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DoctorList from "../components/Doctor/DoctorList";
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useEffect, useRef, useState } from "react";
import COLORS from "../constants/colors";
import Apis, { endpoints } from "../config/Apis";
const Doctors = ({ navigation }) => {

    const [activeTab, setActiveTab] = useState(2);
    const [isShowFilterPopup, setShowFilterPopup] = useState(false)
    const tabs = [
        { key: 1, title: 'Bệnh viện & Phòng khám', },
        { key: 2, title: 'Bác sỹ' },
    ];

    const navigateDoctorDetail = (doctorId) => {
        console.log(doctorId)
        navigation.navigate('DoctorDetail', doctorId);
    }

    return (
        <ScrollView style={styles.container} nestedScrollEnabled={true} stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
            {/*Header View */}
            <View style={styles.header}>
                {/* Location */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='location-outline' color={'#3984dd'} size={25} />
                        <Text style={styles.locationTitle}>Tất cả</Text>
                        <FontAwesome name='sort-down' style={{ marginBottom: 5 }}></FontAwesome>
                    </TouchableOpacity>
                    {/* Cancel */}
                    <TouchableOpacity>
                        <Text style={styles.cancel}>Hủy</Text>
                    </TouchableOpacity>
                </View>
                {/* Search input */}
                <TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <Image source={require('../assets/health.png')} style={styles.image} />
                        <Text style={styles.searchInput}>Đa khoa</Text>
                        <Feather name="search" size={20} color="#000" style={styles.icon} />
                    </View>
                </TouchableOpacity>
            </View>
            {/* Tab View */}
            <View style={styles.stickyContent}>
                <View style={styles.tabContainer}>
                    {tabs.map((t) => (
                        <TouchableOpacity
                            key={t.key} style={[styles.tab, { backgroundColor: activeTab === t.key ? COLORS.primary : '#f8f9fd' }]}
                            onPress={() => setActiveTab(t.key)}>
                            <Text style={[styles.tabTitle, { color: activeTab === t.key ? '#FFFF' : '#504f54' }]}>{t.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* Filter and Result */}
                <View style={styles.filterContainer}>
                    <Text style={{ fontWeight: '500' }}>2 Kết quả</Text>
                    <TouchableOpacity style={styles.filter} onPress={() => setShowFilterPopup(true)}>
                        <Text><FontAwesome size={17} name="sliders" color={'#6199d1'}></FontAwesome>  Lọc</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {activeTab === 2 && <DoctorList onItemclickEvent={navigateDoctorDetail} />}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isShowFilterPopup}
                onRequestClose={() => togglePopup(false)}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* Overlay */}
                    <TouchableWithoutFeedback onPress={() => setShowFilterPopup(false)}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.popupContainer}>
                        <Text>HI</Text>
                    </View>
                </View>
            </Modal>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFF',
    },
    header: {
        backgroundColor: '#e1f1ff',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    stickyContent: {
        backgroundColor: '#FFFF',
    },
    locationTitle: {
        fontSize: 17,
        fontWeight: '500',
        marginHorizontal: 7
    },
    cancel: {
        color: '#3386e7',
        fontWeight: '500',
        fontSize: 16
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
        backgroundColor: 'white',
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
        flex: 1,
        paddingVertical: 8,
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
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    popupContainer: {
        backgroundColor: '#f8f9fd',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        position: 'absolute',
        bottom: 150,
        left: 20,
        right: 20,
        zIndex: 101,
    },
});

export default Doctors;
