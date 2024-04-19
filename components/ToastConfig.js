
import React, { createContext, memo, useContext, useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";
import FeatherIcon from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import COLORS from "../constants/colors";
import { useRef } from "react";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";


const config = {
    error: (props) => (
        <ErrorToast
            {...props}
            text1Style={styles.text}
            text1NumberOfLines={undefined}
            activeOpacity={1}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <Octicons name="x-circle-fill" color={'white'} style={{ ...styles.icon, backgroundColor: COLORS.toastError }} />
                </View>
            )}
            style={{ ...styles.container, backgroundColor: COLORS.toastError }}
        />
    ),

    success: (props) => (
        <ErrorToast
            {...props}
            text1Style={styles.text}
            text1NumberOfLines={undefined}
            activeOpacity={1}
            renderLeadingIcon={() => (
                <View style={styles.iconContainer}>
                    <Octicons name="check-circle-fill" color={'white'} style={{ ...styles.icon, backgroundColor: COLORS.toastSuccess }} />
                </View>
            )}
            style={{ ...styles.container, backgroundColor: COLORS.toastSuccess }}
        />
    ),

    notification: ({ props }) => (
        <TouchableOpacity style={styles.notificationContainer} onPress={props.clickAction}>
            <Text style={styles.notificationTitle}>{props.title}</Text>
            <Text style={styles.notificationBody}>{props.body}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={props.hide}>
                <Text style={styles.buttonText}>Bỏ qua</Text>
            </TouchableOpacity>
        </TouchableOpacity>)


};

const styles = StyleSheet.create({
    text: {
        fontSize: 13,
        color: 'white',
    },
    container: {
        borderWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'transparent',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        zIndex: 999,
        elevation: 10,
    },
    iconContainer: {
        marginLeft: 10,
    },
    icon: {
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 30
    },
    notificationContainer: {
        width: '95%',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        paddingVertical: 10,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    notificationTitle: {
        fontWeight: 'bold',
    },
    notificationBody: {
        marginTop: 3,
        lineHeight: 1.5 * 13,
        fontSize: 14
    },
    notificationSentOn: {
        marginLeft: 'auto',
        color: COLORS.textLabel,
        fontWeight: '500',
        fontSize: 12,
    },
    notificationIcon: {
        borderRadius: 15,
        borderColor: 'transparent',
        resizeMode: 'contain',
        width: 20,
        height: 20,
        marginRight: 8
    },
    notifcationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7
    },
    appName: {

    },
    closeButton: {
        marginLeft: 'auto'
    },
    buttonText: {
        color: '#0080b2',
        fontSize: 15,
        fontWeight: '500'
    },
});

const ToastConfig = () => {
    return (
        <Toast config={config} />
    )
}

export default memo(ToastConfig)



