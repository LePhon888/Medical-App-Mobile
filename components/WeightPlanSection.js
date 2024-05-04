import React, { useEffect, useState } from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Feather from "react-native-vector-icons/Feather"
import COLORS from '../constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Apis, { endpoints } from '../config/Apis'

const WeightPlanSection = ({ navigation }) => {
    const [newWeight, setNewWeight] = useState(null);

    useEffect(() => {
        const fetchNewWeight = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                const response = await Apis.get(endpoints.weight + '/new/' + JSON.parse(user).id);
                setNewWeight(response.data[0]);
            } catch (error) {
                console.error('Error fetching new weight:', error);
            }
        }
        fetchNewWeight();
    }, []);
    return (
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <View style={styles.section}>
                <View style={[styles.flexRowCenter]}>
                    <Image source={require('../assets/images/bathroom-scale.png')} style={{ width: 32, height: 32 }} />
                    <Text style={styles.title}>{'Cân nặng hiện tại'}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Weight")}>
                        <Feather
                            name="arrow-up-right"
                            size={20}
                            style={{
                                backgroundColor: COLORS.toastInfo,
                                color: COLORS.white,
                                borderRadius: 99,
                                padding: 4,
                            }}
                        />
                    </TouchableOpacity>

                </View>
                <View style={styles.medicationReminderStats}>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#898989', borderBottomWidth: 0.2, borderColor: '#c0bcbc', paddingBottom: 5 }}>Cân nặng</Text>
                        <Text style={{ fontWeight: 600, fontSize: 18, paddingTop: 5 }}>{newWeight?.weight} 68</Text>
                        <Text style={{ color: '#898989', marginTop: 5 }}>{newWeight?.weight} (kg)</Text>
                    </View>
                    <View style={{ width: '40%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#898989', borderBottomWidth: 0.2, borderColor: '#c0bcbc', paddingBottom: 5 }}>BMI</Text>
                        <Text style={{ fontWeight: 600, fontSize: 18, paddingTop: 5 }}>{newWeight?.bmi}</Text>
                        <Text style={{ color: '#898989', marginTop: 5 }}>{newWeight?.classification}</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#898989', borderBottomWidth: 0.2, borderColor: '#c0bcbc', paddingBottom: 5 }}>BMR</Text>
                        <Text style={{ fontWeight: 600, fontSize: 18, paddingTop: 5 }}>{newWeight?.bmr}</Text>
                        <Text style={{ color: '#898989', marginTop: 5 }}>(kcal)</Text>
                    </View>
                </View>
            </View >
        </View >
    )
}

export default WeightPlanSection

const styles = StyleSheet.create({
    section: {
        backgroundColor: 'white',
        borderColor: '#f0f0f0',
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
        fontSize: 17,
        fontWeight: '500'
    },
    medicationReminderStats: {
        flexDirection: 'row',
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
