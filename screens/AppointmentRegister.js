import React, { useEffect, useReducer, useState } from 'react';
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
import Apis, { endpoints } from '../config/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';

export default function AppointmentRegister({ navigation, route }) {
    const tabs = [{ name: 'Chọn giờ đặt hẹn' }];
    const doctor = route.params
    const minDate = new Date();
    const maxDate = new Date(minDate.getFullYear() + 1, 11, 31);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState(0);
    const [hour, setHour] = useState(0);
    const [selectHour, setSelectHour] = useState('Chọn giờ đặt hẹn');
    const [user, setUser] = useState(null);
    const [reason, setReason] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(minDate);
    const [payment, setPayment] = useState(null);
    const [appointment, setAppointment] = useState(null);
    console.log(selectHour);
    useEffect(() => {
        const fetch = async () => {
            try {
                const storedUser = await getUserFromStorage();
                setUser(storedUser);
                // const response = await Apis.get(endpoints["hours"]);
                // setHour(response.data);
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
            hour: selectHour.id,
            reason,
        };
        const token = await AsyncStorage.getItem("accessToken");
        try {
            const res = await Apis.post(endpoints["appointment"], userInfor, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAppointment(res.data);
            const resPayment = await Apis.get(
                `${endpoints["payment"]}?orderInfo=${res.data.id}&amount=${res.data.fee.fee}`
            );
            setPayment(resPayment);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const onNavigationStateChange = (navState) => {
        navState.url?.includes('payment-response') && navState.url?.includes('vnp_PayDate') && navigation.navigate('Status', { status: 1 });
    }

    onDateChange = date => {
        setSelectedStartDate(date.toString());
    }
    if (payment?.data.url) {
        return (<WebView source={{ uri: payment?.data.url }} style={{ flex: 1 }} onNavigationStateChange={onNavigationStateChange} />)
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
                                <Image alt="image" style={styles.profileAvatar} source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80" }} />
                            </View>
                            <View style={styles.radioTop}>
                                <Text style={styles.radioLabel}>{user?.lastName + ' ' + user?.firstName}</Text>
                                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                    <Fontisto name="email" size={14} style={{ color: '#969ca3', marginTop: 4 }} />
                                    <Text style={styles.radioDescription}>{user?.email}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Feather name="phone" size={14} style={{ color: '#969ca3', marginTop: 4 }} />
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
                                <Image alt="image" style={styles.profileAvatar} source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80" }} />
                            </View>
                            <View style={styles.radioTop}>
                                <Text style={styles.radioLabel}>BS.CKI {doctor?.fullName}</Text>
                                <View >
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '400',
                                        color: '#848a96',
                                        marginBottom: 1
                                    }}>{doctor.departmentName}</Text>
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
                                <Text style={styles.radioLabel}>{formatDate(minDate)}</Text>
                                <View >
                                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#848a96' }}>{selectHour.hour}</Text>
                                </View>
                                <View style={{ position: 'absolute', right: 60, top: 15 }}>
                                    <Entypo name="chevron-thin-down" size={15} style={{ color: '#89919d', transform: [{ rotate: active ? '0deg' : '90deg' }] }} />
                                </View>
                                <View style={{ width: 117, position: 'absolute', right: 140, top: 0 }}>
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
                                    {hour.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: index == selectHour.id ? COLORS.primary : COLORS.white, paddingHorizontal: 20,
                                                    paddingVertical: 6, margin: 5, borderWidth: 0.3, borderColor: '#ccc', borderRadius: 50
                                                }} onPress={() => setSelectHour(item)} key={index}>
                                                <Text style={{
                                                    color: index == selectHour.id ? COLORS.white : '#20344d', fontWeight: 500
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
                        <Button title={'Xác nhận đặt hẹn'} filled style={{ borderRadius: 6 }} onPress={() => onSubmit()} />
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