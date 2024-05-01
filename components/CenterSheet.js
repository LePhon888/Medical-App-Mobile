import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import ToastConfig from "./ToastConfig";
import { memo } from "react";

/**
 * 
 * @param visible use to show or hide the modal
 * @param onClose function to call after hide modal
 * @param bodyComponent a component use as a body content
 * @param style use this to override the existing style of popup. Better define a style name and use it in here.
 * @returns 
 * 
 * 
 */
const CenterSheet = ({ visible, onClose, children, style }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => onClose()}>
            <View style={{ zIndex: 9999 }}>
                <ToastConfig />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* Overlay */}
                <TouchableWithoutFeedback onPress={() => onClose()}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={{ ...styles.popupContainer, ...style }}>
                    {children}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    popupContainer: {
        borderRadius: 15,
        backgroundColor: 'white',
        padding: 15,
        elevation: 10,
        position: 'absolute',
        zIndex: 101,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
})
export default memo(CenterSheet)