import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Doctors from '../assets/SampleDoctors.json';
import ViewMap from '../components/ViewMap';
import MapView from 'react-native-maps';
import COLORS from '../constants/colors';
import Apis, { endpoints } from '../config/Apis';
import BulletContent from '../components/Doctor/BulletContent';
import SkeletonLoading from '../components/Doctor/DoctorDetailLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RatingContent from '../components/Doctor/RatingContent';
import ToastConfig from '../components/ToastConfig';
/**
 * The doctor detail screen
 * 
 * @returns 
 */
const DoctorDetail = ({ navigation, route }) => {

    const doctorId = route.params // get the doctorId from route
    const [doctor, setDoctor] = useState(null)
    const [detail, setDetail] = useState([]);
    const [rating, setRating] = useState([])
    const [ratingStats, setRatingStats] = useState([])
    const [isEnableRating, SetEnableRating] = useState(false)
    const [isDataFetched, setDataFetched] = useState(false)
    const [activeTab, setActiveTab] = useState(1); // set the active tab with key 1
    const [showFullInfo, setShowFullInfo] = useState(false); // this one use as a flag for read more button
    const [userId, setUserId] = useState(null)
    const height = useRef(new Animated.Value(0)).current

    const toggleReadMore = () => {
        setShowFullInfo(!showFullInfo);
    };

    const tabs = [
        { key: 1, title: 'Thông tin cơ bản' },
        { key: 2, title: `Đánh giá ${rating.length > 0 ? `(${rating.length})` : ''}` },
    ];

    const onBack = () => {
        navigation.goBack()
    }

    const onScrollEvent = (event) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const newHeight = scrollY > 400 ? 50 : 0;
        height.setValue(newHeight);
    };

    const [scaleValue] = useState(new Animated.Value(1));

    const handleTabPress = (key) => {
        setActiveTab(key);
    };

    const getRating = async () => {
        /* Get rating for current doctor */
        const rating = await Apis.get(`${endpoints["rating"]}/${doctorId}`)
        setRating(rating.data)
        /* Get rating stats for current doctor */
        const ratingStats = await Apis.get(`${endpoints["rating"]}/stats/${doctorId}`)
        setRatingStats(ratingStats.data)
    }

    useEffect(() => {
        const getData = async () => {
            try {
                /* Get the basic information for current doctor */
                const doctor = await Apis.get(`${endpoints["doctors"]}/detail/${doctorId}`);
                setDoctor(doctor.data);
                /* Get details for current doctor */
                const detail = await Apis.get(`${endpoints["doctorDetail"]}/${doctorId}`);
                setDetail(detail.data);
                /* Check if current login user have existed appointment, then we allow this user to rating */
                const currentUser = await AsyncStorage.getItem("user");
                if (currentUser) {
                    const countAppointment = await Apis.get(`${endpoints["appointment"]}/count?doctorId=${doctorId}&userId=${JSON.parse(currentUser).id}`);
                    SetEnableRating(countAppointment.data > 0);
                    setUserId(JSON.parse(currentUser).id)
                }
                setDataFetched(true)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (doctorId) {
            getData();
            getRating()
        }
    }, [doctorId]);


    if (!isDataFetched) {
        return <SkeletonLoading onBack={onBack} />;
    }

    if (!doctor) {
        return <></>
    }

    const refreshRating = () => {
        getRating()
    }

    return (
        <>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]} onScroll={onScrollEvent} scrollEventThrottle={16}>
                {/* Header */}
                <ScrollView style={styles.header}>
                    <View style={{ ...styles.flexRowCenter }}>
                        {/* Back icon */}
                        <TouchableOpacity style={styles.backIcon} onPress={onBack}>
                            <Ionicons size={20} name="chevron-back-outline"></Ionicons>
                        </TouchableOpacity>
                        {/* Rating and favourite */}
                        <View style={{ ...styles.flexRowCenter, marginLeft: 'auto' }}>
                            {/* rating */}
                            {doctor.rating && doctor.rating > 0 ? (
                                <View style={styles.rating}>
                                    <Text style={{ fontSize: 10, marginRight: 5 }}>⭐</Text>
                                    <Text style={{ fontWeight: '500' }}>{`${doctor.rating}/5`}</Text>
                                </View>
                            ) : ""}
                            {/* favourite */}
                            {/* <View style={styles.favourite}><MaterialCommunityIcons size={20} name="heart-plus-outline" /></View> */}
                        </View>
                    </View>
                </ScrollView>
                {/* Doctor Info */}
                <View>
                    <View style={styles.avatarContainer}>
                        {/* Avatar */}
                        <Image source={{ uri: doctor.image }} style={styles.avatar} />
                        {/* Center content */}
                        <View style={{ alignItems: 'center' }}>
                            {/* Name */}
                            <Text style={styles.name}>BS.CKI {doctor.fullName}</Text>
                            {/* Department */}
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.department}>{doctor.departmentName}</Text>
                            {/* consultation */}
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}><Text style={styles.consultation}>{doctor.consultation}</Text></View>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        {/* Target: adult or children */}
                        <View style={{ flexDirection: 'row', marginBottom: 10, }}>
                            {doctor.target.split(',').map((label, index) => {
                                return (<Text style={styles.target} key={index}>{label}</Text>)
                            })}
                        </View>
                    </View>
                    {/* Fee & Andress*/}
                    <View style={{ paddingHorizontal: 15 }}>
                        <View style={styles.flexRowCenter}>
                            <View style={styles.dollar}><Feather name='dollar-sign' color={'#f19534'} size={12} /></View>
                            <Text style={styles.fee}>Phí thăm khám cố định<Text style={{ fontSize: 13, color: '#0e8558', fontWeight: '500' }}>{` ${Number(doctor.fee).toLocaleString('vi-VN')} đ`}</Text></Text>
                        </View>
                        {/* Address */}
                        <View style={styles.flexRowCenter}>
                            <View style={styles.dollar}><MaterialCommunityIcons name='map-marker-outline' color={'#f19534'} size={12} /></View>
                            <Text style={[styles.fee, { color: '#676767', fontWeight: '400' }]}>{doctor.hospitalAddress}</Text>
                        </View>
                    </View>
                </View>
                {/* Tab View for switching info and rating */}
                <View style={{ backgroundColor: 'white' }}>
                    {/* Sticky header */}
                    <Animated.View style={{ ...styles.flexRowCenter, ...styles.content, height: height }}>
                        {/* Back icon */}
                        <TouchableOpacity onPress={onBack}>
                            <Ionicons size={20} name="chevron-back-outline" />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ ...styles.name, marginLeft: 5 }}>BS.CKI {doctor.fullName}</Text>
                        </View>
                        {/* Favourite */}
                        <View style={{ ...styles.flexRowCenter, marginLeft: 'auto' }}>
                            <MaterialCommunityIcons size={20} name="heart-plus-outline" />
                        </View>
                    </Animated.View>
                    {/* Sticky tab */}
                    <View style={styles.tabContainer}>
                        {tabs.map((t) => (
                            <TouchableOpacity key={t.key}
                                style={[styles.tab, {
                                    backgroundColor: activeTab === t.key ? COLORS.primary : '#f8f9fd',
                                    transform: [{ scale: scaleValue }],
                                },]}
                                onPress={() => handleTabPress(t.key)}>
                                <Text style={[styles.tabTitle, { color: activeTab === t.key ? '#FFFF' : '#504f54' }]}>{t.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{ ...styles.content, display: activeTab === 1 ? 'flex' : 'none' }}>
                    {/* Infomation */}
                    <View style={styles.info}>
                        <View style={{ ...styles.flexRowCenter, marginBottom: 10 }}>
                            <View style={styles.infoIcon}><Ionicons name='information' color={'#f49d41'} size={15} /></View>
                            <Text style={styles.infoTitle}>Thông Tin Bác Sĩ</Text>
                        </View>
                        <Text numberOfLines={showFullInfo ? undefined : 2} ellipsizeMode="tail" style={styles.infoText}>BS.CKI {doctor.fullName} {doctor.information}</Text>
                        {/* Read more button */}
                        <TouchableOpacity onPress={toggleReadMore}><Text style={styles.buttonReadMore}>{showFullInfo ? 'Thu gọn' : 'Xem thêm'}</Text></TouchableOpacity>
                    </View>
                    {/* Experience  */}
                    <View>
                        {detail.length > 0 && detail.some(item => item.category === "Kinh Nghiệm") && (
                            <BulletContent
                                field={detail.filter(item => item.category === "Kinh Nghiệm")}
                                title="Kinh Nghiệm"
                                iconComponent={(<FontAwesome name={'star'} color={'#f49d41'} size={10} />)}
                            />
                        )}
                    </View>
                    {/* Education  */}
                    <View>
                        {detail.length > 0 && detail.some(item => item.category === "Quá trình đào tạo") && (
                            <BulletContent
                                field={detail.filter(item => item.category === "Quá trình đào tạo")}
                                title="Quá Trình Đào Tạo"
                                iconComponent={(<MaterialCommunityIcons name={'certificate'} color={'#f49d41'} size={13} />)}
                            />
                        )}
                    </View>

                    {/* Map */}
                    <View style={styles.info}>
                        <View style={{ ...styles.flexRowCenter, marginBottom: 20 }}>
                            <View style={styles.infoIcon}><MaterialCommunityIcons name='map-marker-outline' color={'#f19534'} size={15} /></View>
                            <Text style={styles.infoTitle}>Địa Chỉ Bệnh Viện</Text>
                        </View>
                        {/* <ViewMap height={170} /> */}
                        <View style={styles.mapText}>
                            <Text style={styles.bulletTitle}>{doctor.hospital}</Text>
                            <Text style={styles.bulletSubTitle}>{doctor.hospitalAddress}</Text>
                        </View>
                    </View>
                </View>
                {/* Rating View */}
                {activeTab === 2 && (
                    <RatingContent
                        doctorId={doctorId}
                        userId={userId}
                        ratingStats={ratingStats}
                        listRating={rating}
                        doctorRating={doctor.rating}
                        enableRating={isEnableRating}
                        refreshRating={refreshRating} />
                )}
            </ScrollView >
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity style={styles.buttonSchedule} onPress={() => navigation.navigate("AppointmentRegister", doctor)}                >
                    <Text style={styles.textSchedule}>Đặt lịch hẹn</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

{/* Payment type */ }
//  <View style={styles.info}>
//  <View style={{ ...styles.flexRowCenter, marginBottom: 15 }}>
//      <View style={styles.infoIcon}><Feather name='dollar-sign' color={'#f19534'} size={15} /></View>
//      <Text style={styles.infoTitle}>Hình thức thanh toán</Text>
//  </View>
//  <View style={styles.paymentList}>
//      {doctor.payment.map((payment, index) => (
//          <View key={index} style={styles.paymentItem}>
//              <View style={styles.paymentImageContainer}>
//                  <Image source={{ uri: payment.image }} style={styles.paymentImage} />
//              </View>
//              <Text style={styles.paymentText}>{payment.title}</Text>
//          </View>
//      ))}
//  </View>
// </View>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    flexRowCenter: {
        flexDirection: 'row', alignItems: 'center',
    },
    header: {
        paddingHorizontal: 10,
        backgroundColor: '#d5ecfe',
        paddingTop: 20,
        paddingBottom: '20%',
    },
    backIcon: {
        padding: 6,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 10,
        color: '#212025',
        backgroundColor: '#faf9fe',
        borderRadius: 10,
    },
    favourite: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    avatarContainer: {
        top: -10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 150
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 4
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#425463',
    },
    department: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    consultation: {
        marginTop: 3,
        paddingVertical: 3,
        paddingHorizontal: 10,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        color: '#0e8558',
        borderWidth: 1,
        backgroundColor: '#d7ffed',
        borderColor: '#0e8558',
        borderRadius: 15,
    },
    content: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    target: {
        borderRadius: 15,
        fontSize: 13,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        backgroundColor: '#faf9fe',
    },
    dollar: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 25,
        padding: 1,
        marginRight: 7,
    },
    fee: {
        marginVertical: 5,
        fontSize: 13,
        color: '#282828',
        marginRight: 10,
        lineHeight: 1.5 * 13
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: 'white',
        paddingVertical: 5,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tabTitle: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    info: {
        marginVertical: 12,
    },
    infoIcon: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: 9,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoTitle: {
        color: '#262626',
        fontWeight: 'bold'
    },
    infoText: {
        fontSize: 14,
        marginTop: 10,
        lineHeight: 1.5 * 14
    },
    buttonReadMore: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 5,
    },
    bulletPoint: {
        marginLeft: 5,
        flexDirection: 'row',
        marginVertical: 7,
        alignItems: 'baseline'
    },
    bulletContent: {
        marginLeft: 15
    },
    bulletTitle: {
        fontWeight: 'bold',
        color: '#000',
        lineHeight: 1.5 * 14
    },
    bulletSubTitle: {
        color: '#595959',
        lineHeight: 1.5 * 14
    },
    bulletIcon: {
        marginHorizontal: 4,
    },
    buttonSchedule: {
        backgroundColor: COLORS.primary,
        marginVertical: 10,
        marginHorizontal: 14,
        borderRadius: 5,
    },
    textSchedule: {
        paddingVertical: 12,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
    },
    mapText: {
        padding: 16,
        backgroundColor: '#f8f9fd'
    },
    paymentList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    paymentItem: {
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 10,
    },
    paymentText: {
        marginTop: 5,
        color: '#595959',
        fontSize: 12,
    },
    paymentImageContainer: {
        paddingVertical: 1,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#d5d6d8'
    },
    paymentImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});

export default DoctorDetail;
