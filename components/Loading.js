import React, { memo } from "react";
import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import COLORS from "../constants/colors";

/**
 * Valid values for the animationType prop.

 */

/**
 * Loading component using when committing transactions (create or update) or when fetching the data.
 * @param isTransparent=false - Set to true to make the background of the overlay transparent. Default is false.
 * @param  animationType='slide' - The type of animation for the modal. Default is 'slide'. 3 values 'slide', 'fade', 'none'
 * @returns {JSX.Element}
 */
const Loading = ({ transparent = false, animationType = 'none' }) => {
    return (
        <Modal
            animationType={animationType}
            transparent={true}
            visible={true}
        >
            <View style={styles.container}>
                {/* Overlay */}
                <TouchableWithoutFeedback>
                    <View style={[styles.modalOverlay, transparent && styles.transparentOverlay]} />
                </TouchableWithoutFeedback>
                <View style={styles.popupContainer}>
                    <ActivityIndicator animating={true} size={30} hidesWhenStopped={true}
                        color={COLORS.toastInfo}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        borderRadius: 15,
        backgroundColor: 'white',
        padding: 15,
        elevation: 5,
        width: 75,
        height: 75,
        zIndex: 101,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    transparentOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0)',  // Transparent background
    },
});

export default memo(Loading);
