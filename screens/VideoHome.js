import { useNavigation } from "@react-navigation/native";
import { Button, View } from "react-native";

export default function VideoHome(props) {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
            <Button title="Call" onPress={() => { navigation.navigate('Call') }} />
        </View>
    )
}