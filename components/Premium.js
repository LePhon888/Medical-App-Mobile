import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Premium = ({ size = 'small' }) => {
    return (
        <View style={{ width: size != 'small' ? 98 : 21, flexDirection: 'row', marginLeft: 10, marginTop: 10, backgroundColor: '#fff9e3', padding: size != 'small' ? 3 : 1, borderRadius: 50 }}>
            <View style={{ padding: 2, backgroundColor: '#ff921f', borderRadius: 50, marginRight: 5 }}>
                <MaterialCommunityIcons name="crown-outline" size={size != 'small' ? 21 : 14} style={{ color: COLORS.white }} />
            </View>
            {
                size != 'small' && <Text style={{ marginTop: 3, fontWeight: 700, color: '#ff921f', fontSize: 13 }}>Premium</Text>
            }
        </View>
    );
}


export default Premium