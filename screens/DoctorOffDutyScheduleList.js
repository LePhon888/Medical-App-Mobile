import { Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import HeaderWithBackButton from "../common/HeaderWithBackButton"
import Button from "../components/Button"
import COLORS from "../constants/colors"
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import CenterSheet from "../components/CenterSheet";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
import Apis, { endpoints } from "../config/Apis";
import { useUser } from "../context/UserContext";
import { formatDateMoment } from "../config/date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../components/Loading";
import ToastConfig from "../components/ToastConfig";
import { ActivityIndicator } from "react-native-paper";
const DoctorOffDutyScheduleList = ({ navigation }) => {

    const [deletedId, setDeletedId] = useState(null)
    const [data, setData] = useState([])
    const isFocused = useIsFocused();
    const { userId } = useUser()
    const currentDate = new Date()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(currentDate.setDate(currentDate.getDate() + 3))
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [fetchData, setFetchData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([])

    const formatData = (list) => {
        return list.reduce((acc, item) => {
            const existingSection = acc.find(section => section.title === item.date);
            if (existingSection) {
                existingSection.data.push({ id: item.id, hour: item.hour });
            } else {
                acc.push({ title: item.date, data: [{ id: item.id, hour: item.hour }] });
            }
            return acc;
        }, []);
    };

    const getData = async () => {
        try {
            setFetchData(false)
            let e = `${endpoints["appointment"]}/off-duty?doctorId=${userId}`
            const accessToken = await AsyncStorage.getItem("accessToken");

            if (startDate) {
                e += `&fromDate=${formatDateMoment(moment(startDate))}`
            }

            if (endDate) {
                e += `&toDate=${formatDateMoment(moment(endDate))}`

            }
            const res = await Apis.get(e, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            setList(res.data)
            setData(formatData(res.data))
        } catch (error) {
            console.error(error)
        } finally {
            setFetchData(true)
        }
    }

    useEffect(() => {
        if (isFocused) {
            getData()
        }
    }, [isFocused, startDate, endDate])


    const formatTime = (time) => {
        return moment(time, 'HH:mm').locale('en').format('hh:mm A');
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
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

    const toggleConfirmPopup = (id) => {
        setDeletedId(id)
        setShowConfirmPopup(id !== null)
    }

    const deleteById = (idToDelete) => {
        const indexToDelete = list.findIndex(appointment => appointment.id === idToDelete);
        if (indexToDelete !== -1) {
            list.splice(indexToDelete, 1);
        }
        return list;
    };

    const confirmToDelete = async (id) => {
        try {
            const accessToken = await AsyncStorage.getItem("accessToken");
            setLoading(true)
            await Apis.delete(`${endpoints["appointment"]}/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            const updatedList = deleteById(id)
            setList(updatedList)
            setData(formatData(updatedList))
            toggleConfirmPopup(null)
            Toast.show({
                type: 'success',
                text1: 'Xóa thành công!'
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)

        }
    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <HeaderWithBackButton
                    title={"Danh sách lịch nghỉ"}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('DoctorCreateOffDutySchedule')}
                    style={styles.addButton}>
                    <Text style={styles.addText}>{'Thêm'}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 16, backgroundColor: '#fafafa', }}>
                {startDate && endDate && (
                    <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 5 }}>
                        <Text style={styles.displayDateRange}>
                            {`${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`}
                        </Text>
                        <TouchableOpacity onPress={() => { onSelectedDateRange(null, null) }}>
                            <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity style={styles.calenderIcon} onPress={toggleDatePicker}>
                    <Icon size={20} name="calendar" />
                </TouchableOpacity>

            </View>

            <View style={styles.mainContent}>
                {fetchData ?
                    data.length === 0 ?
                        <View View style={styles.emptyCalendar}>
                            <Icon name="calendar-times-o" color={'#8c8c8c'} size={60} />
                            <Text style={styles.emptyText}>Danh sách trống</Text>
                        </View>
                        : <View style={styles.list}>
                            <SectionList
                                sections={data}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item }) =>
                                    <View style={styles.item}>
                                        <View style={styles.verticalLine} />
                                        <Text style={styles.itemText}>{formatTime(item.hour)}</Text>
                                        <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 8 }} >
                                            <Icon
                                                onPress={() => toggleConfirmPopup(item.id)}
                                                color={COLORS.toastError}
                                                name="trash-o"
                                                size={24}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                }
                                renderSectionHeader={({ section: { title } }) => (
                                    <Text style={styles.itemHeader}>{formatDate(title)}</Text>
                                )}

                            />
                        </View>
                    : <View style={{ marginTop: 32 }}>
                        <ActivityIndicator animating={true} />
                    </View>
                }


                <CenterSheet
                    style={{ marginHorizontal: 16 }}
                    visible={showConfirmPopup}
                    onClose={() => toggleConfirmPopup(null)}>
                    <View>
                        <View style={{ marginBottom: 24 }}>
                            <Image
                                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh_rq04PD0BPCqF5Gg_rDJtXYIHQFL45Za-A&s' }}
                                style={{ width: 72, height: 72, marginLeft: 'auto', marginRight: 'auto', marginTop: 16 }}
                            />
                        </View>

                        <Text style={{ marginHorizontal: 16, textAlign: 'center', fontWeight: '600', color: COLORS.textLabel }}>{'Bạn có chắc chắn muốn xóa lịch nghỉ này?'}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 32, }}>
                            <TouchableOpacity style={{ ...styles.btn, borderColor: COLORS.toastInfo }} onPress={() => toggleConfirmPopup(null)}>
                                <Text style={{ ...styles.btnText, color: COLORS.toastInfo }}>{'Đóng'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => confirmToDelete(deletedId)}
                                style={{ ...styles.btn, backgroundColor: '#dc2020', borderWidth: 0 }}>
                                <Text style={{ ...styles.btnText, color: COLORS.white, }}>{'Xác nhận'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </CenterSheet>

                {showDatePicker && (
                    <DateRangePicker
                        startDateIn={startDate}
                        endDateIn={endDate}
                        onSelectedDateRange={onSelectedDateRange}
                        style={{
                            top: 10,
                            right: 0,
                        }} />
                )}

                {loading && <Loading transparent={true} />}
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',

        flexDirection: 'row',
        alignItems: 'center',
    },
    mainContent: {
        paddingHorizontal: 16,
        backgroundColor: '#fafafa',
        flex: 1,
    },
    calenderIcon: {
        marginLeft: 'auto',
        fontSize: 20,
        marginRight: 16,
    },
    displayDateRange: {
        color: COLORS.textLabel,
        fontWeight: '400',
        fontSize: 13,
        marginRight: 10
    },
    emptyCalendar: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 30,
    },
    emptyText: {
        color: '#5f5f5f',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 12,
        marginBottom: 15,
    },
    btn: {
        borderWidth: 1,
        borderRadius: 16,
        flex: 1,
        marginHorizontal: 8,
    },
    btnText:
        { textAlign: 'center', padding: 8, fontSize: 16, fontWeight: 'bold' },

    addButton: { borderColor: COLORS.toastInfo, borderWidth: 1, borderRadius: 16, margin: 12, marginLeft: 'auto', },
    addText: { padding: 12, fontSize: 16, fontWeight: '600', color: COLORS.toastInfo },
    list: {
    },
    textStyle: {
        fontWeight: '600'
    },
    itemHeader: {
        marginTop: 16,
        marginBottom: 12,
        fontWeight: '600',
        fontSize: 16,
        color: COLORS.textLabel
    },
    verticalLine: {
        width: 5,
        height: '100%',
        backgroundColor: COLORS.toastError,
        marginRight: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
        backgroundColor: COLORS.white
    },
    itemText: {
        fontSize: 16,
        paddingVertical: 16,
    }
})
export default DoctorOffDutyScheduleList