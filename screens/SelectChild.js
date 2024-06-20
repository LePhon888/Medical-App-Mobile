import React, { useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    ScrollView,
    Text,
    TextInput, Dimensions
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { endpoints } from '../config/Apis';
import moment from 'moment/moment';
import { ActivityIndicator } from 'react-native-paper';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import BottomSheet from '../components/BottomSheet';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Button from '../components/Button';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import { set } from 'lodash';


export default function SelectChild({ navigation }) {
    const [child, setChild] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [birthday, setBirthday] = React.useState();
    const [firstName, setFirstName] = React.useState();
    const [lastName, setLastName] = React.useState();

    const toggleShowDatePicker = () => {
        setShowDatePicker(!showDatePicker)
    }
    const fetchChild = async () => {
        try {
            setLoading(true);
            const user = await AsyncStorage.getItem("user");
            const response = await Apis.get(endpoints.user + '/parent/' + JSON.parse(user).id);
            setChild(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching child:', error);
        }
    }
    useEffect(() => {
        fetchChild();
    }, []);

    const customIcons = [
        <AntDesign color="#1d1d1d" name="plus" size={24}
            onPress={() => setShowModal(true)} />
    ];

    const onChangeDate = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format('YYYY-MM-DD');
        setShowDatePicker(Platform.OS === 'ios');
        setBirthday(currentDate);
        toggleShowDatePicker();
    }
    const handleSubmit = async () => {
        if (!firstName || !lastName || !birthday) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Lỗi',
                text1: 'Vui lòng nhập đầy đủ thông tin',
                visibilityTime: 1000,
            });
            return;
        }
        try {
            setShowModal(false);
            const user = await AsyncStorage.getItem("user");
            const response = await Apis.post(endpoints.user + '/parent', {
                parentId: JSON.parse(user).id,
                firstName: firstName,
                lastName: lastName,
                birthday: birthday
            });
            setChild([...child, response.data]);
            setFirstName('');
            setLastName('');
            setBirthday('');
        } catch (error) {
            console.error('Error fetching create child:', error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <HeaderWithBackButton title="Chọn con của bạn" customIcons={customIcons} />
                {loading && <View style={{ marginTop: '70%' }}>
                    <ActivityIndicator animating={true} color={COLORS.primary} size="small" />
                </View>}
                <ScrollView>
                    <View style={styles.section}>
                        {child && child.map(({ id, firstName, lastName, birthday }, index) => {
                            let age = moment().diff(moment(birthday, "YYYY-MM-DD"), 'years');
                            if (age == 0) {
                                age = moment().diff(moment(birthday, "YYYY-MM-DD"), 'months');
                                age = age + ' tháng';
                            }
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        navigation.navigate('HealthChild', { childId: id });
                                    }}>
                                    <View
                                        style={[
                                            styles.radio,
                                        ]}>
                                        <View style={styles.avatarSM}>
                                            <Text style={styles.avatarSMText}>{firstName?.substring(0, 1).toUpperCase()}</Text>
                                        </View>
                                        <View style={{ display: 'flex' }}>
                                            <Text style={styles.radioLabel}>{lastName} {firstName}</Text>
                                            <Text style={{ fontSize: 14, fontWeight: 500, color: 'gray', marginTop: 3, marginLeft: -3, paddingBottom: 2 }}> {age} tuổi</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View >
            <BottomSheet visible={showModal} onClose={() => setShowModal(false)}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1d1d1d', marginBottom: 10, textAlign: 'center' }}>Nhập thông tin con của bạn</Text>
                        <TouchableOpacity onPress={() => setShowModal(false)} style={{ marginLeft: 'auto', marginTop: -4 }}>
                            <Feather name="x" size={24} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderRadius: 2, borderWidth: 0.2, paddingLeft: 10, paddingVertical: 10, marginVertical: 10 }}>
                        <TextInput placeholder='Họ và tên lót (*)'
                            onChangeText={value => { setLastName(value) }}
                        />
                    </View>
                    <View style={{ borderRadius: 2, borderWidth: 0.2, paddingLeft: 10, paddingVertical: 10, marginVertical: 10 }}>
                        <TextInput placeholder='Tên (*)'
                            onChangeText={value => { setFirstName(value) }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderRadius: 2, borderWidth: 0.2, paddingLeft: 10, paddingVertical: 16, marginVertical: 10 }}>
                        <Text style={{ color: !birthday ? '#747474' : 'black' }}>{birthday && 'Ngày sinh:'} {birthday ? moment(birthday).format("DD-MM-YYYY") : 'Ngày sinh (*)'}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>Ngày sinh của bé sẽ giúp chúng tôi cung cấp thông tin phù hợp với tuổi của bé</Text>
                    <Button title={'Xác nhận'} filled style={{ marginVertical: 10 }} onPress={() => handleSubmit()} />
                    {loading && <ActivityIndicator animating={true} color={COLORS.primary} size="small" />}
                </View>
            </BottomSheet>
            {showDatePicker && (
                <RNDateTimePicker value={new Date()} onChange={onChangeDate} maximumDate={new Date()} minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))} />
            )}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    headerClose: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
        marginTop: 14,
    },
    /** Section */
    section: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        paddingBottom: 12,
        fontSize: 12,
        fontWeight: '600',
        color: '#9e9e9e',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        marginLeft: 26,
        marginTop: -8,
    },
    /** Radio */
    radio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 56,
        backgroundColor: '#f1f2f6',
        borderRadius: 9999,
        marginBottom: 12,
        marginTop: 4,
    },
    radioImage: {
        width: 30,
        height: 30,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioLabel: {
        fontSize: 17,
        fontWeight: '500',
        color: '#1d1d1d',
    },
    radioCheck: {
        width: 22,
        height: 22,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
    },
    radioCheckActive: {
        backgroundColor: COLORS.primary,
        borderRadius: 9999,

    },
    avatarSM: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: COLORS.primary,
    },
    avatarSMText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    popupTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.textLabel,
        fontWeight: '500',
        marginLeft: Dimensions.get('window').width * 0.27,
    },
});