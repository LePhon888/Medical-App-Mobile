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
        paddingVertical: 18,
    },
    titleText: {
        color: "black",
        fontSize: 20,
        fontWeight: "500",
        marginLeft: 20,
    },
});

export default Header