
import React, { createContext, useContext, useState } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";
import FeatherIcon from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import COLORS from "../constants/colors";
import { useRef } from "react";


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

};

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        color: 'white',
    },
    container: {
        borderWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'transparent',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconContainer: {
        marginLeft: 10,
    },
    icon: {
        fontWeight: 'bold',
        fontSize: 20,
        borderRadius: 30
    },
});

const ToastConfig = () => {
    return (
        <Toast config={config} />
    )
}

export default ToastConfig



