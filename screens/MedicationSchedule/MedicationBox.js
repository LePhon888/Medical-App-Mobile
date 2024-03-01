import React, { memo, useEffect, useState } from "react";
import { FlatList, Image, Modal, SectionList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import HorizontalDateSlider from "../../components/HorizontalDateSlider";
import Apis, { endpoints } from "../../config/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import COLORS from "../../constants/colors";
import Octicons from "react-native-vector-icons/Octicons";
import { formatDateMoment, formatDuration } from "../../config/date";
import Loading from "../../components/Loading";
import ToastConfig from "../../config/Toast";
import Toast from "react-native-toast-message";

const StatusIcon = ({ iconName, iconColor, lightColor = false, text, onPress }) => (
    <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
        {!lightColor ? (
            <Octicons name={iconName} color={iconColor} style={styles.icon} />
        ) : (
            <Octicons name={iconName} color={'white'} style={{ ...styles.icon, backgroundColor: iconColor }} />
        )}

        <Text style={{ ...styles.iconText, color: iconColor }}>{text}</Text>
    </TouchableOpacity>
);

const MedicationBox = ({ navigation, route }) => {
    const [bottomActiveTab, setBottomActiveTab] = useState(1);
    const [medActiveTab, setMedActiveTab] = useState(1);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedMoment, setSelectedMoment] = useState(moment())
    const [scheduleTimes, setScheduleTimes] = useState([])
    const [medicationSchedule, setMedicationSchedule] = useState([])
    const [userId, setUserId] = useState(2)

    const [isFetched, setFetched] = useState(false)
    const assetsImageUri = '../../assets/images/'
    const periods = {
        'Morning': { label: 'Sáng', uri: require(`${assetsImageUri}clouds-and-sun.png`) },
        'Afternoon': { label: 'Chiều', uri: require(`${assetsImageUri}afternoon.png`) },
        'Evening': { label: 'Tối', uri: require(`${assetsImageUri}moon.png`) },
    };

    const medTabs = [
        { key: 1, title: 'Thuốc đang uống' },
        { key: 2, title: 'Thuốc cũ' },
    ];

    const bottomTabs = [
        { key: 1, title: 'Lịch nhắc' },
        { key: 2, title: 'Hộp thuốc cá nhân' },
    ];

    const popupOptions = [
        { key: 1, title: 'Thuốc theo toa', uri: require(`${assetsImageUri}prescription.png`) },
        { key: 2, title: 'Thuốc', uri: require(`${assetsImageUri}drugs.png`) },
    ];

    const navigateAddMedicine = () => {
        navigation.navigate('AddMedicine')
        setPopupVisible(false)
    }

    const navigateEditSchedule = (id) => {
        navigation.navigate('MedicationSchedule', { id })
    }

    const defaultColor = '#504f54';
    const activeColor = '#2a87f1';

    const goBack = () => {
        navigation.goBack()
    }

    const getscheduleTimes = async () => {
        try {
            setFetched(false);
            const user = await AsyncStorage.getItem("user");
            const userId = JSON.parse(user)?.id || 2
            const scheduleTimes = await Apis.get(`${endpoints["scheduleTime"]}/user/${userId}?startDate=${formatDateMoment(selectedMoment)}`)
            setScheduleTimes(scheduleTimes.data)
            setUserId(userId)
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error
            })
            console.error(error)
        } finally {
            setFetched(true);
        }
    }

    const getMedicationSchedule = async () => {
        try {
            const res = await Apis.get(`${endpoints["medicationSchedule"]}/user/${userId}?isActive=${medActiveTab === 1}`)
            setMedicationSchedule(res.data)
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error
            })
        }
    }

    useEffect(() => {
        if (route.params?.saveScheduleSuccess) {
            console.log('im here')
            if (bottomActiveTab === 2) {
                getMedicationSchedule()
            } else {
                setMedActiveTab(1)
                setBottomActiveTab(2)
            }
        }
    }, [route.params]);



    useEffect(() => {
        if (bottomActiveTab === 2) {
            getMedicationSchedule()
        }
    }, [bottomActiveTab, medActiveTab])

    useEffect(() => {
        getscheduleTimes();
    }, [selectedMoment]);


    const getPeriod = (time) => {
        const momentTime = moment(time, 'HH:mm');
        if (momentTime.isBetween(moment('12:00', 'HH:mm'), moment('18:00', 'HH:mm'), 'milliseconds', '[]')) {
            return 'Afternoon';
        } else if (momentTime.isSameOrAfter(moment('18:00', 'HH:mm'))) {
            return 'Evening';
        } else {
            return 'Morning';
        }
    };


    const createOrUpdateDetail = async ({ item, isUsed }) => {
        try {
            const res = await Apis.post(`${endpoints["scheduleTimeDetail"]}/createOrUpdate`, {
                id: item.id,
                date: selectedMoment.format('YYYY-MM-DD'),
                isUsed: isUsed,
                scheduleTimeId: item.scheduleTimeId
            });
            return res.status;
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error.message
            });
            return error.message
        }
    };

    const updateStatus = async ({ item, isUsed }) => {
        setFetched(false);
        const result = await createOrUpdateDetail({ item, isUsed });
        if (result === 200 || result === 201) {
            getscheduleTimes()
        }
        setFetched(true);
    };

    const handleUseAllInSection = async (sectionTitle) => {
        setFetched(false);
        const sectionData = filteredSections.find((section) => section.title === sectionTitle);
        if (sectionData) {
            const itemsToMarkAsUsed = sectionData.data.filter((item) => item.isUsed !== true);
            if (itemsToMarkAsUsed.length > 0) {
                await Promise.all(
                    itemsToMarkAsUsed.map(async (item) => {
                        await createOrUpdateDetail({ item, isUsed: true });
                    })
                );
                getscheduleTimes();
            }
        }
        setFetched(true);
    };

    const filteredSections = [
        {
            title: 'Morning',
            data: scheduleTimes.filter(item => getPeriod(item.time) === 'Morning')
        },
        {
            title: 'Afternoon',
            data: scheduleTimes.filter(item => getPeriod(item.time) === 'Afternoon')
        },
        {
            title: 'Evening',
            data: scheduleTimes.filter(item => getPeriod(item.time) === 'Evening')
        },
    ].filter(section => section.data.length > 0);


    return (
        <View style={styles.screen}>
            {/* Top content */}
            <View style={styles.header}>
                <View style={styles.flexRowCenter}>
                    {/* Back button */}
                    <TouchableOpacity style={{ ...styles.backButton, marginRight: 'auto' }} onPress={() => goBack()}>
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
                {bottomActiveTab === 1 && (
                    <>
                        {isFetched && scheduleTimes.length === 0 ? (
                            <View View style={styles.emptyCalendar}>
                                <FontAwesome name="calendar-times-o" color={'#8c8c8c'} size={60} />
                                <Text style={styles.emptyText}>Chưa có lịch nhắc nhở</Text>
                                <Text style={{ color: '#5f5f5f', fontSize: 15 }}>Thêm thuốc và lịch uống</Text>
                                <Image style={styles.arrow} source={require(`${assetsImageUri}arrow.png`)} />
                            </View>

                        ) : (
                            <SectionList
                                style={styles.list}
                                sections={filteredSections}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={{
                                        ...styles.listItem,
                                        borderColor: item.isUsed === null ? '#d3d3d3' : item.isUsed ? COLORS.toastInfo : COLORS.toastError
                                    }}>
                                        <View style={{ width: '60%' }}>
                                            <Text style={styles.medicineName}>{item.medicineName}</Text>
                                            <Text style={styles.usage}>{`Uống ${item.quantity} ${item.unitName} lúc ${formatDuration(item.time)}`}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {item.isUsed === null && (
                                                <>
                                                    <StatusIcon
                                                        iconName="x-circle-fill"
                                                        iconColor={COLORS.toastError}
                                                        text="Bỏ qua"
                                                        lightColor={true}
                                                        onPress={() => updateStatus({ item, isUsed: false })}
                                                    />
                                                    <StatusIcon
                                                        iconName="check-circle-fill"
                                                        iconColor={COLORS.toastInfo}
                                                        text="Dùng"
                                                        lightColor={true}
                                                        onPress={() => updateStatus({ item, isUsed: true })}
                                                    />
                                                </>
                                            )}
                                            {item.isUsed && (
                                                <StatusIcon
                                                    iconName="check-circle-fill"
                                                    iconColor={COLORS.toastInfo}
                                                    text="Đã dùng"
                                                    onPress={() => updateStatus({ item, isUsed: null })}
                                                />
                                            )}

                                            {item.isUsed === false && (
                                                <StatusIcon
                                                    iconName="x-circle-fill"
                                                    iconColor={COLORS.toastError}
                                                    text="Bỏ qua"
                                                    onPress={() => updateStatus({ item, isUsed: null })}
                                                />
                                            )}
                                        </View>
                                    </View>
                                )}
                                renderSectionHeader={({ section: { title } }) => (
                                    <View style={styles.sectionHeaderContainer}>
                                        <Image source={periods[title].uri} style={styles.sectionImage} />
                                        <Text style={styles.sectionHeader}>{periods[title].label}</Text>
                                        <TouchableOpacity
                                            style={{ marginLeft: 'auto' }}
                                            onPress={() => handleUseAllInSection(title)}>
                                            <Text style={{ fontSize: 14, fontWeight: '500', color: COLORS.textLabel }}>DÙNG TẤT CẢ</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        )}
                    </>
                )}
                {bottomActiveTab === 2 && (
                    <>
                        {isFetched && medicationSchedule.length === 0 ? (
                            <View View style={styles.emptyCalendar}>
                                <FontAwesome name="inbox" color={'#8c8c8c'} size={60} />
                                <Text style={styles.emptyText}>{medActiveTab === 2 ? 'Không có thuốc cũ' : 'Hộp thuốc còn trống'}</Text>
                                <Text style={{ color: '#5f5f5f', fontSize: 15 }}>{medActiveTab === 1 && `Thêm thuốc và lịch uống`}</Text>
                                <Image style={{ ...styles.arrow, opacity: medActiveTab === 1 ? 1 : 0 }} source={require(`${assetsImageUri}arrow.png`)} />
                            </View>

                        ) : (
                            <>
                                <View style={{ ...styles.sectionHeaderContainer, marginTop: 50 }}>
                                    <Text style={styles.sectionHeader}>{medActiveTab === 1 ? 'Thuốc đang uống ' : 'Thuốc cũ '}
                                        {`(${medicationSchedule.length})`}
                                    </Text>
                                </View>
                                <FlatList
                                    style={{ ...styles.list, marginTop: 10 }}
                                    data={medicationSchedule}
                                    renderItem={({ item }) => (
                                        <View style={{ ...styles.listItem, borderColor: '#d3d3d3' }}>
                                            <View style={{ width: '80%' }}>
                                                <Text style={styles.medicineName}>{item.medicineName}</Text>
                                                <Text style={styles.usage}>
                                                    {!item.dateTime ? `Chưa có lịch uống thuốc` : `Liều tiếp theo: ${moment(item.dateTime).format('DD/MM/YYYY, hh:mm A').replace('SA', 'AM').replace('CH', 'PM')}`}
                                                </Text>

                                            </View>
                                            <TouchableOpacity style={{ justifyContent: 'center', marginLeft: 'auto', alignItems: 'center' }} onPress={() => navigateEditSchedule(item.id)}>
                                                <Feather name="chevron-right" size={26} style={styles.editScheduleIcon} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </>
                        )}
                    </>
                )}
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
                            <TouchableOpacity key={option.key} style={styles.popupOption} onPress={() => navigateAddMedicine()}>
                                <Image source={option.uri} style={styles.popupOptionImage} />
                                <Text style={styles.popupOptionTitle}>{option.title}</Text>
                                <Feather name="chevron-right" size={15} color="#a1a2aa" style={styles.arrowIcon} />
                            </TouchableOpacity>
                        ))}

                    </View>
                </>
            )}

            {!isFetched && (
                <Loading transparent={true} animationType="none" />
            )}

            <ToastConfig />
        </View >
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
    },
    list: {
        marginTop: 15,
        width: '100%'
    },
    listItem: {
        borderColor: 'red',
        borderWidth: 1,
        marginHorizontal: 16,
        marginVertical: 7,
        borderRadius: 12,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingBottom: 25,
        paddingLeft: 16,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    medicineName: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 14 * 1.6
    },
    usage: {
        marginTop: 5,
        fontSize: 14,
        color: COLORS.textLabel,
        lineHeight: 14 * 1.6
    },
    icon: {
        fontSize: 24,
        padding: 1,
        borderRadius: 25,

    },
    iconContainer: {
        marginLeft: 15,
        paddingTop: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },
    iconText: {
        marginTop: 5,
        fontSize: 14
    },
    sectionHeader: {
        marginLeft: 7,
        fontSize: 16,
        fontWeight: '500',
    },
    sectionHeaderContainer: {
        marginTop: 17,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    sectionImage: {
        height: 25,
        width: 25,
        resizeMode: 'contain'
    },
    editScheduleIcon: {
        textAlign: 'center'
    }
});

export default MedicationBox;
