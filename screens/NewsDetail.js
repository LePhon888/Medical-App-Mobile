import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRoute } from "@react-navigation/native";
import COLORS from "../constants/colors";
import axios from "axios";
import "url-search-params-polyfill";
import HeaderWithBackButton from "../common/HeaderWithBackButton";

export default function NewsDetail({ navigation }) {
  const route = useRoute();
  // const { news } = route.params;
  const news = {
    image: 'https://plus.unsplash.com/premium_photo-1663050986883-a5bdd99a7fa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2362&q=80',
    header: 'Cách hạ huyết áp cho người lớn tuổi dễ thực hiện, hiệu quả cao',
    author: 'Emily Chen',
    authorImg:
      'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1389&q=80',
    tag: 'Tăng huyết áp',
    content: 'Ăn uống các loại thực phẩm giúp làm giảm và tiêu đờm Cách tống đờm ra khỏi cổ họng đó là tăng cường tiêu thụ thực phẩm và đồ uống có chứa chanh, gừng và tỏi.Những thực phẩm này có thể hỗ trợ điều trị cảm lạnh, ho và đờm.Thực phẩm cay có chứa capsaicin, chẳng hạn như ớt cayenne hoặc ớt, cũng có thể giúp làm sạch xoang tạm thời và tống đờm ra ngoài khỏi cổ họng.Ngoài ra, món súp gà có thể mang lại nhiều lợi ích trong việc điều trị cảm lạnh và loại bỏ đờm dư thừa.Điều này là do súp gà làm chậm chuyển động của bạch cầu trung tính trong cơ thể bạn.Khi di chuyển chậm, bạch cầu trung tính sẽ ở lại những vùng bị nhiễm trùng lâu hơn, giúp chống lại nhiễm trùng. Ăn uống các loại thực phẩm giúp làm giảm và tiêu đờm Cách tống đờm ra khỏi cổ họng đó là tăng cường tiêu thụ thực phẩm và đồ uống có chứa chanh, gừng và tỏi.Những thực phẩm này có thể hỗ trợ điều trị cảm lạnh, ho và đờm.Thực phẩm cay có chứa capsaicin, chẳng hạn như ớt cayenne hoặc ớt, cũng có thể giúp làm sạch xoang tạm thời và tống đờm ra ngoài khỏi cổ họng.Ngoài ra, món súp gà có thể mang lại nhiều lợi ích trong việc điều trị cảm lạnh và loại bỏ đờm dư thừa.Điều này là do súp gà làm chậm chuyển động của bạch cầu trung tính trong cơ thể bạn.Khi di chuyển chậm, bạch cầu trung tính sẽ ở lại những vùng bị nhiễm trùng lâu hơn, giúp chống lại nhiễm trùng.',
    date: '11/12/2023',
  };
  const [header, setHeader] = useState(null);
  const [content, setContent] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const encodedParams = new URLSearchParams();
  encodedParams.set("source_language", "en");
  encodedParams.set("target_language", "vi");
  encodedParams.set("text", news.header);

  const translate = async () => {
    try {
      const sourceLanguage = currentLanguage === "en" ? "en" : "vi";
      const targetLanguage = currentLanguage === "en" ? "vi" : "en";

      const headerParams = new URLSearchParams();
      headerParams.set("source_language", sourceLanguage);
      headerParams.set("target_language", targetLanguage);
      headerParams.set("text", news.header);

      const contentParams = new URLSearchParams();
      contentParams.set("source_language", sourceLanguage);
      contentParams.set("target_language", targetLanguage);
      contentParams.set("text", news.content);

      const headerOptions = {
        method: "POST",
        url: "https://text-translator2.p.rapidapi.com/translate",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "0d190faf13msh1adb3499dd9a912p1e3358jsn7cdb1d58159a",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        data: headerParams,
      };

      const contentOptions = {
        method: "POST",
        url: "https://text-translator2.p.rapidapi.com/translate",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "0d190faf13msh1adb3499dd9a912p1e3358jsn7cdb1d58159a",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        data: contentParams,
      };

      const headerResponse = await axios.request(headerOptions);
      const contentResponse = await axios.request(contentOptions);

      const halfwayIndex = Math.floor(
        contentResponse.data.data.translatedText.length / 2
      );
      const trimmedContent = contentResponse.data.data.translatedText.slice(
        0,
        halfwayIndex
      );

      setHeader(headerResponse.data.data.translatedText);
      setContent(trimmedContent);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage((prevLanguage) => (prevLanguage === "en" ? "vi" : "en"));
    translate();
  };

  const customIcons = [
    <MaterialCommunityIcons name="format-letter-case" size={23} />,
    <FontAwesome name="bookmark-o" size={19} />,
    <FeatherIcon color="#242329" name="share" size={19} />
  ];
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View >
        <SafeAreaView>
          <HeaderWithBackButton title={'Tin tức'} customIcons={customIcons} />
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
              Ngày phát hành: {news.date}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stats}>
          <View style={styles.statsItem}></View>
        </View>
        <View style={styles.about}>
          <Text style={styles.aboutDescription}>
            {content ? content : news.content}
          </Text>
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
