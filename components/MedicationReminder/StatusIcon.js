import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import COLORS from "../../constants/colors";


const StatusIcon = memo(({ iconName, iconColor, text = '', onPress, style }) => (
    <TouchableOpacity style={[styles.iconContainer, { ...style }]} onPress={onPress}>
        <Octicons name={iconName} color={iconColor} style={styles.icon} />
        {text !== '' &&
            <Text style={{ ...styles.iconText, color: iconColor }}>{text}</Text>
        }
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'column',
        alignItems: 'center',

    },
    icon: {
        fontSize: 24,
    },
    iconText: {
        marginTop: 5,
        fontSize: 14
    },
})

export default StatusIcon