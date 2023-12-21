import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";
import Icon from "react-native-vector-icons/FontAwesome";
/**
 *
 * 
 * @param title is the title of header
 * @param navigation can be not empty. This is the navigation of current screen, must be belong to stack
 * @param isCustomEvent can be empty. This is the flag if the user want to handle on back instead of back to previous screen
 * @param OnBack can be empty. Incase you use the isCustomEvent then you can pass the function into this one
 * @returns 
 */
const HeaderWithBackButton = ({ title, navigation, isCustomEvent, OnBack }) => {
    const OnBackPressed = () => {
        if (isCustomEvent) {
            return OnBack()
        }
        return navigation.goBack()
    }

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => OnBackPressed()}>
                <Icon name="arrow-left" size={20} color={"#FFFF"} />
            </TouchableOpacity>
            <Text style={styles.titleText}>{title}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    titleText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
    },
});

export default HeaderWithBackButton