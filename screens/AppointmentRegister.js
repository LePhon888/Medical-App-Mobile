import React, { useEffect, useReducer, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image, TextInput, ScrollView, TouchableWithoutFeedback, Linking, Share } from 'react-native';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import CalendarPicker from 'react-native-calendar-picker';
import { morning, afternoon, evening } from '../config/data';
import { formatDate } from '../config/date';
import { getUserFromStorage } from '../utils/GetUserFromStorage';
import Apis, { SERVER, endpoints } from '../config/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import moment from 'moment';
import getNewAccessToken from '../utils/getNewAccessToken';
import Toast from 'react-native-toast-message';

export default function AppointmentRegister({ navigation, route }) {
    const tabs = [{ name: 'Chọn giờ đặt hẹn' }];
    const doctor = route.params
    const minDate = new Date();
    const maxDate = new Date(minDate.getFullYear() + 1, 11, 31);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState(0);
    const [hour, setHour] = useState([]);
    const [selectHour, setSelectHour] = useState(null);
    const [user, setUser] = useState(null);
    const [reason, setReason] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(minDate);
    const [payment, setPayment] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [conditionHour, setConditionHour] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            try {
                const storedUser = await getUserFromStorage();
                setUser(storedUser);
                const response = await Apis.get(endpoints["hours"]);
                setHour(response.data);
            } catch (error) {
                console.error('Error retrieving user:', error);
            }
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetchHour = async () => {
            try {
                const response = await Apis.get(endpoints["hours"]);
                setHour(response.data);
            } catch (error) {
                console.error('Error retrieving user:', error);
            }
        };
        fetchHour();
    }, []);
    const onSubmit = async () => {
        const userInfor = {
            userId: user.id,
            doctorId: doctor.userId,
            date: selectedStartDate,
            hour: selectHour?.id,
            reason,
        };
        const token = await AsyncStorage.getItem("accessToken");
        try {
            await getNewAccessToken();
            const res = await Apis.post(endpoints.appointment, userInfor, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAppointment(res.data);
            const resPayment = await Apis.get(
                `${endpoints["payment"]}?orderInfo=${res.data.id}&amount=${res.data.doctor.fee.fee}`
            );
            setPayment(resPayment);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Đặt hẹn thất bại",
            });
            console.error("Error fetching appointment data:", error);
        }
    }

    const webviewRef = useRef(null);

    const onNavigationStateChange = (navState) => {
        if (navState.url.startsWith('http://192.168')) {
            // webviewRef.current.stopLoading();
            const pathWithoutHost = navState.url.split('//')[1].split('/').slice(1).join('/');
            const newUrl = SERVER + '/' + pathWithoutHost;
            webviewRef.current.injectJavaScript(`window.location.href = "${newUrl}";`);
            navState.url?.includes('payment-response') && navState.url?.includes('vnp_PayDate') && navigation.navigate('Status', { status: 1 });
        }
    }

    //check duplicate hour
    const fetchAppointmentHour = async (formattedDate) => {
        try {
            await getNewAccessToken();
            const token = await AsyncStorage.getItem("accessToken");
            const response = await Apis.get(endpoints.appointmentHour + '?date=' + formattedDate + '&doctorId=' + doctor.userId,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setConditionHour(response.data);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Lỗi khi lấy giờ hẹn",
            });
            console.error('Error retrieving appointment hour:', error);
        }
    };

    onDateChange = date => {
        let formattedDate = moment(new Date(date)).format("YYYY-MM-DD");
        fetchAppointmentHour(formattedDate);
        setSelectedStartDate(date.toString());
    }


    if (payment?.data.url) {
        return (<WebView ref={webviewRef} source={{ uri: payment?.data.url }} style={{ flex: 1 }} onNavigationStateChange={onNavigationStateChange} />)
    }
    else
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View >
                    <SafeAreaView>
                        <HeaderWithBackButton title={'Đặt hẹn'} navigation={navigation} />
                    </SafeAreaView>
                </View>
                <ScrollView contentContainerStyle={styles.container}>
                    <View>
                        <Text style={styles.title}>Bệnh nhân</Text>
                        <View style={styles.radio}>
                            <View>
                                <Image alt="image" style={styles.profileAvatar} source={{ uri: user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80" }} />
                            </View>
                            <View style={styles.radioTop}>
                                <Text style={styles.radioLabel}>{user?.lastName + ' ' + user?.firstName}</Text>
                                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                    <Fontisto name="email" size={14} style={{ color: '#969ca3', marginTop: 4 }} />
                                    <Text style={styles.radioDescription}>{user?.email}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {user?.phoneNumber && <Feather name="phone" size={14} style={{ color: '#969ca3', marginTop: 4 }} />}
                                    <Text style={styles.radioDescription}>{user?.phoneNumber}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Doctor */}
                    <View>
                        <Text style={styles.title}>Bác sĩ</Text>
                        <View style={styles.radio}>
                            <View>
                                <Image alt="image" style={styles.profileAvatar} source={{ uri: doctor.image }} />
                            </View>
                            <View style={styles.radioTop}>
                                <Text style={styles.radioLabel}>BS.CKI {doctor?.fullName}</Text>
                                <View >
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '400',
                                        color: '#848a96',
                                        marginBottom: 1
                                    }}>Khoa: {doctor.departmentName}</Text>
                                </View>
                                <Text style={{
                                    fontSize: 15,
                                    color: '#848a96',
                                    marginBottom: 1,
                                    width: 300
                                }}>{doctor.hospital}</Text>
                            </View>
                        </View>
                    </View>
                    {/* Date time */}
                    <Text style={styles.title}>Ngày giờ lịch hẹn</Text>
                    <TouchableOpacity onPress={() => setActive(!active)}>
                        <View style={styles.radio}>
                            <View>
                                <Image source={require('../assets/images/calendar.png')} style={{ width: 22, height: 22, marginRight: 20, marginTop: 12, marginLeft: 6 }} />
                            </View>
                            <View style={styles.radioTop}>
                                <Text style={styles.radioLabel}>Ngày: {selectedStartDate ? moment(selectedStartDate).format('DD/MM/YYYY') : formatDate(minDate)}</Text>
                                <View >
                                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#848a96' }}>Giờ: {selectHour?.hour}</Text>
                                </View>
                                <View style={{ position: 'absolute', right: 60, top: 15 }}>
                                    <Entypo name="chevron-thin-down" size={15} style={{ color: '#89919d', transform: [{ rotate: active ? '0deg' : '90deg' }] }} />
                                </View>
                                <View style={{ width: 117, position: 'absolute', right: 100, top: 0 }}>
                                    <Text style={styles.consultation}>Tư vấn từ xa</Text>
                                </View>
                            </View>

                        </View>
                    </TouchableOpacity>
                    {active &&
                        <View style={{ marginTop: 15 }}>
                            <View style={{ borderWidth: 0.5, borderRadius: 14, paddingBottom: 10, paddingTop: 10, borderColor: '#ccc' }}>
                                <CalendarPicker
                                    weekdays={['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']}
                                    months={['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']}
                                    selectedDayColor={COLORS.primary}
                                    selectedDayTextColor={COLORS.white}
                                    previousTitle="      <"
                                    nextTitle=">      "
                                    selectYearTitle="Chọn năm"
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    textStyle={{ fontSize: 15 }}
                                    onDateChange={this.onDateChange}
                                />
                            </View>

                            <View style={styles.containerSelect}>
                                {/* <Text style={styles.title}>Vui lòng chọn buổi</Text> */}
                                <View style={{ flexDirection: 'row' }}>
                                    {tabs.map((item, index) => {
                                        const isActive = index === value;
                                        return (
                                            <View style={{ flex: 1 }} key={item.name}>
                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        setValue(index);
                                                    }}>
                                                    <View
                                                        style={[
                                                            styles.item,
                                                            isActive && { borderBottomColor: '#6366f1' },
                                                        ]}>
                                                        <Text style={[styles.text, isActive && { color: '#6366f1' }]}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        );
                                    })}
                                </View>
                                <View style={{ marginVertical: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {hour?.map((item, index) => {
                                        const currentHour = moment().format('HH:mm');
                                        const currentDate = moment().startOf('day');
                                        const compareDate = moment(selectedStartDate).startOf('day');
                                        const isPast = compareDate.isSame(currentDate) && item.hour < currentHour;
                                        const ids = conditionHour?.map(item => item?.id);
                                        const isDuplicate = item && ids.includes(item?.id.toString());
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: isPast ? '#ecf0f1' : (isDuplicate ? '#ecf0f1' : index + 1 == selectHour?.id ? COLORS.primary : COLORS.white), paddingHorizontal: 20,
                                                    paddingVertical: 6, margin: 5, borderWidth: 0.3, borderColor: '#ccc', borderRadius: 50
                                                }} onPress={() => !isDuplicate && !isPast && setSelectHour(item)} key={index}>
                                                <Text style={{
                                                    color: isPast ? '#ccc' : (isDuplicate ? '#ccc' : (index + 1 == selectHour?.id ? COLORS.white : '#353b48')), fontWeight: 500
                                                }}>
                                                    {item.hour}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                    }
                    <View style={{ backgroundColor: '#f3f9fd', paddingHorizontal: 12, paddingBottom: 30, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../assets/images/online-survey.png')} style={{ width: 22, height: 22, marginRight: 8, marginTop: 17 }} />
                            <Text style={{ fontSize: 17, fontWeight: 600, color: '#5c5c5c', marginTop: 17, marginBottom: 20 }}>Câu hỏi dành cho bạn</Text>
                        </View>
                        <Text>Lý do bạn đặt hẹn (Tình trạng bệnh)</Text>
                        <TextInput
                            style={{
                                borderWidth: 0.3,
                                borderColor: '#ccc',
                                borderRadius: 6,
                                marginTop: 10,
                                height: 80,
                                backgroundColor: '#fff'
                            }}
                            multiline={true}
                            onChangeText={(text) => setReason(text)}
                        />
                    </View>
                    <View style={{ marginVertical: 20 }}>
                        <Text style={styles.title}>Phương thức thanh toán</Text>
                        <View style={styles.radio}>
                            <View>
                                <Image alt="image" style={{
                                    width: 40,
                                    height: 40,
                                    marginRight: 16
                                }} source={{ uri: "https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" }} />
                            </View>
                            <View style={styles.radioTop}>
                                <Text style={styles.radioLabel}>Thanh toán bằng VNPay</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '400',
                                    color: '#848a96',
                                }}>Phí dịch vụ</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 15 }}>Phí tư vấn </Text>
                            <Text style={{ color: '#019d5c', fontWeight: 700 }}>{doctor.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</Text>
                        </View>
                        <Button title={'Xác nhận đặt hẹn'} filled style={{ borderRadius: 6 }} onPress={() => selectHour == null ? Toast.show({
                            type: "error",
                            text1: "Vui lòng chọn giờ hẹn",
                        }) : onSubmit()} />
                    </View>
                </ScrollView >
            </View >
        )
};






const styles = StyleSheet.create({
    container: {
        marginHorizontal: 17,
        marginTop: 2,
        position: 'relative'
    },
    radio: {
        flexDirection: 'row',
        position: 'relative',
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 12,
        borderRadius: 6,
        borderWidth: 0.3,
        borderColor: '#ccc',
        marginTop: 8
    },
    radioActive: {
        borderColor: '#0069fe',
    },
    radioTop: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 4,
        position: 'relative'
    },
    radioLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 5,
        width: 300
    },
    radioUsers: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2f2f2f',
    },
    radioDescription: {
        fontSize: 14,
        fontWeight: '400',
        color: '#848a96',
        marginLeft: 8
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 9999,
        marginRight: 16,
    },
    title: {
        color: '#5c5c5c'
    },
    consultation: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        color: '#218e60',
        borderWidth: 1,
        backgroundColor: '#e1f8ee',
        borderColor: '#368866',
        borderRadius: 15,
    },
    containerSelect: {
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingBottom: 18,
        paddingTop: 6,
        paddingHorizontal: 12,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        marginTop: 20,
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 14
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderColor: '#e5e7eb',
        borderBottomWidth: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    text: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6b7280',
    },
});