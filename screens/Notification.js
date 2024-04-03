import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, FlatList, StyleSheet, SectionList } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { getUserFromStorage } from "../utils/GetUserFromStorage";
import { useUser } from "../context/UserContext";
import Apis, { endpoints } from "../config/Apis";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import COLORS from "../constants/colors";
import moment from "moment";
import Loading from "../components/Loading";
import { ActivityIndicator } from "react-native-paper";
import { useNotification } from "../context/NotificationContext";

const Notification = ({ navigation, route }) => {
    const { userId } = useUser();
    const [notificationList, setNotificationList] = useState([]);
    const [countUnread, setCountUnread] = useState(0)
    const [isFetched, setFetched] = useState(true)
    const [listUpdating, setListUpdating] = useState(false)
    const [page, setPage] = useState(0)
    const [maxPage, setMaxPage] = useState(0)
    const [refreshBell, setRefreshBell] = useState(false)
    const { state, dispatch } = useNotification()
    const now = moment()


    const countUnreadNotification = async () => {
        try {
            const res = await Apis.get(`${endpoints["notification"]}/unread-count/${userId}`)
            setCountUnread(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const getNotificationList = async () => {
        try {
            const res = await Apis.get(`${endpoints["notification"]}/user/${userId}?page=${page}`);
            setMaxPage(res.data.totalPages);

            // Combine existing notificationList and new data for distinct and sorted update
            const combinedNotifications = page > 0 ? [...notificationList, ...res.data.content] : res.data.content;

            // Call setDistinctNotificationList with the combined data
            setDistinctNotificationList(combinedNotifications);
        } catch (error) {
            console.error(error);
        } finally {
            setFetched(true);
            setListUpdating(false);
        }
    };


    useEffect(() => {
        if (userId) {
            setFetched(false)
            getNotificationList()
            countUnreadNotification()
        }
    }, [userId]);

    useEffect(() => {
        getNotificationList()
    }, [page])

    const onEndReached = () => {
        console.log(maxPage)
        if (page < maxPage) {
            setListUpdating(true)
            setPage((prev) => prev + 1)
        }
    }

    const setDistinctNotificationList = (newNotifications) => {
        const uniqueNotificationsMap = new Map();
        newNotifications.forEach((notification) => {
            uniqueNotificationsMap.set(notification.id, notification);
        });
        const uniqueNotifications = Array.from(uniqueNotificationsMap.values());
        const sortedNotifications = uniqueNotifications.sort((a, b) => new Date(b.sentOn) - new Date(a.sentOn));
        setNotificationList(sortedNotifications);
    };


    useEffect(() => {
        if (state.refreshData && route.name === 'Notification') {
            countUnreadNotification();
            dispatch({ type: 'TOGGLE_REFRESH_DATA' });
            console.log('already refreshed data on Notification');
            if (page === 0) {
                getNotificationList()
            } else {
                setPage(0)
            }
        }
    }, [state.refreshData, dispatch]);


    const onClickNotification = ({ item }) => {
        try {
            if (!item.isRead) {
                setFetched(false)
                Apis.put(`${endpoints["notification"]}/update-read/${item.id}`);
                // Find the index of the clicked notification
                const index = notificationList.findIndex((notification) => notification.id === item.id);
                // Update the isRead property to true
                if (index !== -1) {
                    const updatedList = [...notificationList];
                    updatedList[index].isRead = true;
                    setNotificationList(updatedList);
                    setCountUnread((previos) => previos - 1)
                    setRefreshBell(true)
                }
            }
            const { screen, ...params } = item.clickAction;
            screen && navigation.navigate(screen, params);
        } catch (error) {
            console.error("Error handling notification click:", error);
        } finally {
            setFetched(true);
        }
    };

    const headerTitle = {
        today: 'Hôm nay',
        thisWeek: 'Tuần này',
        older: 'Cũ hơn'
    }

    const filteredSections = [
        {
            title: headerTitle.today,
            data: notificationList?.filter((item) => moment(item.sentOn).isSame(now, 'day')),
        },
        {
            title: headerTitle.thisWeek,
            data: notificationList?.filter((item) => !moment(item.sentOn).isSame(now, 'day') && moment(item.sentOn).isSame(now, 'week')),
        },
        {
            title: headerTitle.older,
            data: notificationList?.filter((item) => !moment(item.sentOn).isSame(now, 'day') && !moment(item.sentOn).isSame(now, 'week')),
        },
    ].filter((section) => section.data.length > 0);

    const onBack = () => {
        navigation.goBack({ refreshBell: !refreshBell });
    };

    return (
        <View style={styles.container}>
            <HeaderWithBackButton
                title={'Thông báo'}
                isCustomEvent={true}
                OnBack={() => onBack()}
            />
            <SectionList
                showsVerticalScrollIndicator={false}
                sections={filteredSections}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => onEndReached()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onClickNotification({ item })}
                        style={[styles.notificationItem, { backgroundColor: !item.isRead ? '#dff9fb55' : COLORS.white, },]}>
                        <Image
                            source={require('../assets/images/bell.png')}
                            style={styles.notificationIcon}
                        />
                        <View style={styles.notificationContent}>
                            <Text style={styles.notificationTitle}>{item.title}</Text>
                            <Text style={styles.notificationBody}>{item.body.replace(/\n/g, ' ')}</Text>
                            <Text style={styles.notificationSentOn}>{moment(item.sentOn).fromNow()}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.sectionHeader}>{title}</Text>
                        {title === headerTitle.today && countUnread > 0 && (
                            <Text style={styles.sectionUnread}>{`Thông báo chưa đọc (${countUnread}) `}</Text>
                        )}
                    </View>
                )}
                ListFooterComponent={() => (
                    listUpdating &&
                    <ActivityIndicator
                        color={COLORS.grey}
                        size={32}
                        style={{ marginVertical: 15 }} />
                )}

            />
            {!isFetched && <Loading transparent={true} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    notificationItem: {
        borderBottomWidth: 0.3,
        borderColor: '#ccc',
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
        position: 'relative',
        alignItems: 'flex-start'
    },
    notificationIcon: {
        width: 28,
        height: 28,
        marginTop: 10,
        marginRight: 16,
    },
    notificationContent: {
        flexDirection: 'column',
        width: '86%',
    },
    notificationTitle: {
        fontWeight: '600',
        fontSize: 15,
    },
    notificationBody: {
        lineHeight: 14 * 1.5,
    },
    notificationSentOn: {
        marginLeft: 'auto',
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.textLabel
    },
    sectionHeaderContainer: {
        paddingLeft: 10,
        marginTop: 16,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sectionHeader: {
        fontWeight: 'bold',
        color: COLORS.textLabel,
        fontSize: 16
    },
    sectionUnread: {
        marginLeft: 'auto',
        paddingRight: 5,
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.textLabel
    }
});

export default Notification;
