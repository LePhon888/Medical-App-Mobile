import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Slider
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
import axios from "axios";
import Sound from 'react-native-sound';
import Button from "../components/Button";

export default function NewsDetail({ navigation, route }) {
  const news = route.params;
  const { width } = useWindowDimensions();
  const source = {
    html: `${news?.content}`
  };
  const initialFontSize = 16;
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [clickCount, setClickCount] = useState(0);
  const [header, setHeader] = useState(null);
  const [audio, setAudio] = useState(null);
  var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
  var modifiedContent = news.content.replace(htmlRegexG, '').replace(/undefined/g, '').replace(/&nbsp;/g, '').replace(/\s+/g, ' ');
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
  const playSound = async (url) => {
    const sound = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });
  };
  useEffect(() => {
    const fetchAudio = async () => {
      const url = 'https://api.fpt.ai/hmi/tts/v5';
      const headers = {
        'api-key': 'XBzh8Evbm8BmnSLTyiEKbpAIZfI0RYcu',
        'speed': '',
        'voice': 'linhsan'
      };
      const data = modifiedContent.slice(0, 5000);
      try {
        const response = await axios.post(url, data, { headers });
        setAudio(response.data.async);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchAudio();
  }, []);
  useEffect(() => {
    const findAudio = async () => {
      try {
        const res = await axios.get(audio);
        res.status === 200 ? console.log('URL found') : console.log('URL not found');
      } catch (error) {
        error.response && error.response.status === 404 ? console.log('URL not found') : console.error('Error:', error);
      }
    };
    findAudio();
  }, [audio]);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View >
        <SafeAreaView>
          <HeaderWithBackButton title={'Tin tức'} customIcons={customIcons} navigation={navigation} />
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
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
              <TouchableOpacity onPress={() => playSound(audio)}>
                <Ionicons name="play-circle-outline" size={36} color={COLORS.primary} />
              </TouchableOpacity>
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
          {/* <Text style={styles.aboutDescription}>
            {content ? content : news.content}
          </Text> */}
          <RenderHtml
            contentWidth={width}
            source={source}
            tagsStyles={{ div: { fontSize }, span: { fontSize } }}
          />
        </View>
        <View>
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
});
