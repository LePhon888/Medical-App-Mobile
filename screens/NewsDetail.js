import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Slider,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../constants/colors";
import "url-search-params-polyfill";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import Sound from 'react-native-sound';
import axios from "axios";
import Apis, { endpoints } from "../config/Apis";
const customIcons = [
  <MaterialCommunityIcons
    name="format-letter-case"
    size={23}
    onPress={() => {
      setClickCount(prevCount => prevCount + 1);

      if (clickCount >= 2) {
        setFontSize(initialFontSize);
        setClickCount(0);
      } else {
        setFontSize(prevSize => prevSize + 5);
      }
    }}
  />,
  <FontAwesome name="bookmark-o" size={19} />,
  <FeatherIcon color="#242329" name="share" size={19} />
];

export default function NewsDetail({ navigation, route }) {
  const news = route.params;
  const { width } = useWindowDimensions();
  const source = { html: `${news?.content}` };
  const initialFontSize = 16;
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [clickCount, setClickCount] = useState(0);
  const [header, setHeader] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [newsByCategory, setNewsByCategory] = useState([]);
  const scrollViewRef = useRef(null);

  var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
  var modifiedContent = news.content.replace(htmlRegexG, '').replace(/undefined/g, '').replace(/&nbsp;/g, '').replace(/\s+/g, ' ');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Apis.get(`${endpoints["postBycategory"]}${news.category.id}?size=${3}`)
        setNewsByCategory(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [news.category.id, news.id])

  useEffect(() => {
    const soundObject = new Sound(news.audio ?? '', '', (error) => {
      setSound(soundObject);
    });

    return () => {
      soundObject.release();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && sound) {
      sound.play((success) => {
        if (!success) {
          console.log('Sound did not play successfully');
        } else {
          console.log('Sound play successfully');
        }
      });
    } else if (!isPlaying && sound) {
      sound.pause();
    }
  }, [isPlaying, sound]);

  // useEffect(() => {
  //   const fetchAudio = async () => {
  //     const url = 'https://api.fpt.ai/hmi/tts/v5';
  //     const headers = {
  //       'api-key': '7MLI6gmBdIcwO9ASonzUQ8X4Ecb3XrKa',
  //       'speed': '',
  //       'voice': 'linhsan'
  //     };
  //     const data = modifiedContent.slice(0, 5000);
  //     try {
  //       const response = await axios.post(url, data, { headers });
  //       console.log('responseresponseresponse', response.data.async);
  //       await axios.put(endpoints.news + '/' + news.id + '?audio=' + response.data.async);
  //       setAudio(response.data.async);
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };
  //   fetchAudio();
  // }, []);
  // useEffect(() => {
  //   const findAudio = async () => {
  //     try {
  //       const res = await axios.get(audio);
  //       res.status === 200 ? console.log('URL found') : console.log('URL not found');
  //     } catch (error) {
  //       error.response && error.response.status === 404 ? console.log('URL not found') : console.error('Error:', error);
  //     }
  //   };
  //   findAudio();
  // }, [audio]);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View >
        <SafeAreaView>
          <HeaderWithBackButton customIcons={customIcons} navigation={navigation} />
        </SafeAreaView>
      </View>

      <ScrollView ref={scrollViewRef} // Reference to the ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Necessary for scrolling to work
      >
        <View style={styles.photos}>
          <View style={styles.photos}>
            <View style={{ flex: 1 }}>
              <Image
                source={{
                  uri: news.image,
                }}
                style={styles.photosImg}
              />
            </View>
          </View>
        </View>
        <View style={styles.header}>
          <Text style={{ textTransform: 'uppercase', marginBottom: 14, marginTop: 22, fontWeight: 600, color: COLORS.primary }}>
            {news.tag}
          </Text>
          <Text style={styles.headerTitle}>
            {header ? header : news.header}
          </Text>
          <View style={styles.headerRow}>
            <View style={styles.headerLocation}>
              <Text style={styles.headerLocationText}>
                Tác giả: {news.author}
              </Text>
              {news.audio && <TouchableOpacity onPress={() => setIsPlaying(pre => !pre)}>
                <Ionicons name={isPlaying ? "pause-circle-outline" : "play-circle-outline"} size={30} color={COLORS.primary} />
              </TouchableOpacity>}
            </View>

            {/* <Text style={styles.headerPrice}>$650.00</Text> */}
          </View>
        </View>
        <View style={styles.picker}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.pickerDates}
          >
            <FeatherIcon color="#242329" name="calendar" size={16} />
            <Text style={styles.pickerDatesText}>
              Ngày phát hành: <Text style={styles.cardRowItemTextNews}>{new Date(parseInt(news.createdDate)).toLocaleDateString('vi')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stats}>
          <View style={styles.statsItem}></View>
        </View>
        <View style={styles.about}>
          <RenderHtml
            contentWidth={width}
            source={source}
            tagsStyles={{ div: { fontSize }, span: { fontSize } }}
          />
        </View>

        <View style={{ backgroundColor: '#f5f9fe', paddingLeft: 20, paddingRight: 10, paddingTop: 26 }}>
          <Text style={{ fontSize: 21, fontWeight: 'bold', color: '#2f3640', marginBottom: 6 }}>Bài viết liên quan</Text>
          {newsByCategory?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  navigation.navigate("NewsDetail", item);
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
                  }
                }}
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
                    source={{ uri: item.image }}
                    style={styles.cardImgNews}
                  />

                  <View style={styles.cardBodyNews}>
                    <Text style={styles.cardTagNews}>{String(item.category.name)}</Text>

                    <Text style={styles.cardTitleNews}>{String(item.header)}</Text>

                    <View style={styles.cardRowNews}>
                      <View style={styles.cardRowItemNews}>
                        <Text style={styles.cardRowItemTextNews}>{new Date(parseInt(item.createdDate)).toLocaleDateString('vi')}</Text>
                        {item.audio && <Ionicons name="volume-high" size={20} style={{ color: '#7f8c8d', marginLeft: 6 }} />}
                      </View>
                    </View>
                    <FontAwesome name="bookmark-o" size={19} style={{ position: 'absolute', right: 20, bottom: 4 }} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  actions: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: -8,
    marginBottom: 12,
  },
  photos: {
    paddingHorizontal: 4,
    position: "relative",
    height: 260,
    overflow: "hidden",
    borderRadius: 10,
    width: '100%',
  },
  photosImg: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: "100%",
    height: '100%',
    borderRadius: 12,
  },
  photosPagination: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#242329",
    borderRadius: 31,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  photosPaginationText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    color: "#ffffff",
  },
  header: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 32,
    color: "#242329",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  headerLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLocationText: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
    color: "#7b7c7e",
    marginLeft: 4,
    marginRight: 5,
  },
  headerPrice: {
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 32,
    textAlign: "right",
    color: "#f26463",
  },
  headerStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerStarsText: {
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
    color: "#7b7c7e",
  },
  headerDistance: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
    color: "#7b7c7e",
  },
  picker: {
    marginTop: 12,
    marginHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    height: 48,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderStyle: "solid",
    borderRadius: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerDates: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerDatesText: {
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 18,
    color: "#242329",
  },
  pickerFilter: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerFilterWrapper: {
    borderLeftWidth: 1,
    borderColor: "#e5e5e5",
    paddingLeft: 12,
  },
  pickerFilterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  pickerFilterItemText: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    color: "#242329",
    marginLeft: 4,
  },
  stats: {
    marginVertical: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsItemText: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 18,
    color: "#242329",
    marginLeft: 7,
  },
  about: {
    marginHorizontal: 16,
  },
  aboutTitle: {
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 32,
    color: "#242329",
    marginBottom: 4,
  },
  aboutDescription: {
    color: COLORS.black,
  },
  footer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderWidth: 1,
    backgroundColor: "#242329",
    borderColor: "#242329",
    height: 52,
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    height: 52,
  },
  btnSecondaryText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "700",
    color: "#fff",
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "700",
    color: "#fff",
  },
  action: {
    width: 36,
    height: 36,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderStyle: "solid",
    borderRadius: 12,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 0,
  },
  tabsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  tabsItemLine: {
    width: 20,
    height: 3,
    backgroundColor: "#f26463",
    borderRadius: 24,
  },
  tabsItemWrapper: {
    marginRight: 28,
  },
  tabsItemText: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    color: "#7b7c7e",
  },
  cardNews: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12,
    marginBottom: 16,
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
    fontSize: 14,
    color: '#2e87ef',
    marginBottom: 7,
    textTransform: 'capitalize',
  },
  cardTitleNews: {
    fontWeight: '600',
    fontSize: 17,
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
  },
  cardRowItemImgNews: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    marginRight: 6,
  },

});
