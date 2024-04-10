import React, { memo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/colors';

const DoctorDetailLoading = () => {

    const renderPlaceholders = (count) => {
        const placeholders = [];
        for (let i = 0; i < count; i++) {
            placeholders.push(
                <View key={i}>
                    <View style={styles.placeHolderLongShorter}></View>
                    <View style={styles.placeHolderLong}></View>
                    <View style={styles.placeHolderLongMedium}></View>
                    <View style={styles.placeHolderLonger}></View>
                    <View style={{ marginBottom: 15 }}></View>
                </View>);
        }
        return placeholders;
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.flexRowCenter}>
                        <TouchableOpacity style={styles.backIcon} >
                            <Ionicons size={20} name="chevron-back-outline"></Ionicons>
                        </TouchableOpacity>
                        <View style={styles.favourite}><MaterialCommunityIcons size={20} name="heart-plus-outline" /></View>
                    </View>
                </View>
                <View style={styles.center}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar} />
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.placeHolderMedium}></View>
                            <View style={styles.placeHolderShorter}></View>
                            <View style={styles.placeHolderShorter}></View>
                        </View>
                    </View>
                    <View style={styles.leftContainer}>
                        {renderPlaceholders(4)}
                    </View>
                </View>
                <View style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity style={styles.buttonSchedule}>
                        <Text style={styles.textSchedule}></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d5ecfe',
        flexDirection: "column"
    },
    placeHolderShorter: {
        backgroundColor: COLORS.placeHolder,
        height: 15,
        width: 100,
        borderRadius: 3,
        marginVertical: 3,
        marginRight: 5,
    },
    placeHolderMedium: {
        backgroundColor: COLORS.placeHolder,
        height: 15,
        width: 200,
        borderRadius: 3,
        marginVertical: 5,
    },
    placeHolderLonger: {
        backgroundColor: COLORS.placeHolder,
        height: 15,
        width: "auto",
        borderRadius: 3,
        marginVertical: 5,
        marginRight: '3%'
    },
    placeHolderLong: {
        backgroundColor: COLORS.placeHolder,
        height: 12,
        width: "auto",
        borderRadius: 3,
        marginVertical: 5,
        marginRight: '7%'
    },
    placeHolderLongShorter: {
        backgroundColor: COLORS.placeHolder,
        height: 15,
        width: "auto",
        borderRadius: 3,
        marginVertical: 5,
        marginRight: '40%'
    },
    placeHolderLongMedium: {
        backgroundColor: COLORS.placeHolder,
        height: 15,
        width: "auto",
        borderRadius: 3,
        marginVertical: 5,
        marginRight: '14%'
    },
    center: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    avatarContainer: {
        left: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: -60,
    },
    leftContainer: {
        top: 130,
        paddingHorizontal: 10
    },
    flexRowCenter: {
        flexDirection: 'row', alignItems: 'center',
    },
    header: {
        paddingHorizontal: 10,
        backgroundColor: '#d5ecfe',
        paddingTop: 20,
        paddingBottom: "17%",
    },
    backIcon: {
        padding: 10,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    favourite: {
        marginLeft: 'auto',
        padding: 5,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 4,
        backgroundColor: COLORS.placeHolder
    },
    buttonSchedule: {
        backgroundColor: COLORS.placeHolder,
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
});

export default memo(DoctorDetailLoading);
