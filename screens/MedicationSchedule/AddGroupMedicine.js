import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import COLORS from "../../constants/colors"
import HeaderWithBackButton from "../../common/HeaderWithBackButton"
import Feather from "react-native-vector-icons/Feather";
import { memo, useEffect, useState } from "react";
import Button from "../../components/Button";
import Toast from "react-native-toast-message";
import { useUser } from "../../context/UserContext";
import Apis, { endpoints } from "../../config/Apis";
import Loading from "../../components/Loading";
import { Switch } from "react-native-paper";

const InputWithIcon = memo(({ placeholder, value, onChangeText }) => {
    return (
        <View style={[styles.flexRowCenter, styles.input]}>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => onChangeText(text)}
            />
            {value !== '' &&
                <Feather
                    style={{ color: COLORS.textLabel, marginLeft: 'auto' }}
                    name={'x-circle'}
                    onPress={() => onChangeText('')}
                    size={24} />
            }
        </View>
    );
});

const AddGroupMedicine = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false)
    const { userId } = useUser()
    const [enableDelete, setEnableDelete] = useState(false)
    const [groupInfo, setGroupInfo] = useState({
        id: 0,
        userId: userId,
        groupName: '',
        medicineList: [],
        hospitalName: '',
        doctorName: '',
        isActive: true,
    })

    useEffect(() => {
        if (route.params && route.params.groupInfo) {
            return setGroupInfo(route.params.groupInfo)
        } else if (route.params && route.params.id) {
            const getData = async () => {
                try {
                    setLoading(true)
                    const res = await Apis.get(`${endpoints["medicationScheduleGroup"]}/${route.params.id}`)
                    setGroupInfo(res.data)
                } catch (error) {
                    console.error('AddGroupMedicine- GetData', error)
                } finally {
                    setLoading(false)
                }
            }
            getData()
        }
    }, [route.params])

    const toggleDelete = () => {
        setEnableDelete(!enableDelete)
    }

    const navigateAddMore = () => {
        navigation.navigate('AddMedicine', { groupInfo: groupInfo })
    }

    const navigateOrRemoveMedicine = (index) => {
        if (enableDelete) {
            const updatedMedicineList = groupInfo.medicineList.filter((item, i) => i !== index);
            setGroupInfoValueChanged('medicineList', updatedMedicineList)
        } else {
            navigation.navigate('MedicationSchedule', {
                groupInfo: groupInfo,
                selectedSchedule: { ...groupInfo.medicineList[index], groupName: groupInfo.groupName }
            })
        }
    }

    const setGroupInfoValueChanged = (field, value) => {
        setGroupInfo(prev => ({ ...prev, [field]: value }))
    }

    const saveGroupMedicine = async () => {
        if (groupInfo.groupName.length <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng nhập tên toa thuốc!'
            })
        } else if (groupInfo.medicineList.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng thêm ít nhất một thuốc!'
            })
        } else {
            try {
                setLoading(true)
                const res = await Apis.post(`${endpoints["medicationScheduleGroup"]}/createOrUpdate`, groupInfo)

                if (res.status === 200) {
                    Toast.show({
                        type: 'success',
                        text1: groupInfo.id === 0 ? 'Lưu toa thuốc thành công' : 'Đổi thông tin toa thuốc thành công'
                    })
                    navigation.navigate('MedicationBox', { saveScheduleSuccess: true });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Lưu thất bại vì ' + res.data
                    })
                }

            } catch (error) {
                console.log('saveGroupMedicine', error)
                Toast.show({
                    type: 'error',
                    text1: 'Lưu thất bại vì ' + error
                })
            } finally {
                setLoading(false)
            }

        }
    }

    return (
        <View style={styles.screen}>
            <HeaderWithBackButton title={`${groupInfo.id > 0 ? 'Đổi thông tin' : 'Thêm'} toa thuốc`} />
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                {groupInfo.id > 0 && (
                    <View style={styles.container}>
                        <View >
                            <Text style={styles.label}>Trạng thái thuốc</Text>
                        </View>
                        <View style={styles.flexRowCenter}>
                            <Text style={{
                                ...styles.text, color: groupInfo.isActive ? COLORS.toastInfo : COLORS.textLabel
                            }}>{groupInfo.isActive ? 'Thuốc đang uống' : 'Thuốc cũ'}</Text>
                            <Switch
                                value={groupInfo.isActive}
                                style={{ marginLeft: 'auto', height: 15 }}
                                onValueChange={() => setGroupInfoValueChanged('isActive', !groupInfo.isActive)}
                                color={COLORS.toastInfo}
                            />
                        </View>
                    </View>
                )}

                <View style={styles.container}>
                    <Text style={styles.label}>Tên toa thuốc
                        <Text style={{ fontSize: 10 }}>{' (Bắt buộc)'}</Text>
                    </Text>
                    <InputWithIcon
                        placeholder={'Tên toa thuốc của bạn là gì?'}
                        value={groupInfo.groupName}
                        onChangeText={(text) => setGroupInfoValueChanged('groupName', text)}
                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.flexRowCenter}>
                        <Text style={[styles.label, { marginRight: 'auto' }]}>Danh sách thuốc
                            <Text style={{ fontSize: 10 }}>{' (Bắt buộc)'}</Text>
                        </Text>
                        {groupInfo.medicineList.length > 0 &&
                            <TouchableOpacity onPress={toggleDelete}>
                                <Text style={{ fontSize: 12, fontWeight: '500', color: enableDelete ? COLORS.toastInfo : COLORS.textLabel }}>
                                    {enableDelete ? 'XONG' : 'SỬA'}
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    {groupInfo.medicineList.length > 0 &&
                        <View style={[styles.input, { height: 'auto', paddingVertical: 16 }]}>
                            {groupInfo.medicineList.map((s, index) => (
                                <View key={index}>
                                    {index > 0 && <View style={styles.line} />}
                                    <View style={styles.flexRowCenter}>
                                        <Text style={styles.medicineName}>{s.medicine.name}</Text>
                                        <TouchableOpacity
                                            style={{ marginLeft: 'auto', }}
                                            onPress={() => navigateOrRemoveMedicine(index)}>
                                            <Feather
                                                style={{ color: enableDelete ? COLORS.toastError : COLORS.black }}
                                                name={enableDelete ? 'trash-2' : 'chevron-right'}
                                                size={24} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            ))}
                        </View>
                    }
                    <TouchableOpacity style={[styles.input, styles.btnAddMore, styles.flexRowCenter]} onPress={() => navigateAddMore()}>
                        <Feather name="plus" size={24} color={COLORS.toastInfo} />
                        <Text style={styles.textAddMore}>Thêm thuốc</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text style={styles.label}>{'Bệnh viện & Phòng khám'}
                        <Text style={{ fontSize: 10 }}>{' (Tùy chọn)'}</Text>
                    </Text>
                    <InputWithIcon
                        placeholder='Toa thuốc của bạn được kê ở đâu?'
                        value={groupInfo.hospitalName}
                        onChangeText={(text) => setGroupInfoValueChanged('hospitalName', text)}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.label}>{'Bác sĩ'}
                        <Text style={{ fontSize: 10 }}>{' (Tùy chọn)'}</Text>
                    </Text>
                    <InputWithIcon
                        placeholder='Bác sĩ kê thuốc của bạn là ai?'
                        value={groupInfo.doctorName}
                        onChangeText={(text) => setGroupInfoValueChanged('doctorName', text)}
                    />
                </View>
                <View style={{ paddingBottom: 48 }} />
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="Lưu" filled onPress={saveGroupMedicine} />
            </View>

            {loading && <Loading transparent={true} />}
        </View>
    )
}
const styles = StyleSheet.create({
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
    medicineName: {
        fontSize: 14,
        fontWeight: '500',
    },
    line: {
        borderBottomColor: '#ccc',
        borderWidth: 1,
        opacity: 0.1,
        marginVertical: 16,
    },
    btnAddMore: {
        marginTop: 24,
        borderColor: COLORS.toastInfo,
        borderWidth: 1,
        backgroundColor: '#e2f2ff',
        justifyContent: 'center'
    },
    textAddMore: {
        textAlign: 'center',
        color: COLORS.toastInfo,
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    buttonContainer: {
        marginVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 16,
        color: COLORS.textLabel,
        fontWeight: '500',
    },
})
export default AddGroupMedicine