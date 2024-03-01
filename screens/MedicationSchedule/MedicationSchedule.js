import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import HeaderWithBackButton from "../../common/HeaderWithBackButton"
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import COLORS from "../../constants/colors"
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../config/Apis";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import BottomSheet from "../../components/BottomSheet";
import Toast from "react-native-toast-message";
import ToastConfig from "../../config/Toast";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDate, formatDateMoment, formatDateTimetoTime, formatDuration } from "../../config/date";
import { Switch } from "react-native-paper";
import { ScrollView } from "react-native";


const InputItem = ({ titleLeft, titleRight, includeBottomLine, onPress }) => {
    return (
        <>
            <TouchableOpacity style={styles.flexRowCenter} onPress={onPress}>
                <Text style={styles.text}>{titleLeft}</Text>
                <View style={{ ...styles.flexRowCenter, marginLeft: 'auto' }}>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>{titleRight}</Text>
                    <Feather name="chevron-right" size={20} />
                </View>
            </TouchableOpacity>
            {includeBottomLine && <View style={styles.line}></View>}
        </>
    );
}

const MedicationSchedule = ({ navigation, route }) => {

    const [unitList, setUnitList] = useState([])
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showUnitPopup, setShowUnitPopup] = useState(false)
    const [showFrequencyPopup, setShowFrequencyPopup] = useState(false)
    const [isSubmitted, setSubmitted] = useState(false)
    const [isFetched, setFetched] = useState(false)

    const [schedule, setSchedule] = useState({
        id: 0,
        userId: 1,
        medicine: null,
        medicineUnit: null,
        startDate: moment().toDate(),
        frequency: 1,
        selectedDays: null,
        scheduleTimes: [],
        isActive: true,

    });

    const [tempSchedule, setTempSchedule] = useState({
        medicineUnit: null,
        frequency: null,
        selectedDays: [],
    });

    const frequencyOptions = [
        { key: 1, label: 'Mỗi ngày' },
        { key: 2, label: 'Cách số ngày' },
        { key: 3, label: 'Ngày cụ thể trong tuần' }
    ]

    const selectedDaysOptions = [
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 },
        { key: 6 },
        { key: 7 },
        { key: 1 }
    ]

    useEffect(() => {
        const getData = async () => {
            try {
                setFetched(false);
                const user = await AsyncStorage.getItem("user");
                const units = await Apis.get(`${endpoints["medicineUnit"]}/`);
                setUnitList(units.data);

                if (route.params) {
                    const { id, medicine } = route.params;

                    if (id) {
                        const [schedule, scheduleTimes] = await Promise.all([
                            Apis.get(`${endpoints["medicationSchedule"]}/${id}`),
                            Apis.get(`${endpoints["scheduleTime"]}/medication-schedule/${id}`),
                        ]);

                        console.log(schedule.data)

                        setSchedule({
                            ...schedule.data,
                            startDate: moment(schedule.data.startDate).toDate(),
                            selectedDays: schedule.data.selectedDays && schedule.data.selectedDays.split(',').map(Number),
                            scheduleTimes: scheduleTimes.data,
                            id: id
                        });
                    } else {
                        setSchedule((prevSchedule) => ({
                            ...prevSchedule,
                            medicineUnit: units.data[0],
                            medicine: medicine,
                            userId: JSON.parse(user)?.id || 2,
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setFetched(true);
            }
        };

        if (route.params?.updatedSchedule) {
            console.log(route.params)
            setFetched(false);
            setSchedule(route.params.updatedSchedule);
            setUnitList(route.params.unitList)
            setFetched(true);
        } else {
            getData();
        }
    }, [route.params]);




    const getFrequencyText = (frequency, selectedDays) => {
        if (frequency === 1) {
            return frequencyOptions.at(0).label
        } else if (frequency && frequency > 1) {
            return frequencyOptions.at(1).label
        } else if (selectedDays) {
            return frequencyOptions.at(2).label
        }
    }

    const toggleShowDatePicker = () => {
        setShowDatePicker(!showDatePicker)
    }

    const navigateToAddMedicine = () => {
        navigation.navigate('AddMedicine', { schedule: schedule, unitList: unitList })
    }

    const navigateScheduleTime = () => {
        navigation.navigate('ScheduleTime',
            {
                scheduleTimes: schedule.scheduleTimes,
                unitName: schedule.medicineUnit.name,
                setScheduleTimes: setScheduleTimes
            })
    }

    const setScheduleTimes = ({ scheduleTimes }) => {
        setSchedule({ ...schedule, scheduleTimes: scheduleTimes })
    }

    const onSelectedUnit = (medicineUnit) => {
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            medicineUnit: medicineUnit,
        }));
    };

    const onSelectedDate = (event, selectedDate) => {
        toggleShowDatePicker()
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            startDate: formatDateMoment(moment(selectedDate)),
        }));
    }

    const onSelectedTempFrequency = (frequency) => {
        if (frequency.key === 1) {
            setTempSchedule({ ...tempSchedule, frequency: 1, selectedDays: null });
        } else if (frequency.key === 2) {
            setTempSchedule({ ...tempSchedule, frequency: 2, selectedDays: null });
        } else {
            setTempSchedule({ ...tempSchedule, frequency: null, selectedDays: [] });
        }
    };


    const toggleShowFrequencyPopup = (frequency, selectedDays) => {
        setShowFrequencyPopup(!showFrequencyPopup)
        if (!showFrequencyPopup) {
            setTempSchedule({ ...tempSchedule, frequency: schedule.frequency, selectedDays: schedule.selectedDays });
        }
    }

    const toggleShowUnitPopup = (medicineUnit) => {
        console.log(medicineUnit)
        setShowUnitPopup(!showUnitPopup)
        if (medicineUnit) {
            setTempSchedule({ ...tempSchedule, medicineUnit: medicineUnit })
            onSelectedUnit(medicineUnit)
        }
    }

    const handleSelectedDay = (day) => {
        const isSelected = tempSchedule.selectedDays.includes(day.key);
        const updatedSelectedDays = isSelected
            ? tempSchedule.selectedDays.filter((selectedDay) => selectedDay !== day.key)
            : [...tempSchedule.selectedDays, day.key];

        // Update the state with the new selected days
        setTempSchedule({ ...tempSchedule, selectedDays: updatedSelectedDays });

        if (tempSchedule.selectedDays.length > 5) {
            setTempSchedule({ ...tempSchedule, selectedDays: null, frequency: 1 });
        }

        console.log(tempSchedule.selectedDays.length)
    }

    const handleSwitchChange = () => {
        setSchedule((prevSchedule) => ({ ...prevSchedule, isActive: !prevSchedule.isActive }));
    };

    const confirmFrequency = () => {
        let frequency = tempSchedule.frequency
        if (tempSchedule.selectedDays && tempSchedule.selectedDays.length === 0) {
            frequency = 1
        }
        setSchedule({ ...schedule, frequency: frequency, selectedDays: frequency >= 1 ? null : tempSchedule.selectedDays })
        toggleShowFrequencyPopup()
    }

    const saveSchedule = async () => {
        setSubmitted(true);

        if (schedule.scheduleTimes.length === 0) {
            Toast.show({ type: 'error', text1: 'Cần nhập thời gian uống thuốc.' });
        } else {
            try {
                const res = await Apis.post(`${endpoints["medicationSchedule"]}/create`, {
                    ...schedule,
                    startDate: formatDateMoment(moment(schedule.startDate))
                });
                if (res.status === 201) {
                    Toast.show({
                        type: 'success',
                        text1: `Lưu thuốc và lịch trình thành công.`
                    })

                    setTimeout(() => {
                        navigation.navigate('MedicationBox', { saveScheduleSuccess: true });
                    }, 1200);
                }
            } catch (error) {
                console.error('API Error:', error);
                Toast.show({ type: 'error', text1: `Lỗi : ${error}.` });
            }
        }

        // Turn off loading state
        setSubmitted(false);

        console.log(schedule);
    };

    return (
        <View style={styles.content}>
            <View style={styles.header}>
                <HeaderWithBackButton title={schedule.id > 0 ? 'Đổi thông tin thuốc' : 'Thuốc và lịch trình'} navigation={navigation} />
            </View>
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                {schedule.id > 0 && (
                    <View style={styles.container}>
                        <View >
                            <Text style={styles.label}>Trạng thái thuốc</Text>
                        </View>
                        <View style={{ ...styles.flexRowCenter, marginTop: 7 }}>
                            <Text style={{
                                ...styles.text, color: schedule.isActive ? COLORS.toastInfo : COLORS.textLabel
                            }}>{schedule.isActive ? 'Thuốc đang uống' : 'Thuốc cũ'}</Text>
                            <Switch
                                value={schedule.isActive}
                                style={{ marginLeft: 'auto', height: 15 }}
                                onValueChange={handleSwitchChange}
                                color={COLORS.toastInfo}
                            />
                        </View>
                    </View>
                )}
                <View style={styles.container}>
                    <Text style={styles.label}>Tên thuốc</Text>
                    <TouchableOpacity style={styles.input}
                        disabled={schedule.id > 0}
                        onPress={() => navigateToAddMedicine()}>
                        <View style={styles.flexRowCenter}>
                            <Text style={styles.text}>{schedule.medicine?.name}</Text>
                            {schedule.id === 0 && (
                                <FontAwesome name="pencil" size={20} color="#000" style={styles.icon} />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={styles.label}>Lịch trình</Text>
                    <View style={{ ...styles.input, height: 'auto', paddingVertical: 16, marginBottom: 20 }}>

                        <InputItem titleLeft={'Đơn vị'}
                            titleRight={schedule.medicineUnit?.name}
                            includeBottomLine={true}
                            onPress={() => toggleShowUnitPopup(schedule.medicineUnit)} />
                        <InputItem
                            titleLeft={'Ngày bắt đầu uống'}
                            titleRight={moment(schedule.startDate).format('DD/MM/YYYY')}
                            includeBottomLine={true}
                            onPress={() => toggleShowDatePicker()} />

                        <InputItem
                            titleLeft={'Tần suất'}
                            titleRight={getFrequencyText(schedule.frequency, schedule.selectedDays)}
                            includeBottomLine={true}
                            onPress={() => toggleShowFrequencyPopup()} />

                        <InputItem
                            titleLeft={'Thời gian'}
                            titleRight={schedule.scheduleTimes.length === 0
                                ? 'Đặt thời gian uống thuốc'
                                : `${schedule.scheduleTimes.length} lần/ngày`}
                            onPress={() => navigateScheduleTime()} />

                        {schedule.scheduleTimes.length > 0 && (
                            <View style={styles.listTime}>
                                {schedule.scheduleTimes.map((s, index) => (
                                    <View style={styles.listTimeItem} key={index}>
                                        <Text style={styles.timeText}>
                                            {formatDuration(s.time)}
                                        </Text>
                                        <Text style={{ ...styles.timeText, fontWeight: '400', fontSize: 8 }}>
                                            {'  \u25CF  '}
                                        </Text>
                                        <Text style={{ ...styles.timeText, fontWeight: '400' }}>
                                            {s.quantity}
                                            {' '}
                                            {schedule.medicineUnit?.name}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={{ ...styles.buttonNext, marginTop: 15 }} onPress={() => saveSchedule()}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>

            {/* BottomPopUp for Medicine Unit */}
            <BottomSheet visible={showUnitPopup} onClose={() => toggleShowUnitPopup()}>
                <View>
                    {/* Popup Header */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.popupTitle}>Đơn vị</Text>
                        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => toggleShowUnitPopup()}>
                            <Feather name="x" size={24} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}></View>
                    {/* Popup Body */}
                    <View style={{ ...styles.input, height: 'auto', paddingVertical: 16, marginHorizontal: 16 }}>
                        {unitList.map((unit) => (
                            <TouchableOpacity key={unit.id} onPress={() => setTempSchedule({ ...tempSchedule, medicineUnit: unit })}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '400' }}>{unit.name}</Text>
                                    {unit.id === tempSchedule.medicineUnit?.id && (
                                        <Feather name="check" color={"green"} style={{ marginLeft: 'auto' }} size={20} />
                                    )}
                                </View>
                                <View style={{ ...styles.line }}></View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* Popup Footer */}
                    <TouchableOpacity style={styles.buttonNext} onPress={() => toggleShowUnitPopup(tempSchedule.medicineUnit)}>
                        <Text style={styles.buttonText}>Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>

            {/* BottomPopUp for Frequency */}
            <BottomSheet visible={showFrequencyPopup} onClose={() => toggleShowFrequencyPopup()}>
                <View>
                    {/* Popup Header */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.popupTitle}>Tần suất</Text>
                        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => toggleShowFrequencyPopup()}>
                            <Feather name="x" size={24} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}></View>
                    {/* Popup Body */}
                    <View style={{ ...styles.input, height: 'auto', paddingVertical: 16, marginHorizontal: 16 }}>
                        {frequencyOptions.map((f) => (
                            <TouchableOpacity key={f.key} onPress={() => onSelectedTempFrequency(f)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '400' }}>{f.label}</Text>
                                    {getFrequencyText(tempSchedule.frequency, tempSchedule.selectedDays) === f.label && (
                                        <Feather name="check" color={"green"} style={{ marginLeft: 'auto' }} size={20} />
                                    )}
                                </View>
                                <View style={{ ...styles.line }}></View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {tempSchedule.frequency > 1 && (
                        <View style={{ ...styles.input, height: 'auto', paddingVertical: 10, marginHorizontal: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: COLORS.textLabel }}>Mỗi</Text>
                                <TouchableOpacity style={{ marginLeft: 'auto' }}
                                    onPress={() => setTempSchedule({ ...tempSchedule, frequency: Math.max(tempSchedule.frequency - 1, 2) })}>
                                    <Feather name="minus-circle" size={20} color={COLORS.textLabel} />
                                </TouchableOpacity>
                                <Text style={{ marginHorizontal: 24, fontSize: 20 }}>{tempSchedule.frequency}</Text>
                                <TouchableOpacity style={{ marginRight: 'auto' }}
                                    onPress={() => setTempSchedule({ ...tempSchedule, frequency: tempSchedule.frequency + 1 })}>
                                    <Feather name="plus-circle" size={20} color={COLORS.textLabel} />
                                </TouchableOpacity>
                                <Text style={{ color: COLORS.textLabel }}>Ngày</Text>
                            </View>
                        </View>
                    )}
                    {tempSchedule.selectedDays && tempSchedule.selectedDays.length < 7 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                            {selectedDaysOptions.map((day) => (
                                <TouchableOpacity
                                    key={day.key}
                                    style={{
                                        ...styles.weekDays,
                                        backgroundColor: tempSchedule.selectedDays.includes(day.key) ? '#3b88e7' : 'transparent',
                                    }}
                                    onPress={() => {
                                        handleSelectedDay(day)
                                    }}>
                                    <Text style={{ ...styles.weekDaysText, color: tempSchedule.selectedDays.includes(day.key) ? 'white' : '#3b88e7' }}>
                                        {day.key === 1 ? 'CN' : day.key}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {/* Popup Footer */}
                    <TouchableOpacity style={styles.buttonNext} onPress={() => confirmFrequency()}>
                        <Text style={styles.buttonText}>Tiếp tục</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
            {showDatePicker && (
                <RNDateTimePicker
                    value={schedule.startDate}
                    minimumDate={new Date()}
                    onChange={onSelectedDate}
                />
            )}

            {(isSubmitted || !isFetched) && (
                <Loading transparent={true} />
            )}
            <ToastConfig />
        </View >
    )
}
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#f8f9fd',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    header: {
        backgroundColor: "white",
        padding: 10,
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    form: {
        padding: 16,
        paddingBottom: 10,
        flex: 1,
        paddingBottom: 100,
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
        borderColor: "#d0d6dd",
        borderRadius: 5,
        paddingHorizontal: 16,
        marginTop: 10,
        backgroundColor: "white",
        height: 48,
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        color: COLORS.textLabel,
        fontWeight: '500'
    },
    icon: {
        marginLeft: "auto",
    },
    line: {
        width: '100%',
        borderBottomColor: 'gray',
        borderWidth: 0.3,
        opacity: 0.2,
        marginVertical: 16,
    },
    popupTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.textLabel,
        fontWeight: 'bold',
        marginLeft: 'auto'
    },
    buttonNext: {
        marginTop: 30,
        backgroundColor: '#2d86f3',
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
    weekDays: {
        borderColor: "#d0d6dd",
        borderWidth: 1,
        borderRadius: 15,
        marginHorizontal: 7,
    },
    weekDaysText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3b88e7'
    },
    buttonContainer: {
        paddingHorizontal: 16,
        backgroundColor: 'white'
    },
    listTime: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },

    listTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#b8d6f2',
        borderWidth: 1,
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 15,
        marginBottom: 10,
    },

    timeText: {
        fontSize: 14,
        color: '#3380e1',
        fontWeight: 'bold',
        textAlign: 'center',
    }

})
export default MedicationSchedule