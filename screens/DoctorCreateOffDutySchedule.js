import { ScrollView, StyleSheet, Text, View } from "react-native"
import HeaderWithBackButton from "../common/HeaderWithBackButton"
import COLORS from "../constants/colors"
import InputWithRightIcon from "../components/InputWithRightIcon"
import { useEffect, useState } from "react"
import moment from "moment"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import CenterSheet from "../components/CenterSheet"
import CheckBox from "../components/CheckBox"
import Button from "../components/Button"
import Apis, { endpoints } from "../config/Apis"
import { useUser } from "../context/UserContext"
import { formatDateMoment } from "../config/date"
import Toast from "react-native-toast-message"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Loading from "../components/Loading"
import { ActivityIndicator } from "react-native-paper"

const DoctorCreateOffDutySchedule = ({ navigation }) => {
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [selectedDate, setSelectedDate] = useState(moment().toDate())
    const { userId, storeUserId } = useUser()
    const [loading, setLoading] = useState(false)
    const [fetchData, setFetchData] = useState(true);


    const [listHour, setListHour] = useState([])

    const toggleShowDatePicker = () => {
        setShowDatePicker(!showDatePicker)
    }

    const onSelectedDate = (event, selectedDate) => {
        toggleShowDatePicker()
        setSelectedDate(moment(selectedDate).toDate())
    }

    const toggleCheckBox = (id) => {
        const updatedList = listHour.map(item =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        );
        setListHour(updatedList);
    };

    const save = async () => {
        try {

            const checkItems = listHour.filter(item => item.isChecked)
            const accessToken = await AsyncStorage.getItem("accessToken");

            if (checkItems.length === 0) {
                return Toast.show({
                    type: 'error',
                    text1: 'Vui chọn giờ đăng ký.'
                })
            }

            setLoading(true)
            const res = await Apis.post(`${endpoints["appointment"]}/off-duty`, {
                date: formatDateMoment(moment(selectedDate)),
                doctorId: userId,
                hourIds: checkItems.map(item => item.id).join('#')
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })

            if (res.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Đăng ký lịch thành công!'
                })
                navigation.goBack()
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getOffDutyHours = async () => {
            try {
                setFetchData(false)
                const res = await Apis.get(`${endpoints["hours"]}/off-duty?doctorId=${userId}&date=${formatDateMoment(moment(selectedDate))}`)
                const data = res.data.map(item => ({
                    ...item,
                    isChecked: false
                }));
                setListHour(data);
            } catch (err) {
                console.error(err)
            } finally {
                setFetchData(true)
            }
        }
        getOffDutyHours()
    }, [selectedDate])

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <HeaderWithBackButton
                    title={"Thêm lịch bận"}
                />
            </View>
            <ScrollView style={styles.form}>
                <View style={styles.container}>
                    <Text style={styles.label}>{'Ngày đăng ký '}
                        <Text style={{ fontSize: 10 }}>{' (Bắt buộc)'}</Text>
                    </Text>
                    <InputWithRightIcon
                        placeholder={'Chọn ngày'}
                        value={moment(selectedDate).format('DD/MM/YYYY')}
                        iconName="calendar"
                        editable={false}
                        onPress={() => toggleShowDatePicker()}
                        onChangeText={(text) => { }}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.label}>{'Giờ đăng ký '}
                        <Text style={{ fontSize: 10 }}>{' (Bắt buộc)'}</Text>
                    </Text>
                    <View style={styles.listHour}>
                        {fetchData ?
                            listHour.map((item, index) => (
                                <View key={index} style={styles.listItem}>
                                    <CheckBox
                                        checked={item.isChecked}
                                        onPress={() => toggleCheckBox(item.id)}
                                    />
                                    <Text style={styles.itemLabel}>{item.hour}</Text>
                                </View>
                            ))
                            : <ActivityIndicator animating={true} style={{ paddingHorizontal: '50%' }} />
                        }
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="Lưu" filled onPress={() => save()} />
            </View>

            {loading && <Loading transparent={true} />}

            {showDatePicker && (
                <RNDateTimePicker
                    value={selectedDate}
                    minimumDate={new Date()}
                    onChange={onSelectedDate}
                />
            )}


        </View>
    )


}
const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',

    },
    screen: {
        backgroundColor: COLORS.white,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    form: {
        padding: 16,
        flex: 1,
        paddingBottom: 100,
        backgroundColor: '#fafafa'
    },
    container: {
        marginVertical: 10,
    },
    label: {
        color: COLORS.textLabel,
        fontSize: 14,
        fontWeight: "bold"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 16,
        marginTop: 10,
        backgroundColor: "white",
        height: 48,
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listHour: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 0.8,
        paddingLeft: 8,
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    itemLabel: {
        marginLeft: 8,
        fontSize: 14,
    },
    buttonContainer: {
        marginVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
})
export default DoctorCreateOffDutySchedule 