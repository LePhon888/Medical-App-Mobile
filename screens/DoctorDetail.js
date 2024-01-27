import React, { useRef, useState } from 'react';
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
/**
 * The doctor detail screen
 * 
 * @returns 
 */
const DoctorDetail = ({ navigation, route }) => {

    const { doctor } = route.params // get the doctor object from route
    const [activeTab, setActiveTab] = useState(1); // set the active tab with key 1
    const [showFullInfo, setShowFullInfo] = useState(false); // this one use as a flag for read more button
    const height = useRef(new Animated.Value(0)).current

    const toggleReadMore = () => {
        setShowFullInfo(!showFullInfo);
    };

    const tabs = [
        { key: 1, title: 'Thông tin cơ bản', },
        { key: 2, title: 'Đánh giá' },
    ];

    const onBack = () => {
        navigation.goBack()
    }

    const onScrollEvent = (event) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const newHeight = scrollY > 400 ? 50 : 0;
        height.setValue(newHeight);
    };

    const Header = () => {
        return (
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
                                <Text style={{ fontSize: 10 }}>⭐</Text>
                                <Text style={{ fontWeight: '500' }}>{`${doctor.rating}/5`}</Text>
                            </View>
                        ) : ""}
                        {/* favourite */}
                        <View style={styles.favourite}><MaterialCommunityIcons size={20} name="heart-plus-outline" /></View>
                    </View>
                </View>
            </ScrollView>
        )
    }

    const DoctorInfo = () => {
        return (
            <View>
                <View style={styles.avatarContainer}>
                    {/* Avatar */}
                    <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
                    {/* Center content */}
                    <View style={{ alignItems: 'center' }}>
                        {/* Name */}
                        <Text style={styles.name}>BS.CKI {doctor.name}</Text>
                        {/* Department */}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.department}>{doctor.department}</Text>
                        {/* consultation */}
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}><Text style={styles.consultation}>{doctor.consultation}</Text></View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    {/* Target: adult or children */}
                    <View style={{ flexDirection: 'row', marginBottom: 10, }}>
                        {doctor.target.map((target, index) => (
                            <Text style={styles.target} key={index}>
                                {target === 'adult' ? 'Dành cho người lớn' : target === 'children' ? 'Dành cho trẻ em' : ''}
                            </Text>
                        ))}
                    </View>
                    {/* Fee */}
                    <View style={styles.flexRowCenter}>
                        <View style={styles.dollar}><Feather name='dollar-sign' color={'#f19534'} size={12} /></View>
                        <Text style={styles.fee}>Phí thăm khám cố định<Text style={{ fontSize: 13, color: '#0e8558', fontWeight: '500' }}>{` ${Number(doctor.fee).toLocaleString('vi-VN')} đ`}</Text></Text>
                    </View>
                    {/* Address */}
                    <View style={styles.flexRowCenter}>
                        <View style={styles.dollar}><MaterialCommunityIcons name='map-marker-outline' color={'#f19534'} size={12} /></View>
                        <Text style={[styles.fee, { color: '#676767', fontWeight: '400' }]}>{doctor.address}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const Tabs = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                {/* Sticky header */}
                <Animated.View style={{ ...styles.flexRowCenter, ...styles.content, height: height }}>
                    {/* Back icon */}
                    <TouchableOpacity onPress={onBack}>
                        <Ionicons size={20} name="chevron-back-outline" />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ ...styles.name, marginLeft: 5 }}>BS.CKI {doctor.name}</Text>
                    </View>
                    {/* Favourite */}
                    <View style={{ ...styles.flexRowCenter, marginLeft: 'auto' }}>
                        <MaterialCommunityIcons size={20} name="heart-plus-outline" />
                    </View>
                </Animated.View>
                {/* Sticky tab */}
                <View style={styles.tabContainer}>
                    {tabs.map((t) => (
                        <TouchableOpacity
                            key={t.key} style={[styles.tab, { backgroundColor: activeTab === t.key ? COLORS.primary : '#f8f9fd' }]}
                            onPress={() => setActiveTab(t.key)}>
                            <Text style={[styles.tabTitle, { color: activeTab === t.key ? '#FFFF' : '#504f54' }]}>{t.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        )
    }

    const TabContentInfo = () => {
        return (
            <View style={styles.content}>
                {/* Infomation */}
                <View style={styles.info}>
                    <View style={{ ...styles.flexRowCenter, marginBottom: 10 }}>
                        <View style={styles.infoIcon}><Ionicons name='information' color={'#f49d41'} size={15} /></View>
                        <Text style={styles.infoTitle}>Thông tin bác sĩ</Text>
                    </View>
                    <Text numberOfLines={showFullInfo ? 99 : 2} ellipsizeMode="tail" style={styles.infoText}>BS.CKI {doctor.name} {doctor.info}</Text>
                    {/* Read more button */}
                    <TouchableOpacity onPress={toggleReadMore}><Text style={styles.buttonReadMore}>{showFullInfo ? 'Thu gọn' : 'Xem thêm'}</Text></TouchableOpacity>
                </View>
                {/* Experience */}
                <BulletContent field={doctor.experience} title={'Kinh nghiệm'}
                    iconComponent={(<FontAwesome name={'star'} color={'#f49d41'} size={10} />)}
                    itemTitle={"title"} itemSubtitle={"location"} itemDuration={"duration"} />
                {/* Education */}
                <BulletContent field={doctor.education} title={'Quá trình đào tạo'}
                    iconComponent={(<MaterialCommunityIcons name={'certificate'} color={'#f49d41'} size={13} />)}
                    itemTitle={"degree"} itemSubtitle={"school"} itemDuration={"year"} />
                {/* Map */}
                <View style={styles.info}>
                    <View style={{ ...styles.flexRowCenter, marginBottom: 20 }}>
                        <View style={styles.infoIcon}><MaterialCommunityIcons name='map-marker-outline' color={'#f19534'} size={15} /></View>
                        <Text style={styles.infoTitle}>Địa chỉ bệnh viện</Text>
                    </View>
                    <ViewMap height={170} />
                    <View style={styles.mapText}>
                        <Text style={styles.bulletTitle}>{doctor.hospital}</Text>
                        <Text style={styles.bulletSubTitle}>{doctor.address}</Text>
                    </View>
                </View>
                {/* Payment type */}
                <View style={styles.info}>
                    <View style={{ ...styles.flexRowCenter, marginBottom: 15 }}>
                        <View style={styles.infoIcon}><Feather name='dollar-sign' color={'#f19534'} size={15} /></View>
                        <Text style={styles.infoTitle}>Hình thức thanh toán</Text>
                    </View>
                    <View style={styles.paymentList}>
                        {doctor.payment.map((payment, index) => (
                            <View key={index} style={styles.paymentItem}>
                                <View style={styles.paymentImageContainer}>
                                    <Image source={{ uri: payment.image }} style={styles.paymentImage} />
                                </View>
                                <Text style={styles.paymentText}>{payment.title}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        )
    }

    const BulletContent = ({ field, title, iconComponent, itemTitle, itemSubtitle, itemDuration }) => {
        return (
            <View style={styles.info}>
                {/* Icon and title */}
                <View style={{ ...styles.flexRowCenter, marginBottom: 10 }}>
                    <View style={styles.infoIcon}>{iconComponent}</View>
                    <Text style={styles.infoTitle}>{title}</Text>
                </View>
                {/* Bullet list */}
                {field.map((item, index) => (
                    <View key={index} style={styles.bulletPoint}>
                        <View style={styles.bulletIcon}>
                            <FontAwesome name='circle' color={'black'} size={5} />
                        </View>
                        <View style={styles.bulletContent}>
                            <Text style={styles.bulletTitle}>{item[itemTitle]}</Text>
                            <Text style={styles.bulletSubTitle}>{`${item[itemSubtitle]}\n${item[itemDuration]}`}</Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]} onScroll={onScrollEvent} scrollEventThrottle={16}>
                {/* Header */}
                <Header />
                {/* Doctor Info */}
                <DoctorInfo />
                {/* Tab View for switching info and rating */}
                <Tabs />
                {activeTab === 1 && <TabContentInfo />}
            </ScrollView>
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity style={styles.buttonSchedule}>
                    <Text style={styles.textSchedule}>Đặt lịch hẹn</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

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
        padding: 10,
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
