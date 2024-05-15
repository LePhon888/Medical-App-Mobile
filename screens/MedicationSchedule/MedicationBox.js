import React, { memo, useEffect, useState } from "react";
import { FlatList, Image, Modal, SectionList, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import HorizontalDateSlider from "../../components/HorizontalDateSlider";
import Apis, { endpoints } from "../../config/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import COLORS from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { formatDateMoment, formatDateTimeFromNow, formatDuration } from "../../config/date";
import Loading from "../../components/Loading";
import Toast from "react-native-toast-message";
import { getUserFromStorage } from "../../utils/GetUserFromStorage";
import { useUser } from "../../context/UserContext";
import StatusIcon from "../../components/MedicationReminder/StatusIcon";

const MedicationBox = ({ navigation, route }) => {
    const [bottomActiveTab, setBottomActiveTab] = useState(1);
    const [medActiveTab, setMedActiveTab] = useState(1);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedMoment, setSelectedMoment] = useState(moment())
    const [scheduleTimes, setScheduleTimes] = useState([])
    const [medicationSchedule, setMedicationSchedule] = useState([])
    const [visibleSections, setVisibleSections] = useState({});
    const { userId } = useUser()

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
        { key: 1, title: 'Thuốc theo toa', uri: require(`${assetsImageUri}prescription.png`), screen: 'AddGroupMedicine' },
        { key: 2, title: 'Thuốc', uri: require(`${assetsImageUri}drugs.png`), screen: 'AddMedicine' },
    ];

    const navigateAddMedicine = (screen) => {
        navigation.navigate(screen)
        setPopupVisible(false)
    }

    const navigateAddGroupMedicine = (id) => {
        navigation.navigate('AddGroupMedicine', { id: id })
    }

    const navigateEditSchedule = (id) => {
        navigation.navigate('MedicationSchedule', { id })
    }

    const defaultColor = '#a3a3a3';
    const activeColor = COLORS.primary;

    const goBack = () => {
        navigation.goBack()
    }

    const navigateHistoryMedication = () => {
        navigation.navigate('HistoryMedication')
    }

    // Toggle visibility of a section
    const toggleSectionVisibility = (title) => {
        setVisibleSections(prevState => ({
            ...prevState,
            [title]: !prevState[title]  // Toggle the current state for the title
        }));
    };

    const getscheduleTimes = async () => {
        try {
            setFetched(false);
            const scheduleTimes = await Apis.get(`${endpoints["scheduleTime"]}/user/${userId}?startDate=${formatDateMoment(selectedMoment)}`)
            setScheduleTimes(scheduleTimes.data)
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error,
            })
            console.error(error)
        } finally {
            setFetched(true);
        }
    }

    const formatDataIntoSections = (data) => {
        const groups = data.reduce((acc, item) => {
            const groupName = item.groupName ?? 'Thuốc lẻ'; // Default group if groupName is not provided
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(item);
            return acc;
        }, {});

        return Object.keys(groups).map(key => ({ title: key, data: groups[key] }));
    };

    const getMedicationSchedule = async () => {
        try {
            const res = await Apis.get(`${endpoints["medicationSchedule"]}/user/${userId}?isActive=${medActiveTab === 1}`)
            const sectionedData = formatDataIntoSections(res.data);
            console.log(sectionedData)
            setMedicationSchedule(sectionedData)
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error
            })
        }
    }

    useEffect(() => {
        if (route.params) {
            const saveScheduleSuccess = route.params.saveScheduleSuccess
            const startDate = route.params.startDate

            if (saveScheduleSuccess) {
                if (bottomActiveTab === 2)
                    getMedicationSchedule()
                else {
                    setMedActiveTab(1)
                    setBottomActiveTab(2)
                }
            }

            if (startDate) {
                console.log('moment(startDate)', moment(startDate))
                setSelectedMoment(moment(startDate))
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

    useEffect(() => {
        const initialVisibilityStates = medicationSchedule.reduce((acc, item) => {
            acc[item.title] = true; // Set each title as a key with value `true`
            return acc;
        }, {});
        setVisibleSections(initialVisibilityStates);
    }, [medicationSchedule]);



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
                    <TouchableOpacity style={{ ...styles.backButton, marginLeft: 'auto' }} onPress={() => navigateHistoryMedication()}>
                        <FontAwesome name='history' size={20} color={'white'} />
                    </TouchableOpacity>
                </View>
                {bottomActiveTab === 1 && <HorizontalDateSlider selectedMoment={selectedMoment} onSelectDate={(m) => setSelectedMoment(m)} />}
                {bottomActiveTab === 2 && (
                    <View style={styles.medTabContainer}>
                        {medTabs.map((t) => (
                            <TouchableOpacity
                                key={t.key} style={[styles.medTab, { backgroundColor: medActiveTab === t.key ? COLORS.primary : 'white' }]}
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
                                        borderColor: item.isUsed === null ? '#ccc' : item.isUsed ? COLORS.toastInfo : COLORS.toastError,
                                        borderWidth: 0.4
                                    }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.medicineName}>{item.medicineName}</Text>
                                            <Text style={styles.usage}>{`Uống ${item.quantity} ${item.unitName} lúc ${formatDuration(item.time)}`}</Text>
                                            <View style={styles.groupTag}>
                                                <Text style={styles.groupText}>{item.groupName ?? 'Thuốc lẻ'}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {item.isUsed === null && (
                                                <>
                                                    <StatusIcon
                                                        iconName="x-circle"
                                                        iconColor={COLORS.toastError}
                                                        text="Bỏ qua"
                                                        onPress={() => updateStatus({ item, isUsed: false })}
                                                    />
                                                    <StatusIcon
                                                        style={{ marginLeft: 16 }}
                                                        iconName="check-circle"
                                                        iconColor={COLORS.toastInfo}
                                                        text="Dùng"
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
                                            <Text style={{ fontSize: 14, fontWeight: '500', color: '#898484' }}>DÙNG TẤT CẢ</Text>
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
                                <SectionList
                                    style={{ ...styles.list, marginTop: 30 }}
                                    sections={medicationSchedule}
                                    keyExtractor={(item, index) => index}
                                    renderSectionHeader={({ section: { title, data } }) => (
                                        <View style={[styles.sectionHeaderContainer]}>
                                            <TouchableOpacity style={styles.flexRowCenter} onPress={() => toggleSectionVisibility(title)}>
                                                <Ionicons
                                                    name={visibleSections[title] ? 'chevron-down-circle-sharp' : 'chevron-up-circle-sharp'}
                                                    size={24}
                                                    color={COLORS.primary}
                                                />
                                                <Text style={styles.sectionHeader}>{title} ({data.length})</Text>
                                            </TouchableOpacity>
                                            {data[0].groupId &&
                                                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => navigateAddGroupMedicine(data[0].groupId)}>
                                                    <Text style={{ fontWeight: 500, fontSize: 12, color: COLORS.textLabel }}>
                                                        {'SỬA'}
                                                    </Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    )}
                                    renderItem={({ item, section }) => {
                                        if (visibleSections[section.title]) {
                                            return (
                                                <View style={{ ...styles.listItem, borderColor: '#d3d3d3' }} key={item.id}>
                                                    <View>
                                                        <Text style={styles.medicineName}>{item.medicineName}</Text>
                                                        <Text style={styles.usage}>
                                                            {!item.dateTime ? `Chưa có lịch uống thuốc` : `Liều tiếp theo: ${formatDateTimeFromNow(item.dateTime)}`}
                                                        </Text>

                                                    </View>
                                                    <TouchableOpacity style={{ justifyContent: 'center', marginLeft: 'auto', alignItems: 'center' }} onPress={() => navigateEditSchedule(item.id)}>
                                                        <Feather name="chevron-right" size={26} style={styles.editScheduleIcon} />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                        return null
                                    }}
                                />
                            </>
                        )}
                    </>
                )}
            </View>

            {/* bottom content */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={{ ...styles.floatingButton }} onPress={() => setPopupVisible(true)}>
                    <FontAwesome name="plus" size={20} color="white" />
                </TouchableOpacity>
                {/* tabs view */}
                <View style={styles.tabContainer}>
                    {bottomTabs.map((t) => (
                        <TouchableOpacity key={t.key} style={styles.tab} onPress={() => setBottomActiveTab(t.key)}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                {t.key === 1 ? (
                                    <FontAwesome name="calendar-check-o" size={18} color={bottomActiveTab === t.key ? activeColor : defaultColor} />
                                ) : (
                                    <FontAwesome name="medkit" size={18} color={bottomActiveTab === t.key ? activeColor : defaultColor} />
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
                        <FontAwesome name="close" size={20} color="white" />
                    </TouchableOpacity>
                    {/* Overlay */}
                    <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    {/* Popup content */}
                    <View style={styles.popupContainer}>
                        <Text style={styles.popupTitle}>Bạn muốn thêm...</Text>
                        {popupOptions.map((option) => (
                            <TouchableOpacity key={option.key} style={styles.popupOption} onPress={() => navigateAddMedicine(option.screen)}>
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
        </View >
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.primary,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: 5,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        padding: 5,
        borderRadius: 8,
    },
    headerTitle: {
        color: 'white', fontWeight: '500', fontSize: 18
    },
    bottomContainer: {
        backgroundColor: '#fafafa',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
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
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 4,
    },
    floatingButton: {
        position: 'absolute',
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
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
    arrow: {
        marginRight: 55
    },
    list: {
        marginTop: 15,
        width: '100%'
    },
    listItem: {
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
    },
    groupTag: {
        marginTop: 12,
        backgroundColor: '#f8f9fd',
        marginRight: 'auto',
        borderRadius: 99,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    groupText: {
        color: COLORS.textLabel,
        fontWeight: '300',
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
        textAlign: 'center',
    },
});

export default MedicationBox;
