import React, { memo, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";

const CheckBox = ({ checked, onPress, disabled, color, uncheckedColor }) => {
    const checkBoxStyle = checked ? [styles.checkBox, styles.checked, { backgroundColor: color || COLORS.primary }] : [styles.checkBox, styles.unchecked, { borderColor: uncheckedColor || COLORS.grey }];

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={checkBoxStyle}>
            {checked && <Feather name="check" color={"white"} size={20} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkBox: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 4,
    },
    checked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    unchecked: {
        borderColor: COLORS.gray,
    },
});

export default memo(CheckBox);
