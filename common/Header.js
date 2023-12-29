import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";
/**
 * This component is use as a header
 * @param title (mandantory) the title of header 
 * @returns Header component
 */
const Header = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.titleText}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
    },
    titleText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
    },
});

export default Header