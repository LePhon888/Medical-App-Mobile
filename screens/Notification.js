import { useNavigation } from "@react-navigation/native";
import { Button, TouchableOpacity, View, ScrollView, Text, Image } from "react-native";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { noti } from "../config/data";
import COLORS from "../constants/colors";

export default function Notification() {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderWithBackButton title={'Thông báo'} customIcons={
                [<SimpleLineIcons name="options-vertical" size={18} />]
            } />
            <ScrollView>
                <View>
                    {noti.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={{ backgroundColor: index % 2 == 0 ? '#dff9fb55' : COLORS.white, borderBottomWidth: 0.2, borderColor: '#ccc', height: 130, flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 10, position: 'relative' }}>
                                <Image source={require('../assets/images/bell.png')} style={{ width: 28, height: 28, marginTop: 14, marginLeft: 10, marginRight: 18, }} />
                                <View style={{ flexDirection: 'column', width: '86%' }}>
                                    <Text style={{ fontWeight: 600, fontSize: 15 }}>
                                        {item.title}
                                    </Text>
                                    <Text>
                                        {item.content}
                                    </Text>
                                    <Text style={{ fontSize: 12, fontWeight: 500, position: 'absolute', bottom: 0, right: 10 }}>
                                        {item.time}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}