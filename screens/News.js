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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const CARD_WIDTH = Math.min(Dimensions.get('screen').width * 0.84, 400);

export default function News({ navigation }) {
  const [value, setValue] = React.useState(0);
  const [news, setNews] = useState();
  const [category, setCategory] = useState();
  const [selectedCategory, setSelectedCategory] = useState(1394);
  const [newsByCategory, setNewsByCategory] = useState();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const { userId } = useUser()

  const fetchSavedNews = async () => {
    try {
      const res = await Apis.get(endpoints.savePost + '/' + userId)
      setSavedPosts(res.data);
    } catch (error) {
      console.error("Error fetching saved news:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedNews();
      return () => { };
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Apis.get(`${endpoints["postBycategory"]}${selectedCategory}?size=${5}`)
      setNewsByCategory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await Apis.get(`${endpoints.news}/random?page=${page}&size=${5}`);
      setPosts(prevPosts => [...prevPosts, ...response.data.content]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const resCategory = await Apis.get(endpoints["category"])
        setCategory(resCategory.data);
        // const resNews = await cache.get("news");
        // setNews(resNews);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategory();
  }, [])
  useEffect(() => {
    fetchData();
  }, [selectedCategory])
  useEffect(() => {
    fetchPosts();
  }, [page]);


  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (!loading && isCloseToBottom) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  // const handleSave = async (postId) => {
  //   try {
  //     savedPosts.includes(postId) ?
  //       await Apis.delete(`${endpoints.savePost}/delete?userId=${userId}&postId=${postId}`) :
  //       await Apis.post(endpoints.savePost, { userId, postId });
  //   } catch (error) {
  //     console.error("Error fetching save post data:", error);
  //   }
  // };


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View>
        <SafeAreaView>
          <HeaderWithBackButton title={'Chuyên mục'} navigation={navigation} />
        </SafeAreaView>
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} onScroll={handleScroll}>
        <View style={styles.tabs}>
          <View style={{ backgroundColor: '#eee', paddingHorizontal: 5.5, paddingVertical: 4, borderRadius: 50, marginRight: 7 }}>
            <Ionicons name="options-sharp" size={19} style={{ color: COLORS.primary }} />
          </View>
          {/* category */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
            {category && category.map(({ id, name }, index) => {
              const isActive = index === value;
              return (
                <TouchableOpacity key={id} onPress={() => { setValue(index); setSelectedCategory(id); }}
                  style={[styles.tabsItemWrapper, isActive && { color: COLORS.white, backgroundColor: COLORS.primary },]}>
                  <View style={styles.tabsItem}>
                    <Text style={[styles.tabsItemText, isActive && { color: COLORS.white }]}>{name}</Text>
                  </View>
                  {isActive && <View style={styles.tabsItemLine} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* List news */}
        <View style={styles.list}>
          <ScrollView contentContainerStyle={styles.listContent} horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
            {!loading && newsByCategory?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate("NewsDetail", { item, isSaved: savedPosts.map(item => parseInt(item?.post?.id)).includes(item?.id) })}
                >
                  <View style={styles.card}>
                    <View style={styles.cardBody}>
                      <View style={{ height: '70%' }}>
                        {/* <Text>{item.content.replace(htmlRegexG, '').replace(/undefined/g, '').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').length}</Text> */}
                        <Text style={{ color: '#e67a32', fontWeight: 500, marginBottom: 2, textTransform: 'uppercase', fontSize: 13 }}>{String(item.category.name)}</Text>
                        <Text style={styles.cardTitle}>{item.header}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* <Text style={styles.cardRowItemTextNews}>{String(item.author)}</Text> */}
                        {/* <Text style={{ ...styles.cardRowDividerNews, marginHorizontal: 6 }}>·</Text> */}
                        {/* <FontAwesome name="bookmark-o" size={18} style={{ marginLeft: '94%' }} onPress={console.log('aaaa')} /> */}
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...styles.cardSubtitle, fontSize: 12 }}>
                          {moment(new Date(parseInt(item.createdDate)).toLocaleDateString('vi'), "DDMMYYYY").fromNow()}
                        </Text>
                        {/* {item.audio && <Ionicons name="volume-high" size={19} style={{ color: '#7f8c8d', marginLeft: -70 }} />} */}
                      </View>
                    </View>
                    <Image alt="img" source={{ uri: item.image }} style={styles.cardCover} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ justifyContent: 'center' }} />}
        </View>
        {/* Premium list */}
        {/* <TouchableOpacity style={{ backgroundColor: "#dff9fb", paddingBottom: 20 }}>
          <Premium size='large' />
          <Text style={{ fontSize: 16, color: '#243b58', marginHorizontal: 20, marginVertical: 16 }}>Các thông tin sức khỏe đặc biệt được nghiên cứu và tham vấn y khoa</Text>
          <ScrollView contentContainerStyle={styles.listContentNews} horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
            {dataNews.map(({ img, name, category, time }, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    // handle onPress
                  }}>
                  <View style={styles.newsCard}>
                    <Image alt="" source={{ uri: img }} style={{ width: '100%', height: 222, borderRadius: 16 }} />
                    <View style={{
                      position: 'absolute',
                      top: -2,
                      right: 10,
                      elevation: 1,
                    }}>
                      <Premium size='small' />
                    </View>
                    <View style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      elevation: 1,
                      width: '86%'
                    }}><Text style={{
                      color: '#fffffd',
                      fontWeight: 500,
                      lineHeight: 20,
                    }}>
                        {name}
                      </Text>
                    </View>
                    <View style={styles.overlay} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity> */}
        {/* Recent news */}
        <View>
          <View style={{ marginTop: 8 }}>
            <View style={{ marginTop: 1, flexDirection: 'row', marginLeft: 14 }}>
              <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={22} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: 20, fontWeight: 600, marginLeft: 13 }}>Các bài viết nổi bật</Text>
            </View>
            {<View style={{ marginLeft: 16, marginVertical: 5 }}>
              {posts?.map((item, index) => {
                return (
                  index == 0 ?
                    <View key={index} style={{
                      marginTop: 10,
                      borderBottomColor: '#f3f4f6',
                      borderBottomWidth: 0.7,
                      paddingBottom: 10,
                      marginTop: 14
                    }}>
                      <TouchableOpacity style={{
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        borderRadius: 12,
                        marginBottom: 16,
                        backgroundColor: '#fff',
                        position: 'relative',
                        height: 300
                      }}
                        onPress={() => navigation.navigate("NewsDetail", { item, isSaved: savedPosts.map(item => parseInt(item?.post?.id)).includes(item?.id) })}
                      >
                        <Image
                          alt=""
                          resizeMode="cover"
                          source={{ uri: item.image }}
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
                          }}>{String(item.category.name)}</Text>

                          <Text style={styles.cardTitleNews}>{String(item.header)}</Text>

                          <View style={styles.cardRowNews}>
                            <View style={styles.cardRowItemNews}>
                              {/* <Image
                                alt=""
                                source={{ uri: item.authorImage ? item.authorImage : item.image }}
                                style={styles.cardRowItemImgNews}
                              /> */}

                              <Text style={styles.cardRowItemTextNews}>{String(item.author)}</Text>
                            </View>

                            <Text style={styles.cardRowDividerNews}>·</Text>

                            <View style={styles.cardRowItemNews}>
                              <Text style={styles.cardRowItemTextNews}>
                                {moment(new Date(parseInt(item.createdDate)).toLocaleDateString('vi'), "DDMMYYYY").fromNow()}
                              </Text>
                              {/* {item.audio && <Ionicons name="volume-high" size={19} style={{ color: '#7f8c8d', marginLeft: 8 }} />} */}
                              {/* <Text>{item.content.replace(htmlRegexG, '').replace(/undefined/g, '').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').length}</Text> */}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {/* <TouchableOpacity onPress={() => {
                        //toggle save and unsave
                        savedPosts.includes(item.id) ?
                          setSavedPosts(savedPosts.filter(id => id !== item.id)) :
                          setSavedPosts([...savedPosts, item.id]);
                        handleSave(item.id)
                      }}>
                        <FontAwesome name={savedPosts.includes(item.id) ? "bookmark" : "bookmark-o"} size={22} style={{ position: 'absolute', right: 28, bottom: 10, color: savedPosts.includes(item.id) ? COLORS.primary : COLORS.black }} />
                      </TouchableOpacity> */}
                    </View> :
                    <View
                      key={index}
                      style={{
                        borderBottomColor: '#f3f4f6',
                        borderBottomWidth: 0.7,
                        marginTop: 15
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => navigation.navigate("NewsDetail", { item, isSaved: savedPosts.map(item => parseInt(item?.post?.id)).includes(item.id) })}
                        style={styles.cardNews}>
                        <Image
                          alt=""
                          resizeMode="cover"
                          source={{ uri: item.image }}
                          style={styles.cardImgNews}
                        />

                        <View style={styles.cardBodyNews}>
                          <Text style={styles.cardTagNews}>{String(item.category.name)}</Text>

                          <Text style={styles.cardTitleNews}>{String(item.header)}</Text>

                          <View style={styles.cardRowNews}>
                            <View style={styles.cardRowItemNews}>
                              {/* <Image
                                alt=""
                                source={{ uri: item.authorImage ? item.authorImage : item.image }}
                                style={styles.cardRowItemImgNews}
                              /> */}

                              <Text style={styles.cardRowItemTextNews}>{String(item.author)}</Text>
                            </View>

                            <Text style={styles.cardRowDividerNews}>·</Text>

                            <View style={styles.cardRowItemNews}>
                              <Text style={styles.cardRowItemTextNews}>
                                {moment(new Date(parseInt(item.createdDate)).toLocaleDateString('vi'), "DDMMYYYY").fromNow()}
                              </Text>
                              {/* {item.audio && <Ionicons name="volume-high" size={20} style={{ color: '#7f8c8d', marginLeft: 8 }} />} */}
                            </View>
                            {/* <Text>{item.content.replace(htmlRegexG, '').replace(/undefined/g, '').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').length}</Text> */}
                          </View>
                        </View>
                      </TouchableOpacity>
                      {/* <TouchableOpacity onPress={() => {
                        savedPosts.includes(item.id) ?
                          setSavedPosts(savedPosts.filter(id => id !== item.id)) :
                          setSavedPosts([...savedPosts, item.id]);
                        handleSave(item.id)
                      }}>
                        <FontAwesome name={savedPosts.includes(item.id) ? "bookmark" : "bookmark-o"} size={22} style={{ position: 'absolute', right: 28, bottom: 16, color: savedPosts.includes(item.id) ? COLORS.primary : COLORS.black }} />
                      </TouchableOpacity> */}
                    </View>
                );
              })}
              {!posts && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50, justifyContent: 'center' }} />}
              {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginBottom: 20, justifyContent: 'center' }} />}
            </View>}
          </View>
        </View>
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginTop: 3
  },
  title: {
    paddingHorizontal: 24,
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  listContent: {
    paddingTop: 2,
    paddingHorizontal: 6,
    paddingBottom: 0,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  listTitle: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: '#000',
  },
  listAction: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'right',
    letterSpacing: -0.24,
    color: '#0067ff',
  },
  card: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    paddingLeft: 12,
    height: 140,
    backgroundColor: '#eee',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc'
  },
  cardCover: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 10,
    marginLeft: 12,
    marginTop: 18
  },
  cardBody: {
    height: '80%',
    width: '64%'
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#070b11',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: '#070b11',
    opacity: 0.6,
    width: '70%'
  },
  cardAction: {
    paddingHorizontal: 8,
  },
  list: {
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 20,
    marginTop: 2
  },
  tabsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 3,
    paddingTop: 4,
  },
  tabsItemLine: {
    width: 20,
    height: 3,
    borderRadius: 24,
  },
  tabsItemWrapper: {
    marginRight: 8,
    backgroundColor: '#eee',
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  tabsItemText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#565656'
  },
  newsCard: {
    position: 'relative',
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    border: 1,
    marginHorizontal: 5
  },
  listContentNews: {
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: '#666',
    width: '100%',
    borderRadius: 16,
    height: '40%'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
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
});