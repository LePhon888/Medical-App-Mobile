import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Premium = ({ size = 'small' }) => {
    const width = size != 'small' ? 98 : 21
    return (
        <View style={{ width: size != 'small' ? 98 : 17, flexDirection: 'row', marginLeft: 10, marginTop: 10, backgroundColor: '#fff9e3', padding: size != 'small' ? 3 : 0, borderRadius: width / 2 }}>
            <View style={{ padding: 2, backgroundColor: '#ff921f', borderRadius: width / 2, marginRight: size != 'small' ? 5 : 0 }}>
                <MaterialCommunityIcons name="crown-outline" size={size != 'small' ? 21 : 13} style={{ color: COLORS.white }} />
            </View>
            {
                size != 'small' && <Text style={{ marginTop: 3, fontWeight: 700, color: '#ff921f', fontSize: 13 }}>Premium</Text>
            }
        </View>
    );
}


export default Premium