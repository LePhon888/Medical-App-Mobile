import React, { useEffect, useRef, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";
import moment from "moment";
import { formatDateMoment } from "../config/date";
import { Picker } from "@react-native-picker/picker";
const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
};
/**
 * 
 * @param  startDateIn initial start date in the calendar
 * @param  endDateIn initial end date in the calendar
 * @param onSelectedDateRange return the callback function with 2 params (startDate, endDate)
 * @param style use this to override the position of this popup
 * @returns 
 */
const DateRangePicker = ({ startDateIn, endDateIn, onSelectedDateRange, style }) => {
    const [year, setYear] = useState(moment().year());
    const [month, setMonth] = useState(moment().month());
    const [startDate, setStartDate] = useState(startDateIn);
    const [endDate, setEndDate] = useState(endDateIn);
    const [dateList, setDateList] = useState([]);
    const [isDone, setDone] = useState(false) // Indicating whether the user already selected the date range
    const [isFecthed, setFetched] = useState(false)// Indicating whether the data is already generated
    const pickerRef = useRef()
    const months = Array.from({ length: 12 }, (_, index) => index);

    const decreaseMonth = () => {
        setMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setYear((prevYear) => (month === 0 ? prevYear - 1 : prevYear));
    };

    const increaseMonth = () => {
        setMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        setYear((prevYear) => (month === 11 ? prevYear + 1 : prevYear));
    };

    const toggleMonthPicker = () => {
        pickerRef.current.focus();
    }

    const clearSelection = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const handleDayPress = (day) => {
        if (startDate && endDate) {
            clearSelection();
            setStartDate(day);
        } else if (!startDate) {
            setStartDate(day);
        } else if (startDate > day) {
            setEndDate(startDate);
            setStartDate(day);
            setDone(true)
        } else if (day > startDate) {
            setEndDate(day);
            setDone(true)
        } else if (moment(startDate).isSame(moment(day))) {
            setEndDate(day)
            setDone(true)
        }
    };

    useEffect(() => {
        if (isDone) {
            onSelectedDateRange(
                formatDateMoment(moment(startDate)),
                formatDateMoment(moment(endDate || startDate))
            );
            setDone(false)
        }
    }, [isDone]);


    const generateDaysArray = () => {
        setFetched(false);
        const daysInMonth = getDaysInMonth(year, month + 1); // Adjusted month indexing
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // Adjusted month indexing

        const daysArray = [];

        const daysFromPrevMonth = getDaysInMonth(year, month) - firstDayOfMonth + 1; // Adjusted month indexing
        for (let i = daysFromPrevMonth; i <= getDaysInMonth(year, month); i++) { // Adjusted month indexing
            const date = new Date(year, month - 1, i); // Adjusted month indexing
            daysArray.push({ date, isCurrentMonth: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i); // Adjusted month indexing
            daysArray.push({ date, isCurrentMonth: true });
        }

        const totalDays = daysArray.length;
        const daysToAdd = totalDays < 42 ? 42 - totalDays : 0;
        for (let i = 1; i <= daysToAdd; i++) {
            const date = new Date(year, month + 1, i); // Adjusted month indexing
            daysArray.push({ date, isCurrentMonth: false });
        }
        setFetched(true);
        return daysArray.flat();
    };


    useEffect(() => {
        console.log('change')
        setDateList(generateDaysArray());
    }, [month, year]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleDayPress(item.date)}
            style={[
                styles.dayItem,
                moment(item.date).isSame(startDate, 'day') && !endDate && styles.betweenDays,
                moment(item.date).isSame(startDate, 'day') && endDate && styles.startDay,
                moment(item.date).isSame(endDate, 'day') && styles.endDay,
                moment(item.date).isSame(moment(), 'day') && styles.today,
                moment(item.date).isAfter(startDate, 'day') && moment(item.date).isBefore(endDate, 'day') && styles.betweenDays,
            ]}>
            <Text
                style={[
                    (moment(item.date).isSame(startDate, 'day') ||
                        moment(item.date).isSame(endDate, 'day')) && endDate && styles.selectedText,
                    !item.isCurrentMonth && styles.nonCurrentMonthDay,
                ]}>
                {moment(item.date).format("DD")}
            </Text>
        </TouchableOpacity>
    );

    if (!isFecthed) {
        return (<></>)
    }


    return (
        <View style={{ ...styles.container, ...style }}>

            <View style={styles.flexRowCenter}>
                <Text style={styles.label}>{year}</Text>
                <TouchableOpacity style={{ marginLeft: 25 }} onPress={toggleMonthPicker}>
                    <Text style={styles.label}>
                        {moment().locale('en').set('month', month).format('MMMM')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={decreaseMonth} style={{ marginLeft: "auto" }}>
                    <Feather name="chevron-left" style={styles.arrowIcon} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={increaseMonth} style={{ marginLeft: 10 }}>
                    <Feather name="chevron-right" size={24} style={styles.arrowIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.daysContainer}>
                <FlatList
                    data={dateList}
                    keyExtractor={(item, index) => `${item.date}-${index}`}
                    renderItem={renderItem}
                    numColumns={7}
                    contentContainerStyle={styles.daysContainer}
                />
            </View>

            <Picker
                style={{ display: 'none' }}
                ref={pickerRef}
                selectedValue={month}
                onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}>
                {months.map((m) => (
                    <Picker.Item key={m}
                        label={moment().locale('en').set('month', m).format('MMMM')}
                        value={m} />
                ))}
            </Picker>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        width: 320,
        padding: 16,
        backgroundColor: "white",
        borderColor: COLORS.grey,
        borderWidth: 0.8,
        position: 'absolute',
        zIndex: 9999
    },
    flexRowCenter: {
        marginLeft: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        color: COLORS.textLabel,
        fontWeight: "500",
        fontSize: 16,
    },
    arrowIcon: {
        color: COLORS.toastInfo
    },
    daysContainer: {
        width: 286,
        marginTop: 10,
    },
    dayItem: {
        width: 37,
        height: 37,
        lineHeight: 37,
        borderRadius: 5,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowContainer: {
        flexDirection: "row",
    },
    nonCurrentMonthDay: {
        color: COLORS.grey,
    },
    startDay: {
        backgroundColor: COLORS.toastInfo,
    },
    endDay: {
        backgroundColor: COLORS.toastInfo,
    },
    betweenDays: {
        backgroundColor: '#B6D0E2',
        opacity: 0.7
    },
    selectedText: {
        color: "white",
    },
    today: {
        borderColor: COLORS.toastInfo,
        borderWidth: 0.8
    }
});

export default DateRangePicker;
