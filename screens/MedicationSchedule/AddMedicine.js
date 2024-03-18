import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import HeaderWithBackButton from "../../common/HeaderWithBackButton";
import Apis, { endpoints } from "../../config/Apis";
import Feather from "react-native-vector-icons/Feather";

const AddMedicine = ({ navigation, route }) => {
    const [medicineList, setMedicineList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [isFetched, setFetched] = useState(false);
    const [activeAlphabet, setActiveAlphabet] = useState('A')
    const [timer, setTimer] = useState(null)
    const [isTrigger, setTrigger] = useState(false)

    const flatListRef = useRef(null);

    const loadMoreMedicine = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const onChangeSearchText = (text) => {
        setSearchText(text);
        setPage(0);
    };

    useEffect(() => {
        let debounceFunction;
        console.log('Loading')
        const getMedicine = async () => {
            try {
                setFetched(false);
                const res = await Apis.get(
                    `${endpoints["medicine"]}/?page=${page}&name=${searchText}`
                );
                const newMedicineList = res.data.content;
                setFetched(true);
                if (page === 0) {
                    setMedicineList(newMedicineList);
                    setMaxPage(res.data.totalPages);
                } else {
                    setMedicineList((prevMedicineList) => [
                        ...prevMedicineList,
                        ...newMedicineList,
                    ]);
                }
            } catch (error) {
                console.error("Error fetching medicine data:", error);
            }
        };

        if (maxPage === 0 || page < maxPage) {
            debounceFunction = setTimeout(() => {
                getMedicine();
            }, 650);
        }

        return () => clearTimeout(debounceFunction);
    }, [page, searchText]);



    const navigateToSchedule = (medicine) => {
        if (route.params && route.params.schedule) {
            const { schedule, unitList } = route.params;

            console.log(1, route.params)
            const updatedSchedule = {
                ...schedule,
                medicine: medicine,
            };
            navigation.navigate('MedicationSchedule', { updatedSchedule: updatedSchedule, unitList: unitList });
        } else {
            console.log(2)
            navigation.navigate('MedicationSchedule', { medicine: medicine });
        }
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => navigateToSchedule(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderAlphabets = () => {
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return (
            <View style={styles.alphabetContainer}>
                {alphabets.split("").map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => scrollToListByAlphabet(item)}
                        style={{ ...styles.alphabetItem, backgroundColor: activeAlphabet === item ? 'black' : 'transparent' }}>
                        <Text style={{ ...styles.alphabetText, color: activeAlphabet === item ? 'white' : 'black' }}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const scrollToListByAlphabet = (alphabet) => {
        setActiveAlphabet(alphabet)
        const filteredList = medicineList.filter(
            (medicine) =>
                medicine.name.charAt(0).toUpperCase() === alphabet.toUpperCase()
        );
        if (filteredList.length > 0) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index: medicineList.indexOf(filteredList[0]),
            });
        }
    };

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const currentAlphabet = viewableItems[0].item.name.charAt(0).toUpperCase()
            setActiveAlphabet(currentAlphabet);
        }
    };

    const viewabilityConfig = { itemVisiblePercentThreshold: 100 };

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged },
    ]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <HeaderWithBackButton title={"Thêm thuốc"} />
            </View>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#000" style={styles.icon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Nhập tên thuốc"
                    value={searchText}
                    onChangeText={(text) => onChangeSearchText(text)}
                />
                <TouchableOpacity
                    style={{ marginLeft: "auto" }}
                    onPress={() => onChangeSearchText("")}
                >
                    <Feather name="x" size={20} color="#000" style={styles.icon} />
                </TouchableOpacity>
            </View>

            <View>
                {renderAlphabets()}
            </View>

            {isFetched && medicineList.length === 0 && (
                <Text style={{ paddingHorizontal: 16, marginTop: 10 }}>Không tìm thấy tên thuốc</Text>
            )}

            <FlatList
                ref={flatListRef}
                data={medicineList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMoreMedicine}
                onEndReachedThreshold={0.7}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                style={{ marginTop: 20 }}
            />

            {!isFetched && <ActivityIndicator size="large" color="#99999c" style={{ marginBottom: 20 }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fd",
    },
    header: {
        backgroundColor: "white",
        padding: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d0d6dd",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginHorizontal: 16,
        marginTop: 15,
        backgroundColor: "white",
        height: 45,
    },
    searchInput: {
        height: 45,
        paddingLeft: 5,
        paddingRight: 50,
    },
    listItem: {
        padding: 16,
    },
    itemText: {
        fontWeight: "500",
        fontSize: 16,
    },
    alphabetContainer: {
        marginTop: 50,
        marginRight: 20,
        position: "absolute",
        right: 0,
        backgroundColor: '#e6e8ec',
        borderRadius: 15,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9
    },
    alphabetItem: {
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 15,
        zIndex: 10
    },
    alphabetText: {
        fontSize: 11,
    },
});

export default AddMedicine;
