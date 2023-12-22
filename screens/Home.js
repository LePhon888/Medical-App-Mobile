import React, { useState } from "react";
import { Image } from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../constants/colors";
import { FloatingAction } from "react-native-floating-action";
const { width } = Dimensions.get("screen");
import { } from "react-native";
import News from "./News";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";


const Home = ({ navigation: { goBack } }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const categoryIcons = [
    {
      path: require('../assets/images/health.png'),
      text: 'Sức khỏe của tôi'
    },
    {
      path: require('../assets/images/drugs.png'),
      text: 'Thư viện thuốc'
    },
    {
      path: require('../assets/images/first-aid-kit.png'),
      text: 'Y tế chuyên khoa'
    },
    {
      path: require('../assets/images/medical-history.png'),
      text: 'Lịch sử đăng ký'
    },
    {
      path: require('../assets/images/medical-report.png'),
      text: 'Đăng ký khám'
    },
    {
      path: require('../assets/images/video-call.png'),
      text: 'Gọi video'
    },
    {
      path: require('../assets/images/medicine.png'),
      text: 'Hộp thuốc cá nhân'
    },
    {
      path: require('../assets/images/customer-behavior.png'),
      text: 'Tùy chọn'
    },
  ]
  const ListCategories = () => {
    return (
      <View style={style.categoryContainer}>
        {categoryIcons.map((item, index) => (
          <View key={index} style={style.iconContainer}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              margin: 6
            }}
            // onPress={() => navigation.navigate("AppointmentList")}
            >
              <Image source={item.path} style={{ width: 32, height: 32, marginBottom: 3 }} />
              <Text style={{ textAlign: 'center' }}>{item.text}</Text>
            </View>
          </View>
        ))
        }
      </View >
    );
  };

  const Card = ({ place }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("DetailsScreen", place)}
      >
        <ImageBackground style={style.cardImage} source={place.image}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            {place.name}
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Icon name="place" size={20} color={COLORS.white} />
              <Text style={{ marginLeft: 5, color: COLORS.white }}>
                {place.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="star" size={20} color={COLORS.white} />
              <Text style={{ marginLeft: 5, color: COLORS.white }}>5.0</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const RecommendedCard = ({ place }) => {
    return (
      <ImageBackground style={style.rmCardImage} source={place.image}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {place.name}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Icon name="place" size={22} color={COLORS.white} />
              <Text style={{ color: COLORS.white, marginLeft: 5 }}>
                {place.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon name="star" size={22} color={COLORS.white} />
              <Text style={{ color: COLORS.white, marginLeft: 5 }}>5.0</Text>
            </View>
          </View>
          <Text style={{ color: COLORS.white, fontSize: 13 }}>
            {place.details}
          </Text>
        </View>
      </ImageBackground>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar translucent={false} backgroundColor={COLORS.primary} />
      <View style={style.header}>
        <View style={{ padding: 6, backgroundColor: COLORS.white, width: 40, height: 40, marginRight: 10, borderRadius: 50 }}>
          <AntDesign name="search1" size={21} color={COLORS.black} style={{ marginLeft: 3, marginTop: 2 }} />
        </View>
        <View style={{ padding: 6, backgroundColor: COLORS.white, width: 40, height: 40, borderRadius: 50 }}>
          <AntDesign name="bells" size={21} color={COLORS.black} style={{ marginLeft: 3, marginTop: 2 }} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            height: 120,
            paddingHorizontal: 20,
          }}
        >
        </View>
        <ListCategories />
        <View>
          <FlatList
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            // data={places}
            renderItem={({ item }) => <Card place={item} />}
          />
          {/* <News /> */}
          <Text style={style.sectionTitle}>Kế hoạch sức khỏe</Text>
          <TouchableOpacity style={{
            backgroundColor: COLORS.primary, height: 90, width: '94%', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, marginTop: 6, borderRadius: 20
          }}>

          </TouchableOpacity>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{ paddingLeft: 20, paddingBottom: 20 }}
            showsHorizontalScrollIndicator={false}
            horizontal
            // data={places}
            renderItem={({ item }) => <RecommendedCard place={item} />}
          />
        </View>
      </ScrollView>
      <FloatingAction
        iconHeight={70}
        iconWidth={70}
        actions={[]}
        onPressMain={() => navigation.navigate("ChatBot")}
        overlayColor={"#FFFFF"}
        floatingIcon={{
          uri: "https://cdn.dribbble.com/userupload/2798813/file/original-a9da6aa3bf061621ab9d8c97a226a358.png",
        }}
      />
    </SafeAreaView >
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 23,
  },
  inputContainer: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    position: "absolute",
    top: 90,
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    backgroundColor: COLORS.white,
    padding: 10,
    height: 190,
    marginTop: -100,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  iconContainer: {
    height: 80,
    width: '24%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  cardImage: {
    height: 220,
    width: width / 2,
    marginRight: 20,
    padding: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  rmCardImage: {
    width: width - 40,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
});
export default Home;