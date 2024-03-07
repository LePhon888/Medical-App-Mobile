import React, { useEffect, useRef, useState } from "react";
import { Image } from 'react-native';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View, Text, ImageBackground, FlatList, Dimensions, TouchableOpacity, } from "react-native";
import { FloatingAction } from "react-native-floating-action";
const { width } = Dimensions.get("screen");
import { } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SimplePaginationDot } from '../components';
import { categoryIcons, data, dataCategoryNews } from "../config/data";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import Carousel from 'react-native-anchor-carousel';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useUser } from "../context/UserContext";
import Apis, { endpoints } from "../config/Apis";
import { useNotification } from "../context/NotificationContext";

const { width: windowWidth } = Dimensions.get('window');

const INITIAL_INDEX = 1;
const Home = ({ navigation, route }) => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [countUnread, setCountUnread] = useState(0)
  const { userId } = useUser()
  const { state, dispatch } = useNotification();
  const slideForward = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    carouselRef.current.scrollToIndex(nextIndex);
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      slideForward();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const countUnreadNotification = async () => {
    const res = await Apis.get(`${endpoints["notification"]}/unread-count/${userId}`)
    setCountUnread(res.data)
  }

  useEffect(() => {
    if (userId) {
      countUnreadNotification();
    }
  }, []);


  useEffect(() => {
    if (state.refreshData && userId) {
      countUnreadNotification()
      dispatch({ type: 'TOGGLE_REFRESH_DATA' });
    }
  }, [state, dispatch]);


  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }
  function renderItem({ item, index }) {
    const { path } = item;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={style.item}
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
        }}>
        <ImageBackground imageStyle={{ borderRadius: 10 }} source={path} style={style.imageBackground}>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
  const ListCategories = () => {
    return (
      <View style={style.categoryContainer}>
        {categoryIcons.map((item, index) => (
          <View key={index} style={style.iconContainer}>
            <TouchableOpacity style={{
              justifyContent: 'center',
              alignItems: 'center',
              margin: 6
            }}
              onPress={() => navigation.navigate(item.nav)}
            >
              <Image source={item.path} style={{ width: 32, height: 32, marginBottom: 3 }} />
              <Text style={{ textAlign: 'center' }}>{item.text}</Text>
            </TouchableOpacity>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.header}>
          <View style={{ marginTop: 4 }}><Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 700 }}>Chào bạn !</Text></View>
          <View style={{ flexDirection: 'row' }}>
            {/* <View style={{ padding: 6, backgroundColor: COLORS.white, width: 40, height: 40, marginRight: 10, borderRadius: 50 }}>
              <AntDesign name="search1" size={21} color={COLORS.black} style={{ marginLeft: 3, marginTop: 2 }} />
            </View>
            {/* Notification bell */}
            <TouchableOpacity style={{ padding: 6, backgroundColor: COLORS.white, width: 40, height: 40, borderRadius: 50, position: 'relative' }}
              onPress={() => navigation.navigate('Notification')}>
              <AntDesign name="bells" size={21} color={COLORS.black} style={{ marginLeft: 3, marginTop: 2 }} />
              <View style={{ backgroundColor: '#f44236', width: 18, height: 18, borderRadius: 50, alignItems: 'center', position: 'absolute', top: 3, right: 4 }}>
                <Text style={{ color: COLORS.white, fontWeight: 600, fontSize: 12 }}>{countUnread < 100 ? countUnread : '99+'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLORS.primary,
            height: 120,
            paddingHorizontal: 20,
            borderBottomEndRadius: 18,
            borderBottomStartRadius: 18
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
          <Text style={style.sectionTitle}>Hãy đến với chúng tôi</Text>
          <TouchableOpacity style={{
            height: 90, width: '94%', height: 170, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12
          }}>
            <ImageBackground imageStyle={{ borderRadius: 10 }} style={{ width: '100%', height: 170, borderRadius: 10, marginTop: 10 }} source={require('../assets/images/banner.png')} />
          </TouchableOpacity>
          <View style={style.container}>
            <Carousel
              style={style.carousel}
              data={data}
              renderItem={renderItem}
              itemWidth={0.86 * windowWidth}
              inActiveOpacity={1}
              containerWidth={windowWidth * 0.96}
              onScrollEnd={handleCarouselScrollEnd}
              ref={carouselRef}
            />
            <SimplePaginationDot currentIndex={currentIndex} length={data.length} />
          </View>
          <View style={style.list}>
            <View style={style.listHeader}>
              <Text style={style.listTitle}>Chuyên mục</Text>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={style.listAction}>
                <FeatherIcon color="#706F7B" name="chevron-right" size={16} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView contentContainerStyle={style.listContent} horizontal={true} showsHorizontalScrollIndicator={false}>
            {dataCategoryNews.map(({ path, label, color }, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // handle onPress
                }}>
                <View style={[style.card, { backgroundColor: color }]}>
                  <Image source={path} style={style.cardImg} />

                  <Text style={style.cardLabel}>{label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{ paddingLeft: 20, paddingBottom: 20, marginBottom: 60 }}
            showsHorizontalScrollIndicator={false}
            horizontal
            // data={places}
            renderItem={({ item }) => <RecommendedCard place={item} />}
          />
        </View>
      </ScrollView>
      {/* <Draggable x={300} y={200} renderSize={80} renderColor='black' isCircle onLongPress={() => console.log('touched!!')}>
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
      </Draggable> */}
    </SafeAreaView >
  );
};

const style = StyleSheet.create({
  header: {
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginTop: 26,
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
  container: {
    marginTop: 20,
    alignItems: 'center'
  },
  carousel: {
    backgroundColor: 'white',
    flexGrow: 0,
    marginBottom: 10,
    marginTop: 10,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    elevation: 3,
    borderRadius: 20,
    // marginHorizontal: 10

  },
  imageBackground: {
    flex: 2,
    height: 180,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listTitle: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#323142',
  },
  listAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listActionText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#706f7b',
    marginRight: 2,
  },
  card: {
    width: 80,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cardImg: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  cardLabel: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: '#252117',
  },
  list: {
    marginBottom: 6,
  },
});
export default Home;