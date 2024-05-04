import { useNavigation } from "@react-navigation/native";
import { Button, TouchableOpacity, View, ScrollView, Text, Image, TextInput, FlatList } from "react-native";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { noti } from "../config/data";
import COLORS from "../constants/colors";
import { useEffect, useState } from "react";
import { medicines } from '../config/data';
import Apis, { endpoints } from "../config/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cache } from "react-native-cache";
import optionCache from "../utils/optionCache";

export default function MedicineList({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [med, setMed] = useState([]);
    const cache = new Cache(optionCache);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await cache.get("medicineList");
                console.log("value", value);
                setMed(value);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [])
    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const filteredMedicines = med?.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ borderBottomWidth: 0.3, borderColor: '#ccc', paddingVertical: 18, marginHorizontal: 16 }}>
            <Text style={{ fontWeight: 600, fontSize: 15 }}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderWithBackButton title={'Thuốc'} customIcons={
                [
                    <View style={{ borderWidth: 1, borderRadius: 30, paddingVertical: 7, flexDirection: 'row', marginTop: 10, fontWeight: 600 }}>
                        <AntDesign name="menu-fold" size={20} style={{ marginLeft: 10 }} />
                        <Text style={{ marginHorizontal: 10 }}>Chuyên mục</Text>
                    </View>
                ]
            } navigation={navigation} />
            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', marginHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginBottom: 10, marginTop: 10 }}>
                <AntDesign name="search1" size={21} color={COLORS.black} style={{ marginLeft: 15, marginTop: 3 }} />
                <TextInput
                    placeholder="Tìm kiếm thuốc, bệnh"
                    placeholderTextColor={COLORS.black}
                    keyboardType="default"
                    style={{
                        marginHorizontal: 10,
                        width: '90%'
                    }}
                    onChangeText={handleSearch}
                    value={searchQuery}                >
                </TextInput>
            </View>
            {!searchQuery &&
                <View style={{ marginHorizontal: 12 }}>
                    <Image source={require('../assets/images/medicinebanner.png')} style={{ width: '100%', height: 200, marginBottom: 3, borderRadius: 10 }} />
                </View>
            }
            <View>
                {/* {med?.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={{ borderBottomWidth: 0.3, borderColor: '#ccc', paddingVertical: 18, marginHorizontal: 16 }}>
                                <Text style={{ fontWeight: 600, fontSize: 15 }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    })} */}
                <FlatList
                    data={med}
                    renderItem={renderItem}
                    keyExtractor={item => item.id} // Provide a unique key for each item
                />
            </View>
        </View>
    )
}