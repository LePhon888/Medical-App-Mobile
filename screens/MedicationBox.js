import React, { memo, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import HorizontalDateSlider from "../components/HorizontalDateSlider";

const MedicationBox = () => {
    const [bottomActiveTab, setBottomActiveTab] = useState(1);
    const [medActiveTab, setMedActiveTab] = useState(1);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedMoment, setSelectedMoment] = useState(null)

    const medTabs = [
        { key: 1, title: 'Thuốc đang uống' },
        { key: 2, title: 'Thuốc cũ' },
    ];

    const bottomTabs = [
        { key: 1, title: 'Lịch nhắc' },
        { key: 2, title: 'Hộp thuốc cá nhân' },
    ];

    const popupOptions = [
        { key: 1, title: 'Thuốc theo toa', uri: require('../assets/images/prescription.png') },
        { key: 2, title: 'Thuốc', uri: require('../assets/images/drugs.png') },
    ];


    const defaultColor = '#504f54';
    const activeColor = '#2a87f1';

    return (
        <View style={styles.screen}>
            {/* Top content */}
            <View style={styles.header}>
                <View style={styles.flexRowCenter}>
                    {/* Back button */}
                    <TouchableOpacity style={{ ...styles.backButton, marginRight: 'auto' }}>
                        <Feather name='arrow-left' size={20} color={'white'} />
                    </TouchableOpacity>
                    {/* Header title */}
                    <Text style={styles.headerTitle}>Nhắc nhở uống thuốc</Text>
                    {/* History button */}
                    <TouchableOpacity style={{ ...styles.backButton, marginLeft: 'auto' }}>
                        <FontAwesome name='history' size={20} color={'white'} />
                    </TouchableOpacity>
                </View>
                {bottomActiveTab === 1 && <HorizontalDateSlider selectedMoment={selectedMoment} onSelectDate={(m) => setSelectedMoment(m)} />}
                {bottomActiveTab === 2 && (
                    <View style={styles.medTabContainer}>
                        {medTabs.map((t) => (
                            <TouchableOpacity
                                key={t.key} style={[styles.medTab, { backgroundColor: medActiveTab === t.key ? '#2a87f1' : 'white' }]}
                                onPress={() => setMedActiveTab(t.key)}>
                                <Text style={[styles.medTabTitle, { color: medActiveTab === t.key ? 'white' : '#504f54' }]}>{t.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

            </View>

            {/* Center content */}
            <View style={styles.centerContainer}>
                {/* Empty view  */}
                <View style={styles.emptyCalendar}>
                    {bottomActiveTab === 1 ? (
                        <FontAwesome name="calendar-times-o" color={'#8c8c8c'} size={60} />
                    ) : (
                        <FontAwesome name="inbox" color={'#8c8c8c'} size={60} />
                    )}
                    <Text style={styles.emptyText}>{bottomActiveTab === 1 ? 'Chưa có lịch nhắc nhở' : 'Hộp thuốc còn trống'}</Text>
                    <Text style={{ color: '#5f5f5f', fontSize: 15 }}>Thêm thuốc và lịch uống</Text>
                    <Image style={styles.arrow} source={require('../assets/images/arrow.png')} />
                </View>
            </View>

            {/* bottom content */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={{ ...styles.floatingButton, opacity: isPopupVisible ? 0 : 1 }} onPress={() => setPopupVisible(true)}>
                    <FontAwesome name="plus" size={24} color="white" />
                </TouchableOpacity>
                {/* tabs view */}
                <View style={styles.tabContainer}>
                    {bottomTabs.map((t) => (
                        <TouchableOpacity key={t.key} style={styles.tab} onPress={() => setBottomActiveTab(t.key)}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                {t.key === 1 ? (
                                    <FontAwesome name="calendar-check-o" size={20} color={bottomActiveTab === t.key ? activeColor : defaultColor} />
                                ) : (
                                    <FontAwesome name="medkit" size={20} color={bottomActiveTab === t.key ? activeColor : defaultColor} />
                                )}
                                <Text style={[styles.tabTitle, { color: bottomActiveTab === t.key ? activeColor : defaultColor }]}>{t.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* popup add */}
            {isPopupVisible && (
                <>
                    {/* Close button */}
                    <TouchableOpacity style={{ ...styles.floatingButton, opacity: isPopupVisible ? 1 : 0, backgroundColor: '#737373' }} onPress={() => setPopupVisible(false)}>
                        <FontAwesome name="close" size={24} color="white" />
                    </TouchableOpacity>
                    {/* Overlay */}
                    <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    {/* Popup content */}
                    <View style={styles.popupContainer}>
                        <Text style={styles.popupTitle}>Bạn muốn thêm...</Text>
                        {popupOptions.map((option) => (
                            <TouchableOpacity key={option.key} style={styles.popupOption} onPress={() => handleOptionPress(option)}>
                                <Image source={option.uri} style={styles.popupOptionImage} />
                                <Text style={styles.popupOptionTitle}>{option.title}</Text>
                                <Feather name="chevron-right" size={15} color="#a1a2aa" style={styles.arrowIcon} />
                            </TouchableOpacity>
                        ))}

                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#2d74e0',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: 5,
    },
    backButton: {
        backgroundColor: '#4b8ae4',
        padding: 5,
        borderRadius: 8,
    },
    headerTitle: {
        color: 'white', fontWeight: 'bold', fontSize: 20
    },
    bottomContainer: {
        backgroundColor: '#fafafa',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    tabTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    floatingButton: {
        position: 'absolute',
        backgroundColor: '#2a87f1',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        alignSelf: 'center',
        zIndex: 102,
        bottom: 30,
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerContainer: {
        backgroundColor: '#fafafa',
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    emptyCalendar: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        bottom: 30
    },
    emptyText: {
        color: '#5f5f5f',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 12,
        marginBottom: 15,
    },
    popupContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        position: 'absolute',
        bottom: 150,
        left: 20,
        right: 20,
        zIndex: 101
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
    popupTitle: {
        fontSize: 17,
        marginBottom: 15,
        textAlign: 'center',
        color: '#5f5f5f'
    },
    popupOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        padding: 12,
        borderColor: '#f1f0f2',
        borderRadius: 15,
        backgroundColor: '#ffffff'
    },
    popupOptionImage: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    popupOptionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    arrowIcon: {
        marginLeft: 'auto',
    },
    medTabContainer: {
        top: 25,
        marginBottom: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: 3,
        marginHorizontal: 40,
        elevation: 5,
        zIndex: 10,
    },
    medTab: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 20,
        marginHorizontal: 3,
    },
    medTabTitle: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    arrow: {
        marginRight: 55
    }
});

export default MedicationBox;
