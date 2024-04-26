import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import COLORS from '../constants/colors';
/**
 * 
 * @param  selectedMoment the moment() that initial calendar based on its week
 *  @param  onSelectDate the function when there event on select date on calendar, it will return moment data type
 * @returns 
 */
const HorizontalDateSlider = ({ selectedMoment, onSelectDate }) => {

    const [currentWeek, setCurrentWeek] = useState(selectedMoment || moment());
    const [selectedDate, setSelectedDate] = useState(selectedMoment || moment());
    const startOfWeek = currentWeek.clone().startOf('isoWeek');
    const endOfWeek = currentWeek.clone().endOf('isoWeek');
    const daysOfWeek = [];
    const today = moment();

    const handleDatePress = (date) => {
        setSelectedDate(date);
        onSelectDate(date);
    };

    useEffect(() => {
        setCurrentWeek(selectedMoment)
        setSelectedDate(selectedMoment)
    }, [selectedMoment])

    // Generate from monday to sunday based on selected week
    for (let current = startOfWeek.clone(); current.isSameOrBefore(endOfWeek); current.add(1, 'days')) {
        const index = parseInt(current.format('E'));
        const text = index < 7 ? `Th ${index + 1}` : 'CN';
        const isToday = current.isSame(today, 'day');
        daysOfWeek.push({ text, date: current.clone(), isToday });
    }

    const isEqualDate = (moment1, moment2) => {
        return moment1 && moment2 && moment1.isSame(moment2, 'day');
    };

    const goBack = () => {
        setCurrentWeek(currentWeek.clone().subtract(1, 'week'));
    };

    const goNext = () => {
        setCurrentWeek(currentWeek.clone().add(1, 'week'));
    };

    const goToCurrentWeek = () => {
        setCurrentWeek(moment())
        setSelectedDate(today)
        onSelectDate(today)
    }

    // Display view of selected date and have the buttons to go back to current date
    const renderSelectedOption = () => {
        const isBefore = selectedDate.isBefore(moment(), 'day')
        const isAfter = selectedDate.isAfter(moment(), 'day')
        return (
            <View style={styles.selectedOption}>
                <>
                    <TouchableOpacity style={{ ...styles.flexRowCenter, marginRight: 'auto', opacity: isBefore ? 1 : 0 }}
                        onPress={goToCurrentWeek}>
                        <Text style={{ color: '#9dc5ef' }}>Hôm nay  </Text>
                        <Feather name='chevrons-right' size={20} color={'#9dc5ef'} />
                    </TouchableOpacity>

                    <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                        {!isBefore && !isAfter && `Hôm nay, `}
                        {selectedDate.format('DD/MM/YYYY')}
                    </Text>

                    <TouchableOpacity style={{ ...styles.flexRowCenter, marginLeft: 'auto', opacity: isAfter ? 1 : 0 }}
                        onPress={goToCurrentWeek}>
                        <Feather name='chevrons-left' size={20} color={'#9dc5ef'} />
                        <Text style={{ color: '#9dc5ef' }}>  Hôm nay</Text>
                    </TouchableOpacity>
                </>
            </View>
        )
    }

    return (
        <View style={styles.content}>
            <View style={styles.calendar}>
                {/* Back button */}
                <TouchableOpacity style={styles.button} onPress={goBack}>
                    <Ionicons name='caret-back-outline' color={'white'} size={15} />
                </TouchableOpacity>
                {/* List calendar */}
                <View style={styles.list}>
                    {daysOfWeek.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.listItem, selectedDate && selectedDate.isSame(day.date, 'day') && styles.selectedItem]}
                            onPress={() => handleDatePress(day.date)}
                        >
                            <Text style={styles.dayText}>{day.text}</Text>
                            <Text style={styles.day}>{day.date.format('DD')}</Text>
                            {!isEqualDate(selectedDate, day.date) && day.isToday && <View style={styles.todayItem}></View>}
                        </TouchableOpacity>
                    ))}
                </View>
                {/* Next button */}
                <TouchableOpacity style={styles.button} onPress={goNext}>
                    <Ionicons name='caret-forward-outline' color={'white'} size={15} />
                </TouchableOpacity>
            </View>
            {selectedDate && renderSelectedOption()}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: COLORS.primary,
    },
    calendar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    button: {
        paddingHorizontal: 5,
    },
    list: {
        flexDirection: 'row',
    },
    listItem: {
        width: 40,
        height: 66,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 12,
        marginHorizontal: 5,
    },
    dayText: {
        color: '#fff',
        fontSize: 13,
    },
    day: {
        paddingVertical: 3,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    selectedItem: {
        backgroundColor: '#2743ae',
    },
    todayItem: {
        marginTop: 2,
        height: 4,
        width: 12,
        backgroundColor: 'white',
        borderRadius: 50,
    },
    selectedOption: {
        flexDirection: 'row',
        padding: 5,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 48,
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default memo(HorizontalDateSlider);
