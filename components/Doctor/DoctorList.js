
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Apis, { endpoints } from '../../config/Apis';
import DoctorItemLoading from './DoctorItemLoading';
import { Category } from '../../screens';
import { useDoctorRating } from '../../context/DoctorRatingContext';
/** 
 * This one use to display list of doctors, include information about each doctor
 * @param onItemclickEvent (optional) Function to hanlde when click the item of the list, can navigate to the detail
 */
const DoctorList = ({ onItemclickEvent }) => {
    const [doctors, setDoctors] = useState([])
    const [isDataFetched, setDataFetched] = useState(false)
    const { doctorRating, storeDoctorRating } = useDoctorRating();
    useEffect(() => {
        const getDoctorList = async () => {
            try {
                const res = await Apis.get(`${endpoints["doctors"]}/`);
                setDoctors(res.data)
                setDataFetched(true)
            } catch (error) {
                console.error("Error fetching doctor list:", error);
            }
        };
        getDoctorList();
    }, []);

    useEffect(() => {
        // Check if doctorRating is not null
        if (doctorRating !== null) {
            // Find the index of the doctor in the doctors list
            const index = doctors.findIndex((doctor) => doctor.userId === doctorRating.doctorId);
            // If the doctor is found in the list
            if (index !== -1) {
                // Create a new array to hold the updated doctors
                const updatedDoctors = [...doctors];
                // Update the rating of the found doctor
                updatedDoctors[index].rating = doctorRating.rating;
                // Update the state with the updated doctors list
                setDoctors(updatedDoctors);
            }
        }
    }, [doctorRating]);




    // On click item
    const onItemClick = (item) => {
        onItemclickEvent(item)
    }

    if (doctors.length === 0) {
        return <DoctorItemLoading />
    }


    const renderItem = (item, index) => (
        <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => onItemClick(item.userId)}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <View style={styles.flexRow}>
                        <Text style={styles.name}>{item.title} {item.fullName}</Text>
                        {item.rating && item.rating > 0 ? (
                            <View style={styles.rating}>
                                <Text style={{ fontSize: 10 }}>⭐</Text>
                                <Text style={{ fontWeight: '500' }}>{` ${item.rating.toFixed(1)}/5`}</Text>
                            </View>
                        ) : ""}
                    </View>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.department}><Icon name='git-branch-outline' /> {item.departmentName}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.hospital}><Icon name='location-outline' /> {item.hospital}</Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={styles.consultation}>Tư vấn từ xa</Text>
                    </View>

                </View>
            </View>
            <View style={styles.dashedLine}></View>
            {/* <View style={{ flexDirection: 'row' }}>
                {item.target.split(',').map((label, index) => {
                    return (<Text style={styles.target} key={index}>{label}</Text>)
                })}
            </View> */}
            {/* Fee */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.dollar}>
                    <Feather name='dollar-sign' color={'#f0983f'} size={12} />
                </View>
                <Text style={styles.fee}>
                    Phí tư vấn từ xa: <Text style={{ fontSize: 13, color: '#0e8558', fontWeight: '500' }}>{` ${Number(item.fee).toLocaleString('vi-VN')} đ`}</Text></Text>
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
    //{/* Next appointment and schedule */}
    // <View style={styles.nextAppointmentContainer}>
    //     <Text style={styles.nextAppointment}>Giờ đặt tiếp theo</Text>
    //     <Text style={styles.appointmentTime}> {item.nextAppointment.date} - {item.nextAppointment.time}</Text>
    //     <View style={styles.verticalLine}></View>
    //     <TouchableOpacity style={styles.flexRow} onPress={() => console.log('clickled the child')}>
    //         <Text style={styles.appoint}>Đặt hẹn </Text>
    //         <Feather size={20} style={{ color: '#4581cc' }} name='chevron-right'></Feather>
    //     </TouchableOpacity>
    // </View>
    // />

    return (
        <ScrollView key='Doctors' style={styles.container} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {isDataFetched ? (
                doctors.length > 0 && doctors.map((item, index) => {
                    return renderItem(item, index)
                })
            ) : <DoctorItemLoading />}
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
        width: '70%'
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
        fontSize: 12,
        fontWeight: '500',
        color: '#0e8558',
        borderWidth: 1,
        backgroundColor: '#d7ffed',
        borderColor: '#0e8558',
        borderRadius: 15,
    },
    rating: {
        marginLeft: 'auto',
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
        color: '#636e72',
    },
    nextAppointmentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e1f1ff',
        padding: 8,
        borderRadius: 5
    },
    nextAppointment: {
        fontSize: 12,
    },
    appointmentTime: {
        fontSize: 12,
        fontWeight: '500'
    },
    appoint: {
        marginLeft: 5,
        fontSize: 12,
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
        fontSize: 12,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        backgroundColor: '#faf9fe',
        color: '#636e72'
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