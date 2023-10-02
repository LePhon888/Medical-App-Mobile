import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Apis, { authApi, endpoints } from "../config/Apis";
import { ActivityIndicator } from "react-native";
import COLORS from "../constants/colors";
import NewsDetail from "./NewsDetail";
import { useNavigation } from "@react-navigation/native";

const News = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Apis.get(endpoints["news"]);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };
    fetchData();
  }, []);

  // const handlePressNews = (selectedNews) => {
  //   navigation.navigate("NewsDetail", { news: selectedNews });
  // };
  return (
    <View style={styles.container}>
      {news ? (
        news.map((news, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("NewsDetail", { news: news })}
            >
              <View style={styles.card}>
                <Image
                  alt=""
                  resizeMode="cover"
                  source={{ uri: news.image }}
                  style={styles.cardImg}
                />

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{news.header}</Text>
                  <Text style={styles.cardTag}>Tác giả: {news.author}</Text>

                  <View style={styles.cardRow}>
                    <View style={styles.cardRowItem}>
                      <Image
                        alt=""
                        source={{
                          uri: news.authorImage ? news.authorImage : news.image,
                        }}
                        style={styles.cardRowItemImg}
                      />

                      <Text style={styles.cardRowItemText}>{news.date}</Text>
                    </View>

                    <Text style={styles.cardRowDivider}>·</Text>

                    <View style={styles.cardRowItem}>
                      <Text style={styles.cardRowItemText}>{}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};
export default News;
const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  cardImg: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 16,
  },
  cardTag: {
    fontWeight: "500",
    fontSize: 12,
    color: "#939393",
    marginBottom: 7,
    textTransform: "capitalize",
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
    color: "#000",
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -8,
    marginBottom: "auto",
  },
  cardRowDivider: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#939393",
  },
  cardRowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderColor: "transparent",
  },
  cardRowItemText: {
    fontWeight: "400",
    fontSize: 13,
    color: "#939393",
  },
  cardRowItemImg: {
    width: 22,
    height: 22,
    borderRadius: 9999,
    marginRight: 6,
  },
});
