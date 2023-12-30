
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import doctors from "../../assets/SampleDoctors.json"
/** 
 * This one use to display list of doctors, include information about each doctor
 * @param onItemclickEvent (optional) Function to hanlde when click the item of the list, can navigate to the detail
 */
const DoctorList = ({ onItemclickEvent }) => {

    // On scroll list item
    const onScroll = (event) => {
        if (onScrollEvent) {
            const offsetY = event.nativeEvent.contentOffset.y;
            const isOnTop = offsetY <= 50;
            onScrollEvent(isOnTop)
        }
    }

    // On click item
    const onItemClick = (item) => {
        onItemclickEvent(item)
    }

    const renderItem = (item, index) => (
        <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => onItemClick(item)}>
            {/* Avatar, Name, Rating, Department, Direct or Indirect */}
            <View style={{ flexDirection: 'row' }}>
                {/* Avatar */}
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {/* Info container */}
                <View style={styles.textContainer}>
                    <View style={styles.flexRow}>
                        {/* Name */}
                        <Text style={styles.name}>BS.CKI {item.name}</Text>
                        {/* Rating */}
                        {item.rating && item.rating > 0 ? (
                            <View style={styles.rating}>
                                <Text style={{ fontSize: 10 }}>⭐</Text>
                                <Text style={{ fontWeight: '500' }}>{` ${item.rating}/5`}</Text>
                            </View>
                        ) : ""}
                    </View>
                    {/* Department, hospital */}
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.department}><Icon name='git-branch-outline' /> {item.department}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hospital}><Icon name='location-outline' /> {item.hospital}</Text>
                    {/* Consultation */}
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={styles.consultation}>{item.consultation}</Text>
                    </View>

                </View>
            </View>
            {/* Dashed line */}
            <View style={styles.dashedLine}></View>
            {/* Target: children or adult */}
            <View style={{ flexDirection: 'row' }}>
                {item.target.map((target, index) => (
                    <Text style={styles.target} key={index}>
                        {target === 'adult' ? 'Dành cho người lớn' : target === 'children' ? 'Dành cho trẻ em' : ''}
                    </Text>
                ))}
            </View>
            {/* Fee */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.dollar}>
                    <Feather name='dollar-sign' color={'#f0983f'} size={12} />
                </View>
                <Text style={styles.fee}>
                    Phí thăm khám cố định<Text style={{ fontSize: 13, color: '#0e8558', fontWeight: '500' }}>{` ${Number(item.fee).toLocaleString('vi-VN')} đ`}</Text></Text>
            </View>
            {/* Next appointment and appoint*/}
            <View style={styles.nextAppointmentContainer}>
                <Text style={styles.nextAppointment}>Giờ đặt tiếp theo</Text>
                <Text style={styles.appointmentTime}> {item.nextAppointment.date} - {item.nextAppointment.time}</Text>
                <View style={styles.verticalLine}></View>
                <TouchableOpacity style={styles.flexRow} onPress={() => console.log('clickled the child')}>
                    <Text style={styles.appoint}>Đặt hẹn </Text>
                    <Feather size={20} style={{ color: '#4581cc' }} name='chevron-right'></Feather>
                </TouchableOpacity>
            </View>
        </TouchableOpacity >
    );
    //     <FlatList
    //     data={doctors}
    //     renderItem={renderItem}
    //     keyExtractor={(item) => item.name}
    //     style={styles.container}
    //     showsVerticalScrollIndicator={false}
    //     scrollEventThrottle={16}
    //     onScroll={onScroll}
    // />
    return (
        <ScrollView key='Doctors' style={styles.container} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {doctors && doctors.length > 0 && (
                doctors.map((item, index) => {
                    return renderItem(item, index)
                })
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        marginVertical: 5,
        padding: 12,
        borderWidth: 0.8,
        borderRadius: 10,
        borderColor: '#eaeaea',
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#425463',
    },
    department: {
        fontSize: 13,
        color: '#666',
        marginVertical: 5,
    },
    hospital: {
        fontSize: 13,
        color: '#666',
    },
    consultation: {
        marginTop: 7,
        marginBottom: 3,
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
    fee: {
        marginVertical: 10,
        fontSize: 13,
        color: '#282828',
    },
    nextAppointmentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e1f1ff',
        padding: 8,
        borderRadius: 5
    },
    nextAppointment: {
        fontSize: 13,
    },
    appointmentTime: {
        fontSize: 13,
        fontWeight: '500'
    },
    appoint: {
        marginLeft: 10,
        fontSize: 13,
        color: '#4581cc',
        fontWeight: 'bold',
        alignItems: 'center',
    },
    dashedLine: {
        borderBottomWidth: 2,
        borderBottomColor: '#e7e7e7',
        opacity: 0.5,
        borderStyle: 'dashed',
        width: '100%',
        marginVertical: 10,
    },
    target: {
        borderRadius: 15,
        fontSize: 13,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        backgroundColor: '#faf9fe'
    },
    dollar: {
        borderWidth: 1,
        borderColor: '#4d85be',
        borderRadius: 25,
        padding: 1,
        marginRight: 5,
    },
    verticalLine: {
        marginLeft: 'auto',
        height: '100%',
        width: 2,
        backgroundColor: '#cadff0',
    },

});
export default DoctorList