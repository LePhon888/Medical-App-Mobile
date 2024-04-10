import { useEffect, useState } from "react";
import Apis, { endpoints } from "../config/Apis";
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    Button,
    SectionList,
    SafeAreaView,
} from "react-native";
import { TextInput } from 'react-native-paper';
import moment from "moment/moment";
import COLORS from "../constants/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../common/Header";
import { useUser } from "../context/UserContext";
import DateRangePicker from "../components/DateRangePicker";
import { formatDateMoment } from "../config/date";
import Loading from "../components/Loading";

const DoctorAppointment = () => {
    const [tempList, setTempList] = useState([])
    const [appointment, setAppointment] = useState([]);
    const [isVisible, setVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchText, setSearchText] = useState('');
    const { userId } = useUser()
    const currentDate = new Date()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(currentDate.setDate(currentDate.getDate() + 3))
    const [isFetched, setFetched] = useState(false)

    useEffect(() => {
        const getUserAndToken = async () => {
            try {
                setFetched(false)
                const tokenInfo = await AsyncStorage.getItem("accessToken");
                if (userId && tokenInfo) {
                    const e = `${endpoints["appointment"]}/doctor/${userId}?startDate=${formatDateMoment(moment(startDate))}&endDate=${formatDateMoment(moment(endDate))}`;
                    const res = await Apis.get(e, {
                        headers: { Authorization: `Bearer ${tokenInfo}` },
                    });

                    const groupedData = res.data.reduce((acc, item) => {
                        const date = item.date;
                        if (!acc[date]) {
                            acc[date] = [];
                        }
                        acc[date].push(item);
                        return acc;
                    }, {});

                    // Convert grouped data to SectionList format
                    const sections = Object.keys(groupedData).map((date) => ({
                        title: date,
                        data: groupedData[date],
                    }));

                    setAppointment(sections);
                    setTempList(sections)
                    console.log(sections)
                }
            } catch (error) {
                console.error(error);
            } finally {
                setFetched(true)
            }
        };

        getUserAndToken();
    }, [userId, startDate, endDate]);

    const removeDiacritics = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const onChangeSearchText = (text) => {
        const searchTextWithoutDiacritics = removeDiacritics(text);
        setSearchText(text);

        // Perform search and update tempList state
        const filteredAppointments = appointment.map((section) => ({
            title: section.title,
            data: section.data.filter((item) =>
                removeDiacritics(item.patientName.toLowerCase()).includes(searchTextWithoutDiacritics.toLowerCase())
            ),
        })).filter((section) => section.data.length > 0);

        setTempList(filteredAppointments);
    };


    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker)
    };

    const onSelectedDateRange = (startDate, endDate) => {
        setStartDate(startDate)
        setEndDate(endDate)
        if (startDate && endDate) {
            toggleDatePicker()
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={'Danh sách lịch khám'} />
            {/* Filter view */}
            <View style={styles.filterView}>
                <View style={styles.flexCenter}>
                    <TextInput
                        style={styles.searchIpnut}
                        placeholder={'Tìm theo tên bệnh nhân'}
                        contentStyle={{ marginLeft: 45, verticalAlign: 'middle', paddingTop: 0, paddingBottom: 0 }}
                        mode="outlined"
                        outlineColor={COLORS.grey}
                        activeOutlineColor={COLORS.grey}
                        outlineStyle={{ borderRadius: 15, borderWidth: 1 }}
                        value={searchText}
                        onChangeText={(text) => onChangeSearchText(text)}
                        left={<TextInput.Icon icon="magnify" disabled size={20} style={{ marginLeft: 0, backgroundColor: 'transparent' }} />}
                        right={<TextInput.Icon icon="close-circle" size={20} onPress={() => onChangeSearchText('')} />}
                    />
                    <TouchableOpacity style={styles.calenderIcon} onPress={toggleDatePicker}>
                        <Icon size={20} name="calendar" />
                    </TouchableOpacity>
                </View>
                {startDate && endDate && (
                    <View style={{ ...styles.flexCenter, marginTop: 15, marginLeft: 5 }}>
                        <Text style={styles.displayDateRange}>
                            {`${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`}
                        </Text>
                        <TouchableOpacity onPress={() => { onSelectedDateRange(null, null); setSearchText('') }}>
                            <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                )}
                {isFetched && tempList.length === 0 && <Text style={styles.reason}>Không tìm thấy lịch khám...</Text>}
            </View>

            <SectionList
                style={styles.list}
                showsVerticalScrollIndicator={false}
                sections={tempList}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item, index }) => (
                    <View style={styles.listItem} key={index}>
                        <Image source={{
                            uri: item.patientImageUrl ? item.patientImageUrl :
                                'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80'
                        }} style={styles.patientAvatar} />
                        <View style={styles.patientInfo}>
                            <View style={styles.flexCenter}>
                                <Text style={styles.patientName}>{item.patientName}</Text>
                                <View style={styles.hourContainer}>
                                    <Image source={require('../assets/images/chronometer.png')} style={{ width: 16, height: 16, marginRight: 2 }} />
                                    <Text style={styles.hourText}>{item.hour}</Text>
                                </View>
                            </View>
                            <Text style={styles.reason}>{'Lý do khám: ' + item.reason}</Text>
                        </View>
                    </View>
                )}
                renderSectionHeader={({ section: { title }, }) => {
                    return (
                        <Text style={{ ...styles.sectionTitle, marginTop: tempList.length > 0 && tempList[0].title === title ? 0 : 15 }}>
                            {moment(title).format('DD/MM/YYYY')}
                        </Text>
                    );
                }}
            />
            {showDatePicker && (
                <DateRangePicker
                    startDateIn={startDate}
                    endDateIn={endDate}
                    onSelectedDateRange={onSelectedDateRange}
                    style={{
                        top: 110,
                        right: 0,
                    }} />
            )}

            {!isFetched && <Loading transparent={true} />}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 60,
    },
    flexCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 20,
        padding: 10,
        marginBottom: 10,
        color: "white",
        backgroundColor: COLORS.primary,
    },
    filterView: {
        marginTop: 10,
        marginHorizontal: 10,
    },
    calenderIcon: {
        marginLeft: 'auto',
        fontSize: 20,
    },
    searchIpnut: {
        backgroundColor: 'white',
        paddingVertical: 0,
        width: '90%',
        height: 46,
        fontSize: 14
    },
    displayDateRange: {
        color: COLORS.textLabel,
        fontWeight: '400',
        fontSize: 13,
        marginRight: 10
    },
    list: {
        flex: 1,
        marginTop: 20
    },
    listItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 6,
        borderWidth: 0.8,
        borderColor: COLORS.grey,
        marginHorizontal: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    patientAvatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },
    patientName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 3,
    },
    hourContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto'
    },
    hourText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#464646",
    }
    ,
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 16,
        marginBottom: 10,
    },
    patientInfo: {
        flex: 1,
    },
    reason: {
        marginTop: 3,
        lineHeight: 14 * 1.5,
    }
});

export default DoctorAppointment;
