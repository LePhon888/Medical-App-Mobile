import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Entypo from 'react-native-vector-icons/Entypo';
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../config/Apis";
import COLORS from "../../constants/colors";
import { formatDuration } from "../../config/date";
import moment from "moment";
import Loading from "../../components/Loading";
import { ActivityIndicator } from "react-native-paper";
import HeaderWithBackButton from "../../common/HeaderWithBackButton";
const HistoryMedication = ({ navigation }) => {

    const { userId } = useUser()
    const [page, setPage] = useState(0)
    const [historyList, setHistoryList] = useState([])
    const [listUpdating, setListUpdating] = useState(false)
    const [isFetched, setFetched] = useState(false)
    const [maxPage, setMaxPage] = useState(0)

    const goBack = () => {
        navigation.goBack()
    }

    const loadMoreData = () => {
        if (page < maxPage) {
            setListUpdating(true);
            setPage(previous => previous + 1);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await Apis.get(`${endpoints["scheduleTimeDetail"]}/user/${userId}?page=${page}`);

                // Process data to group by date
                const groupedData = res.data.content.reduce((acc, item) => {
                    const date = item.date;
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(item);
                    return acc;
                }, {});
                // Convert grouped data to SectionList format
                const sections = Object.keys(groupedData).map(date => ({
                    title: date,
                    data: groupedData[date],
                }));
                // Set the SectionList data
                setMaxPage(res.data.totalPages)
                if (page === 0) {
                    setHistoryList(sections);
                } else {
                    // Append the new sections to the existing historyList
                    setHistoryList(prevSections => [...prevSections, ...sections]);
                }

            } catch (error) {
                console.error(error)
            } finally {
                setListUpdating(false)
                setFetched(true)
            }

        };

        getData();
    }, [userId, page]);

    return (
        <View style={styles.screen}>
            <HeaderWithBackButton
                title={'Lịch sử dùng thuốc'}
                navigation={navigation}
                headerStyle={{ backgroundColor: COLORS.primary }}
                titleStyle={{ color: COLORS.white }}
                backIconStyle={{ color: COLORS.white }}
            />
            {/* <View style={styles.header}> */}
            {/* <View style={styles.flexRowCenter}> */}
            {/* <TouchableOpacity style={{ ...styles.backButton, marginRight: 'auto' }} onPress={() => goBack()}>
                        <Entypo name="chevron-thin-left" size={19} style={{ color: COLORS.white }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{'Lịch sử dùng thuốc'}</Text> */}

            {/* </View> */}
            {/* </View> */}
            <View style={styles.container}>
                <SectionList
                    showsVerticalScrollIndicator={false}
                    sections={historyList}
                    style={styles.list}
                    onEndReached={loadMoreData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View>
                                <Text style={styles.medicineName}>{item.medicineName}</Text>
                                <Text style={{
                                    ...styles.usage,
                                    color: item.isUsed ? COLORS.toastInfo : COLORS.toastError
                                }}>
                                    {item.isUsed ? 'Đã dùng' : 'Bỏ qua'} {` x ${item.quantity}`}</Text>
                            </View>
                            <Text style={styles.time}>{formatDuration(item.time)}</Text>
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionTitle}>{moment(title).format('DD/MM/YYYY')}</Text>
                    )}
                    ListFooterComponent={() => {
                        return listUpdating ? (
                            <ActivityIndicator
                                color={COLORS.grey}
                                size={32}
                                style={{ marginVertical: 15 }}
                            />
                        ) : null;
                    }}

                />
            </View>
            {!isFetched && <Loading transparent={true} />}
        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    header: {
        paddingTop: 10,
        paddingHorizontal: 5,
        height: 55
    },
    backButton: {
        padding: 5,
        borderRadius: 8,
    },
    headerTitle: {
        color: 'white', fontWeight: 'bold', fontSize: 20,
        marginRight: 'auto'
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    list: {
        marginTop: 15,
        width: '100%'
    },
    listItem: {
        borderColor: '#d3d3d3',
        borderWidth: 1,
        marginHorizontal: 16,
        marginVertical: 7,
        borderRadius: 12,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    medicineName: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 14 * 1.6
    },
    usage: {
        marginTop: 6,
        fontSize: 15
    },
    time: {
        fontSize: 13,
        color: COLORS.textLabel,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 16,
        marginTop: 10,
    }

})

export default HistoryMedication