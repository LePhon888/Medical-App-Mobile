import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native'
import HeaderWithBackButton from '../common/HeaderWithBackButton'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ScrollView } from 'react-native-gesture-handler'
import Apis, { endpoints } from '../config/Apis'
import { useUser } from '../context/UserContext'
import moment from 'moment'
import COLORS from '../constants/colors'
import { useFocusEffect } from '@react-navigation/native'
import { set } from 'lodash'
import { ActivityIndicator } from 'react-native-paper'
const SavedNews = ({ navigation }) => {
    const [news, setNews] = useState([])
    const { userId } = useUser()
    const [savedPosts, setSavedPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const fetchNews = async () => {
        try {
            setLoading(true)
            const res = await Apis.get(endpoints.savePost + '/' + userId)
            setNews(res.data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };
    useEffect(() => {
        fetchNews();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchNews();
            return () => { };
        }, [])
    );

    const handleSave = async (postId) => {
        try {
            savedPosts.includes(postId) ?
                await Apis.delete(`${endpoints.savePost}/delete?userId=${userId}&postId=${postId}`) :
                await Apis.post(endpoints.savePost, { userId, postId });
        } catch (error) {
            console.error("Error fetching save post data:", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <HeaderWithBackButton title="Bài viết đã lưu" navigation={navigation} customIcons={
                [<FontAwesome5Icon name="bookmark" size={22} />]
            } />
            <ScrollView style={{ marginHorizontal: 10 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {loading ? <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 250 }}
                /> :
                    news?.map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    borderBottomColor: '#f3f4f6',
                                    borderBottomWidth: 0.7,
                                    marginTop: 15
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("NewsDetail", { item: item.post, isSaved: true })}
                                    style={styles.cardNews}>
                                    <Image
                                        alt=""
                                        resizeMode="cover"
                                        source={{ uri: item.post.image }}
                                        style={styles.cardImgNews}
                                    />

                                    <View style={styles.cardBodyNews}>
                                        <Text style={styles.cardTagNews}>{String(item.post.category.name)}</Text>

                                        <Text style={styles.cardTitleNews}>{String(item.post.header)}</Text>

                                        <View style={styles.cardRowNews}>
                                            <View style={styles.cardRowItemNews}>
                                                <Text style={styles.cardRowItemTextNews}>{String(item.post.author)}</Text>
                                            </View>

                                            <Text style={styles.cardRowDividerNews}>·</Text>

                                            <View style={styles.cardRowItemNews}>
                                                <Text style={styles.cardRowItemTextNews}>
                                                    {moment(new Date(parseInt(item.post.createdDate)).toLocaleDateString('vi'), "DDMMYYYY").fromNow()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => {
                                savedPosts.includes(item.post.id) ?
                                    setSavedPosts(savedPosts.filter(id => id !== item.post.id)) :
                                    setSavedPosts([...savedPosts, item.post.id]);
                                handleSave(item.post.id)
                            }}>
                                <FontAwesome name={savedPosts.includes(item.post.id) ? "bookmark" : "bookmark-o"} size={22} style={{ position: 'absolute', right: 28, bottom: 16, color: savedPosts.includes(item.id) ? COLORS.primary : COLORS.black }} />
                            </TouchableOpacity> */}
                            </View>
                        )
                    })}
            </ScrollView>
        </View>
    )
}

export default SavedNews


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 6,
        paddingBottom: 70,
    },
    cardNews: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        position: 'relative'
    },
    cardImgNews: {
        width: 96,
        height: 96,
        borderRadius: 12,
    },
    cardBodyNews: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
    },
    cardTagNews: {
        fontWeight: '500',
        fontSize: 12,
        color: '#2e87ef',
        marginBottom: 7,
        textTransform: 'capitalize',
    },
    cardTitleNews: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 19,
        color: '#000',
        marginBottom: 6,
    },
    cardRowNews: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: -8,
        marginBottom: 'auto',
    },
    cardRowDividerNews: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#939393',
    },
    cardRowItemNews: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        borderRightWidth: 1,
        borderColor: 'transparent',
    },
    cardRowItemTextNews: {
        fontWeight: '400',
        fontSize: 13,
        color: '#939393',
        marginLeft: 3,
    },
    cardRowItemImgNews: {
        width: 22,
        height: 22,
        borderRadius: 9999,
        marginRight: 6,
    },
})