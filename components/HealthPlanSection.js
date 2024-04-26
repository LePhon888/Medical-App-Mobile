import { memo, useEffect, useState } from "react"
import Apis, { endpoints } from "../config/Apis";
import { useUser } from "../context/UserContext";
import moment from "moment";
import { formatDateMoment, formatDuration } from "../config/date";
import Toast from "react-native-toast-message";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import Feather from "react-native-vector-icons/Feather"
import Octicons from "react-native-vector-icons/Octicons";
import StatusIcon from "./MedicationReminder/StatusIcon";
import * as GlobalNavigation from "../utils/GlobalNavigation"
import { TouchableOpacity } from "react-native-gesture-handler";
import Loading from "./Loading";


const HealthPlanSection = () => {
    const [loading, setLoading] = useState(false)
    const { userId } = useUser()
    const [medicationReminder, setMedicationReminder] = useState({
        total: 0,
        totalUsed: 0,
        totalSkipped: 0,
        list: [],
        showList: false,
    })

    const getMedicationReminder = async () => {
        try {
            const scheduleTimes = await Apis.get(`${endpoints["scheduleTime"]}/user/${userId}?startDate=${formatDateMoment(moment())}`)
            setMedicationReminder(prev => ({
                ...prev,
                total: scheduleTimes.data.length,
                totalUsed: scheduleTimes.data.filter(item => item.isUsed === true).length,
                totalSkipped: scheduleTimes.data.filter(item => item.isUsed === false).length,
                list: scheduleTimes.data
            }))
            console.log(scheduleTimes.data)
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error,
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMedicationReminder()
    }, [])

    const createOrUpdateDetail = async ({ item, isUsed }) => {
        try {

            const res = await Apis.post(`${endpoints["scheduleTimeDetail"]}/createOrUpdate`, {
                id: item.id,
                date: moment().format('YYYY-MM-DD'),
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
        setLoading(true)
        const result = await createOrUpdateDetail({ item, isUsed });
        if (result === 200 || result === 201) {
            getMedicationReminder()
        }
        setLoading(false)
    };

    const navigateToMedicationBox = () => {
        GlobalNavigation.navigate('MedicationBox')
    }

    const toggleShowMore = () => {
        setMedicationReminder(prev => ({ ...prev, showList: !medicationReminder.showList }))
    }

    const updateAllStatus = async (isUsed) => {
        const updatedList = medicationReminder.list.filter((item) => item.isUsed !== isUsed);
        if (updatedList.length > 0) {
            setLoading(true)
            await Promise.all(
                updatedList.map(async (item) => {
                    await createOrUpdateDetail({ item, isUsed: isUsed });
                })
            );
            getMedicationReminder()
        }
    };

    return (
        <View style={{ paddingHorizontal: 16 }}>

            {/* Start Medication Reminder */}
            <View style={styles.section}>

                {/* Header View */}
                <View style={[styles.flexRowCenter]}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3030/3030201.png' }}
                        style={{ width: 32, height: 32 }}
                    />
                    <Text style={styles.title}>{'Nhắc nhở uống thuốc'}</Text>
                    <Feather
                        name="arrow-up-right"
                        size={24}
                        style={{
                            backgroundColor: COLORS.toastInfo,
                            color: COLORS.white,
                            borderRadius: 99,
                            padding: 4,
                        }}
                        onPress={navigateToMedicationBox}
                    />
                </View>

                {medicationReminder.list.length > 0 &&
                    <>
                        {/* Stats View */}
                        <View style={[styles.medicationReminderStats, styles.flexRowCenter]}>
                            <View style={{ marginRight: 'auto' }}>
                                <Text>{'Tổng số liều'}</Text>
                                <View style={[styles.flexRowCenter, styles.marginTopS]}>
                                    <Image
                                        source={require('../assets/images/pill.png')}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <Text style={styles.bold}>{medicationReminder.total}</Text>

                                </View>
                            </View>
                            <View style={{ marginRight: 24, alignItems: 'center' }}>
                                <Text>{'Dùng'}</Text>
                                <View style={[styles.flexRowCenter, styles.marginTopS]}>
                                    <StatusIcon
                                        iconName="check-circle-fill"
                                        iconColor={COLORS.toastInfo}
                                    />
                                    <Text style={styles.bold}>{medicationReminder.totalUsed}</Text>

                                </View>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text>{'Bỏ qua'}</Text>
                                <View style={[styles.flexRowCenter, styles.marginTopS]}>
                                    <StatusIcon
                                        iconName="x-circle-fill"
                                        iconColor={COLORS.toastError}
                                    />
                                    <Text style={styles.bold}>{medicationReminder.totalSkipped}</Text>

                                </View>
                            </View>
                        </View>

                        {/* List View */}
                        {medicationReminder.showList &&
                            <View style={styles.list}>
                                {medicationReminder.showList && medicationReminder.list.map((item, index) => (
                                    <View key={index} style={styles.listItem}>
                                        {index > 0 &&
                                            <View style={styles.dashed} />
                                        }
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={styles.medicineName}>{item.medicineName}</Text>
                                                <Text style={styles.usage}>{`Uống ${item.quantity} ${item.unitName} lúc ${formatDuration(item.time)}`}</Text>
                                            </View>
                                            <View style={styles.flexRowCenter}>
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
                                    </View>
                                ))}
                            </View>
                        }

                        {/* Button View */}
                        {medicationReminder.showList &&
                            <View style={[styles.flexRowCenter, { justifyContent: 'space-between' }]}>
                                <View
                                    onTouchEnd={() => updateAllStatus(false)}
                                    style={[styles.flexRowCenter, styles.button, { borderColor: COLORS.toastError }]}>
                                    <Text style={{ color: COLORS.toastError, fontWeight: 'bold' }}>{'Bỏ qua tất cả'}</Text>
                                </View>

                                <View
                                    onTouchEnd={() => updateAllStatus(true)}
                                    style={[styles.flexRowCenter, styles.button, { borderColor: COLORS.toastInfo }]}>
                                    <Text style={{ color: COLORS.toastInfo, fontWeight: 'bold' }}>{'Dùng tất cả'}</Text>
                                </View>
                            </View>
                        }


                        {/* ShowMore View */}
                        <View style={styles.showMore} onTouchEnd={toggleShowMore}>
                            <Text style={{ color: COLORS.toastInfo, fontWeight: 'bold' }}>{medicationReminder.showList ? 'Thu gọn' : 'Xem thêm'}</Text>
                            <Octicons
                                style={{ marginLeft: 16 }}
                                color={COLORS.toastInfo}
                                name={medicationReminder.showList ? 'chevron-up' : 'chevron-down'}
                                size={18}
                            />
                        </View>
                    </>
                }
            </View>
            {/* End Medication Reminder */}
            {loading && <Loading transparent={true} />}
        </View>
    )

}
const styles = StyleSheet.create({
    section: {
        backgroundColor: 'white',
        borderColor: COLORS.grey,
        borderWidth: 0.8,
        borderRadius: 15,
        padding: 16,
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        marginLeft: 12,
        marginRight: 'auto',
        fontWeight: 'bold'
    },
    medicationReminderStats: {
        marginTop: 16,
        backgroundColor: '#f8f9fd',
        borderRadius: 15,
        padding: 16
    },
    bold: {
        fontWeight: 'bold',
        marginLeft: 8
    },
    marginTopS: {
        marginTop: 8
    },
    dashed: {
        borderWidth: 0.2,
        borderColor: COLORS.grey,
        marginVertical: 24
    },
    list: {
        marginTop: 16,

    },
    listItem: {

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
    showMore: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginTop: 24,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 99,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
    }
})
export default HealthPlanSection