import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import HeaderWithBackButton from "../../common/HeaderWithBackButton"
import COLORS from "../../constants/colors"
import Feather from "react-native-vector-icons/Feather";
import { useEffect, useState } from "react";
import BottomSheet from "../../components/BottomSheet";
import DatePicker from "react-native-date-picker";
import moment from "moment/moment";
import { formatDateTimetoTime, formatDuration, formatTime } from "../../config/date";
import Toast from "react-native-toast-message";

const ScheduleTime = ({ route, navigation }) => {
    const localDate = moment().startOf('day').toDate();
    const [scheduleTimes, setScheduleTimes] = useState([])
    const [unitName, setUnitName] = useState('')
    const [showPopup, setShowPopup] = useState(false)
    const [tempSchedule, setTempSchedule] = useState({
        id: 0,
        time: new Date(),
        quantity: 1,
    })

    useEffect(() => {
        if (route.params) {
            setScheduleTimes(route.params.scheduleTimes)
            setUnitName(route.params.unitName)
            console.log(route.params)
        }
    }, [route.params]);

    const togglePopup = () => {
        if (!showPopup) {
            handleOnTimeChange(localDate)
        }
        setShowPopup(!showPopup)
    }

    const createScheduleTime = () => {

        const isDuplicate = scheduleTimes.some(
            (schedule) =>
                schedule.time === formatDateTimetoTime(tempSchedule.time)
        );

        if (isDuplicate) {
            Toast.show({
                type: 'error',
                text1: 'Thời gian nhắc nhở đã tồn tại.'
            });
            return;
        }

        // Add the new schedule time to the array and sort
        setScheduleTimes((prevScheduleTimes) =>
            [...prevScheduleTimes, {
                id: tempSchedule.id,
                quantity: tempSchedule.quantity,
                time: formatDateTimetoTime(tempSchedule.time)
            }]
                .sort((a, b) => a.time.localeCompare(b.time))
        );


        // Reset tempSchedule
        setTempSchedule({
            id: 0,
            time: new Date(),
            quantity: 1,
        });

        // Close the popup
        togglePopup();
    };



    const handleRemoveSchedule = (index) => {
        // Implement the logic to remove the schedule at the specified index
        const updatedScheduleTimes = [...scheduleTimes];
        updatedScheduleTimes.splice(index, 1);
        setScheduleTimes(updatedScheduleTimes);
    };

    const saveScheduleTime = () => {
        if (route.params && route.params.setScheduleTimes) {
            route.params.setScheduleTimes({ scheduleTimes })
        }
        navigation.goBack()
    }

    const handleOnTimeChange = (time) => {
        setTempSchedule({ ...tempSchedule, time: time })
    }

    return (
        <View style={styles.content}>
            <View style={styles.topContainer}>
                <HeaderWithBackButton title={'Thời gian dùng thuốc'} />
            </View>
            <ScrollView style={styles.centerContainer}>
                <View style={{ ...styles.input, marginHorizontal: 16, height: 'auto', paddingVertical: 16, }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => togglePopup()}>
                        <Feather name="plus-circle" size={20} color={'#2c85f3'} />
                        <Text style={{ marginLeft: 10, color: '#2c85f3', fontWeight: '500' }}>{'Thêm liều uống và thời gian'}</Text>
                    </TouchableOpacity>

                    {scheduleTimes.length > 0 && (
                        scheduleTimes.map((s, index) => (
                            <View key={index}>
                                <View style={styles.line}></View>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => handleRemoveSchedule(index)}>
                                    <Feather name="minus-circle" size={20} color={'#f64236'} />
                                    <Text style={{ marginLeft: 10 }}>
                                        {formatDuration(s.time)}
                                    </Text>
                                    <Text style={{ marginLeft: 'auto', fontWeight: '500' }}>{`${s.quantity} ${unitName}`}</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={{
                    ...styles.buttonNext, marginTop: 15,
                    backgroundColor: `${scheduleTimes.length === 0 ? 'rgba(83, 82, 237, 0.5)' : COLORS.primary}`
                }}
                    onPress={() => saveScheduleTime()}
                    disabled={scheduleTimes.length === 0}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>
            {/* BottomPopUp */}
            <BottomSheet visible={showPopup} onClose={() => togglePopup()}>
                <View>
                    {/* Popup Header */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.popupTitle}>Thêm liều uống và thời gian</Text>
                        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => togglePopup()}>
                            <Feather name="x" size={24} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}></View>
                    {/* Popup Body */}
                    <Text style={styles.label}>Thời gian</Text>
                    <DatePicker
                        mode="time"
                        date={localDate}
                        onDateChange={(time) => handleOnTimeChange(time)}
                        androidVariant="nativeAndroid"
                        locale="en"
                        textColor={COLORS.textLabel}
                        style={{
                            flex: 1, justifyContent: 'center', alignSelf: 'center'
                        }}
                    />
                    <Text style={styles.label}>Liều uống</Text>
                    <View style={{ ...styles.input, height: 'auto', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: COLORS.textLabel }}>{'Uống'}</Text>
                            <TouchableOpacity style={{ marginLeft: 'auto' }}
                                onPress={() => setTempSchedule({ ...tempSchedule, quantity: Math.max(tempSchedule.quantity - 1, 1) })}>
                                <Feather name="minus-circle" size={20} color={COLORS.textLabel} />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 10, fontSize: 20 }}>{tempSchedule.quantity}</Text>
                            <TouchableOpacity style={{ marginRight: 'auto' }}
                                onPress={() => setTempSchedule({ ...tempSchedule, quantity: tempSchedule.quantity + 1 })}>
                                <Feather name="plus-circle" size={20} color={COLORS.textLabel} />
                            </TouchableOpacity>
                            <Text style={{ color: COLORS.textLabel }}>{unitName}</Text>
                        </View>
                    </View>
                    {/* Popup Footer */}
                    <TouchableOpacity style={styles.buttonNext}
                        onPress={() => createScheduleTime()}>
                        <Text style={styles.buttonText}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </View>
    )
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    topContainer: {
        backgroundColor: 'white',
        padding: 10,
    },
    centerContainer: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: 'white',
    },
    bottomContainer: {
        height: 80,
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        height: 100,
    },
    buttonNext: {
        marginTop: 30,
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 5,
        marginBottom: 15
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: "white",
        height: 48,
        justifyContent: 'center'
    },
    line: {
        width: '100%',
        borderBottomColor: 'gray',
        borderWidth: 0.3,
        opacity: 0.2,
        marginVertical: 16,
    },
    text: {
        fontSize: 16,
        color: COLORS.textLabel,
        fontWeight: '500'
    },
    popupTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.textLabel,
        fontWeight: 'bold',
        marginLeft: 'auto'
    },
    label: {
        color: COLORS.textLabel,
        fontSize: 14,
        fontWeight: "bold",
        marginHorizontal: 16
    },
})
export default ScheduleTime