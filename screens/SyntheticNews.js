import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderWithBackButton from '../common/HeaderWithBackButton';
import COLORS from '../constants/colors';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Apis, { endpoints } from "../config/Apis";
import { ActivityIndicator } from "react-native";
import optionCache from '../utils/optionCache';
import { Cache } from 'react-native-cache';
import moment from 'moment';
function SyntheticNews({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await Apis.get('https://newsdata.io/api/1/news?apikey=pub_43238bbf2637919f0aedd6a341245ff9cac1c&q=health&language=vi')
                setPosts(response.data.results);
                console.log(posts.length)
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Synthetic News data:", error);
            }
        };
        fetchData();
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: '#fff', marginBottom: -10 }}>
            <View>
                <SafeAreaView>
                    <HeaderWithBackButton title={'Tin tức'} navigation={navigation} />
                </SafeAreaView>
            </View>
            <ScrollView>
                <View style={{ marginTop: 1 }}>
                    {<View style={{ marginLeft: 16, marginVertical: 5 }}>
                        {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 200 }} />}
                        {posts?.filter(item => item.source_id != 'investing_vn').map((item, index) => {
                            return (
                                index == 0 ?
                                    <TouchableOpacity key={index} style={{
                                        marginTop: 10,
                                        borderBottomColor: '#f3f4f6',
                                        borderBottomWidth: 0.7,
                                        paddingBottom: 30,
                                        marginTop: 14
                                    }}
                                        onPress={() => navigation.navigate("SyntheticNewsDetail", item.link)}>
                                        <View style={{
                                            flexDirection: 'column',
                                            alignItems: 'stretch',
                                            borderRadius: 12,
                                            marginBottom: 16,
                                            backgroundColor: '#fff',
                                            position: 'relative',
                                            height: 300
                                        }}>
                                            <Image
                                                alt=""
                                                resizeMode="cover"
                                                source={{ uri: item.image_url }}
                                                style={{ width: '96%', height: 220, borderRadius: 10 }}
                                            />

                                            <View style={{
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                flexBasis: 0,
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                                alignItems: 'flex-start',
                                                marginTop: 10,
                                                marginRight: 10
                                            }}>
                                                <Text style={{
                                                    fontWeight: "500",
                                                    fontSize: 12,
                                                    marginBottom: 7,
                                                    textTransform: "capitalize",
                                                    color: '#fb741a'
                                                }}>{String(item.source_id)}</Text>

                                                <Text style={styles.cardTitleNews}>{String(item.title)}</Text>

                                                <View style={styles.cardRowNews}>
                                                    <View style={styles.cardRowItemNews}>
                                                        <Text style={styles.cardRowItemTextNews}>
                                                            {moment(item.pubDate, "YYYYMMDD").fromNow()}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity> :
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => navigation.navigate("SyntheticNewsDetail", item.link)}
                                        style={{
                                            borderBottomColor: '#f3f4f6',
                                            borderBottomWidth: 0.7,
                                            marginTop: 15
                                        }}
                                    >
                                        <View style={styles.cardNews}>
                                            <Image
                                                alt=""
                                                resizeMode="cover"
                                                source={{ uri: item.image_url }}
                                                style={styles.cardImgNews}
                                            />

                                            <View style={styles.cardBodyNews}>
                                                <Text style={styles.cardTagNews}>{String(item.source_id)}</Text>

                                                <Text style={styles.cardTitleNews}>{String(item.title)}</Text>

                                                <View style={styles.cardRowNews}>
                                                    <View style={styles.cardRowItemNews}>
                                                        <Text style={styles.cardRowItemTextNews}>
                                                            {moment(item.pubDate, "YYYYMMDD").fromNow()}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                            );
                        })}
                    </View>}
                </View>
            </ScrollView>
        </View>
    )
}

export default SyntheticNews
const styles = StyleSheet.create({
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
        marginBottom: 8,
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