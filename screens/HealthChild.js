import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions } from "react-native";
import Button from "../components/Button";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import Feather from 'react-native-vector-icons/Feather';
import { useEffect, useState } from "react";
import COLORS from "../constants/colors";
import { BarChart, LineChart } from "react-native-gifted-charts";
import BottomSheet from "../components/BottomSheet";
import moment from "moment";
import Apis, { endpoints } from "../config/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const bottomTabs = [
    { key: 1, title: 'Thống kê' },
    { key: 2, title: 'Lịch sử' },
];
const medTabs = [
    { key: 1, title: 'Tuần' },
    { key: 2, title: 'Tháng' },
    { key: 3, title: 'Năm' },
];
const defaultColor = '#a3a3a3';
const activeColor = COLORS.primary;

export default function HealthChild({ navigation, route }) {
    const date = moment().format('DD/MM/YYYY');
    const time = moment().format('HH:mm A');
    const [bottomActiveTab, setBottomActiveTab] = useState(1);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [currentDate] = useState(date);
    const [currentTime] = useState(time);
    const [numberWeight, setNumberWeight] = useState(null);
    const [medActiveTab, setMedActiveTab] = useState(1);
    const [weightList, setWeightList] = useState([]);
    const [weightListWeek, setWeightListWeek] = useState([]);
    const [weightListMonth, setWeightListMonth] = useState([]);
    const [weightListYear, setWeightListYear] = useState([]);
    const [newWeight, setNewWeight] = useState(null);
    const [numberHeight, setNumberHeight] = useState(null);

    const weight = [
        { title: 'Cân nặng hiện tại', subTitle: 'Cập nhật lần cuối:', number: newWeight?.number, label: 'kg', date: newWeight ? (moment(newWeight?.date).format('DD/MM/YYYY') + ' ' + newWeight?.time.slice(0, 5)) : '', color: '#fbe9e9', textColor: '#e64729' },
        { title: 'Chiều cao hiện tại', subTitle: 'Cập nhật lần cuối:', number: newWeight?.height, label: 'cm', date: newWeight ? (moment(newWeight?.date).format('DD/MM/YYYY') + ' ' + newWeight?.time.slice(0, 5)) : '', color: '#e2f2ff', textColor: '#0984e3' },
    ]

    useEffect(() => {
        const fetchWeight = async () => {
            try {
                const response = await Apis.get(endpoints.weight + '/' + route.params.childId);
                setWeightList(response.data);
            } catch (error) {
                console.error('Error fetching weight:', error);
            }
        }
        fetchWeight();
    }, [newWeight]);

    useEffect(() => {
        const fetchWeightWeek = async () => {
            try {
                const response = await Apis.get(endpoints.weight + '/week/' + route.params.childId);
                setWeightListWeek(response.data);
            } catch (error) {
                console.error('Error fetching week weight:', error);
            }
        }
        fetchWeightWeek();
    }, [newWeight]);

    useEffect(() => {
        const fetchWeightMonth = async () => {
            try {
                const response = await Apis.get(endpoints.weight + '/month/' + route.params.childId);
                setWeightListMonth(response.data);
            } catch (error) {
                console.error('Error fetching month weight:', error);
            }
        }
        fetchWeightMonth();
    }, [newWeight]);

    useEffect(() => {
        const fetchWeightMonth = async () => {
            try {
                const response = await Apis.get(endpoints.weight + '/year/' + route.params.childId);
                setWeightListYear(response.data);
            } catch (error) {
                console.error('Error fetching year weight:', error);
            }
        }
        fetchWeightMonth();
    }, [newWeight]);

    useEffect(() => {
        const fetchNewWeight = async () => {
            try {
                const response = await Apis.get(endpoints.weight + '/new/' + route.params.childId);
                setNewWeight(response.data[0]);
            } catch (error) {
                console.error('Error fetching new weight:', error);
            }
        }
        fetchNewWeight();
    }, []);

    const updateWeight = async () => {
        if (!numberWeight || numberWeight.trim() === '') {
            Toast.show({
                type: 'error', text1: 'Vui lòng nhập số cân nặng của con bạn',
                borderRadius: 16, position: 'top', visibilityTime: 2000
            })
            return;
        }
        if (!numberHeight || numberWeight.trim() === '') {
            Toast.show({
                type: 'error', text1: 'Vui lòng nhập chiều cao của con bạn',
                borderRadius: 16, position: 'top', visibilityTime: 2000
            })
            return;
        }
        if (numberWeight > 200) {
            Toast.show({
                type: 'error', text1: 'Cân nặng không hợp lệ',
                borderRadius: 16, position: 'top', visibilityTime: 2000
            })
            return;
        }
        if (numberHeight > 220) {
            Toast.show({
                type: 'error', text1: 'Chiều cao không hợp lệ',
                borderRadius: 16, position: 'top', visibilityTime: 2000
            })
            return;
        }

        try {
            setPopupVisible(false);
            const response = await Apis.post(endpoints.weight + '/child', {
                userId: route.params.childId,
                number: numberWeight,
                height: numberHeight,
            });
            setNewWeight(response.data);
            setNumberWeight(null);
        } catch (error) {
            console.error('Error updating weight:', error);
        }
    }

    const dataWeight = (medActiveTab == 1 ? weightListWeek : (medActiveTab == 2 ? weightListMonth : weightListYear)).map(item => ({
        value: item.number, label: moment(item.date).format('DD/MM'), topLabelComponent: () => (
            <Text style={{ color: COLORS.secondary, fontSize: 12 }}>{item.number}</Text>
        ),
    }));

    const dataHeight = (medActiveTab == 1 ? weightListWeek : (medActiveTab == 2 ? weightListMonth : weightListYear)).map(item => ({
        value: item.height, label: moment(item.date).format('DD/MM'), topLabelComponent: () => (
            <Text style={{ color: COLORS.primary, fontSize: 12 }}>{item.height}</Text>
        ),
    }));

    return (
        <View style={styles.container}>
            <HeaderWithBackButton title={'Sức khỏe con bạn'} />
            {bottomActiveTab == 1 ?
                <>
                    <View style={styles.medTabContainer}>
                        {medTabs.map((t) => (
                            <TouchableOpacity
                                key={t.key} style={[styles.medTab, { backgroundColor: medActiveTab === t.key ? COLORS.primary : '#f8f9fd' }]}
                                onPress={() => setMedActiveTab(t.key)}>
                                <Text style={[styles.medTabTitle, { color: medActiveTab === t.key ? 'white' : '#5b5b5b' }]}>{t.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingTop: 16, paddingBottom: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginLeft: 10 }}>Biểu đồ cân nặng (Đơn vị: kg)</Text>
                            <Text style={{ fontSize: 12, color: COLORS.text, marginLeft: 10, marginBottom: 10 }}>Biểu đồ cân nặng của con bạn trong{medActiveTab == 2 ? ' 1 tháng ' : (medActiveTab == 1 ? ' tuần ' : ' năm ')}gần nhất</Text>
                        </View>
                        <BarChart
                            data={dataWeight}
                            spacing={medActiveTab == 3 ? 1 : 18}
                            barBorderRadius={5}
                            frontColor={COLORS.secondary}
                            noOfSections={7}
                            isAnimated={medActiveTab == 3 ? false : true}
                            width={Dimensions.get('window').width * 0.8}
                            yAxisThickness={0}
                            xAxisType={'dashed'}
                            xAxisColor={'gray'}
                            yAxisTextStyle={{ color: 'gray', fontSize: 11 }}
                            xAxisLabelTextStyle={{ color: 'gray', fontSize: 9, paddingTop: -10 }}
                        />
                        <View style={{ paddingTop: 16, paddingBottom: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginLeft: 10 }}>Biểu đồ chiều cao (Đơn vị: cm)</Text>
                            <Text style={{ fontSize: 12, color: COLORS.text, marginLeft: 10, marginBottom: 10 }}>Biểu đồ chiều cao của con bạn trong{medActiveTab == 2 ? ' 1 tháng ' : (medActiveTab == 1 ? ' tuần ' : ' năm ')}gần nhất</Text>
                        </View>
                        <BarChart
                            data={dataHeight}
                            spacing={medActiveTab == 3 ? 1 : 18}
                            barBorderRadius={4}
                            frontColor={COLORS.primary}
                            noOfSections={7}
                            isAnimated={medActiveTab == 3 ? false : true}
                            width={Dimensions.get('window').width * 0.8}
                            yAxisThickness={0}
                            xAxisType={'dashed'}
                            xAxisColor={'gray'}
                            yAxisTextStyle={{ color: 'gray', fontSize: 11 }}
                            xAxisLabelTextStyle={{ color: 'gray', fontSize: 9, paddingTop: -10 }}
                        />
                        <View style={{ marginTop: 20, marginLeft: 3, flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' }}>
                            {weight.map((w, index) => (
                                <View key={index} style={{ padding: 15, backgroundColor: w.color, width: '47%', margin: 5, height: 160, borderRadius: 8 }}>
                                    <View style={{ paddingRight: 20 }}>
                                        <Text style={{ fontSize: 17, fontWeight: '500', color: w.textColor }}>{w.title}</Text>
                                        <Text style={{ fontSize: 12, color: index == 2 || index == 3 ? w.textColor : '#9e9a9a', marginTop: 8 }}>
                                            {w.subTitle}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#9e9a9a' }}>{w.date}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                                            <Text style={{ fontSize: 32, fontWeight: '400', color: w.textColor }}>{w.number}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: '500', color: COLORS.text, marginTop: 10, color: w.textColor }}> {w.label}</Text>
                                        </View>
                                    </View>
                                </View>
                            ), 0)}
                        </View>
                        <View style={{
                            marginHorizontal: 10,
                            padding: 20,
                            marginBottom: 20,
                            borderRadius: 10,
                            backgroundColor: '#fff',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 3.84,
                            shadowColor: '#cfd0d1',
                            elevation: 10,
                        }}>
                            <Text style={{ color: '#333333', fontSize: 19, fontWeight: 500, marginBottom: 16 }}>Lịch sử</Text>
                            {weightList?.slice(0, 3).map((item, index) => {
                                return <View key={index} style={{ paddingVertical: 13, flexDirection: 'row', borderBottomWidth: 0.2, borderBottomColor: '#e9e9e9' }}>
                                    <Text style={{ marginRight: '42%', color: '#2b2b2b', fontSize: 16, fontWeight: 400 }}>{moment(item.date).format('DD/MM/YYYY')} {moment(item.time, 'HH:mm:ss').format('HH:mm')}</Text>
                                    <Text style={{ color: '#2b2b2b', fontSize: 16, fontWeight: 500 }}>{item.number} kg</Text>
                                </View>
                            })}
                            <TouchableOpacity style={{ marginTop: 26, flex: 1 }} onPress={() => navigation.navigate('WeightHistory', weightList)}>
                                <Text style={{ color: '#4292ed', fontSize: 16, fontWeight: 500, justifyContent: 'center', textAlign: 'center' }}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            marginHorizontal: 10,
                            marginBottom: 40,
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            borderWidth: 0.3,
                            borderColor: '#afafaf',
                            padding: 16,
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Feather name="info" size={14} color={activeColor} style={{ marginTop: 4, marginRight: 5 }} />
                                <Text style={{ color: '#333333', fontSize: 16, fontWeight: 500 }}>Miễn trừ trách nhiệm</Text>
                            </View>
                            <View style={{ paddingVertical: 7 }}>
                                <Text style={{ color: '#727272', fontSize: 14, lineHeight: 20 }}>Công cụ trên không thể thay thế cho lời khuyên, chẩn đoán hoặc điều trị y khoa. Đừng bao giờ bỏ qua khuyến nghị từ bác sĩ chuyên khoa trong việc tìm cách điều trị vấn đề sức khỏe của bạn, thay vì chỉ đọc thông tin trên ứng dụng Medcare. Nếu bạn bị rối loạn ăn uống, kết quả tính chỉ số BMI sẽ không chính xác. Vì vậy, bạn nên tham vấn với bác sĩ hoặc chuyên gia y tế.</Text>
                            </View>
                        </View>
                    </ScrollView >
                </>
                : <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15 }}>
                    <View style={{
                        borderRadius: 10,
                        backgroundColor: '#fff',
                    }}>
                        {weightList?.map((item, index) => {
                            return (
                                <View key={index} style={{ paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', borderBottomWidth: 0.2, borderBottomColor: '#ccc', backgroundColor: index % 2 == 0 ? '#f8f9fd' : '#fff' }}>
                                    <Text style={{ marginRight: '46%', color: '#2b2b2b', fontSize: 16, fontWeight: 400 }}>{moment(item.date).format('DD/MM/YYYY')} {moment(item.time, 'HH:mm:ss').format('HH:mm')}</Text>
                                    <Text style={{ color: '#2b2b2b', fontSize: 16, fontWeight: 500 }}>{item.number} kg</Text>
                                </View>
                            )
                        })}

                    </View>

                </ScrollView >}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={{ ...styles.floatingButton }} onPress={() => setPopupVisible(true)}>
                    <Feather name="plus" size={22} color="white" />
                </TouchableOpacity>
                {/* tabs view */}
                <View style={styles.tabContainer}>
                    {bottomTabs.map((t) => (
                        <TouchableOpacity key={t.key} style={styles.tab} onPress={() => setBottomActiveTab(t.key)}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                {t.key === 1 ? (
                                    <Feather name="bar-chart-2" size={18} color={bottomActiveTab === t.key ? activeColor : defaultColor} />
                                ) : (
                                    <Feather name="info" size={18} color={bottomActiveTab === t.key ? activeColor : defaultColor} />
                                )}
                                <Text style={[styles.tabTitle, { color: bottomActiveTab === t.key ? activeColor : defaultColor }]}>{t.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <BottomSheet visible={isPopupVisible} onClose={() => setPopupVisible(false)}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.popupTitle}>Thêm số cân nặng</Text>
                        <TouchableOpacity onPress={() => setPopupVisible(false)} style={{ marginLeft: 'auto' }}>
                            <Feather name="x" size={24} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 40, marginTop: 30 }}>
                        <View style={{ flexDirection: 'row', marginRight: 60 }}>
                            <View style={{ backgroundColor: '#e2f2ff', borderRadius: 6, padding: 6 }}>
                                <Feather name="calendar" size={22} color={COLORS.textLabel} />
                            </View>
                            <Text style={{
                                color: '#262626',
                                fontSize: 17,
                                fontWeight: '500',
                                marginLeft: 7,
                                marginTop: 4
                            }}>{currentDate}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ backgroundColor: '#e2f2ff', borderRadius: 6, padding: 6 }}>
                                <Feather name="clock" size={22} color={COLORS.textLabel} />
                            </View>
                            <Text style={{
                                color: '#262626',
                                fontSize: 17,
                                fontWeight: '500',
                                marginLeft: 7,
                                marginTop: 4
                            }}>{currentTime}</Text>
                        </View>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        marginTop: 18,
                        marginBottom: 40
                    }}>
                        <Text
                            style={{
                                color: COLORS.textLabel,
                                fontSize: 14,
                                fontWeight: '400',
                            }}>Chỉ số hôm nay của con bạn (kg):</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput style={{ fontSize: 50, marginTop: 20, width: '90%', padding: 4, textAlign: 'center' }} placeholder={'00.0 '} onChangeText={value => setNumberWeight(value)} keyboardType='numeric'></TextInput>
                        </View>
                        <Text
                            style={{
                                color: COLORS.textLabel,
                                fontSize: 14,
                                fontWeight: '400',
                            }}>Nhập chiều cao của con bạn (cm):</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput style={{ fontSize: 50, marginTop: 20, width: '90%', padding: 4, textAlign: 'center' }} placeholder={'100 cm'} onChangeText={value => setNumberHeight(value)} keyboardType='numeric'></TextInput>
                        </View>
                    </View>
                    <View>
                        <Button title={'Cập nhật'} filled onPress={() => updateWeight()}></Button>
                    </View>
                </View>
            </BottomSheet >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column',
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
        marginTop: 2,
    },
    bottomContainer: {
        backgroundColor: '#fafafa',
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
        bottom: 28,
    },
    label: {
        color: COLORS.textLabel,
        fontSize: 14,
        fontWeight: "bold",
        marginHorizontal: 16
    },
    popupTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.textLabel,
        fontWeight: '500',
        marginLeft: Dimensions.get('window').width * 0.27,
    },
    medTabContainer: {
        marginBottom: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26,
        paddingVertical: 3,
        marginHorizontal: 40,
        borderWidth: 0.6,
        borderColor: '#e5e7ec',
    },
    medTab: {
        flex: 1,
        paddingVertical: 7,
        borderRadius: 26,
        marginHorizontal: 3,
    },
    medTabTitle: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500'
    },
});