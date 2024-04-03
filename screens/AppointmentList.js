import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Apis, { endpoints } from "../config/Apis";
import COLORS from "../constants/colors";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from "moment/moment";
import { ActivityIndicator } from "react-native-paper";
import WebView from "react-native-webview";

export default function AppointmentList({ navigation }) {
  const [appointment, setAppointment] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const response = await Apis.get(
          endpoints.appointment + "/detail/" + JSON.parse(user).id
        );
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (item) => {
    try {
      const resPayment = await Apis.get(
        `${endpoints.payment}?orderInfo=${item.id}&amount=${item.fee.fee}`
      );
      setPayment(resPayment);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const onNavigationStateChange = (navState) => {
    navState.url?.includes('payment-response') && navState.url?.includes('vnp_PayDate') && navigation.navigate('Status', { status: 1 });
  }

  if (payment?.data.url) {
    return (<WebView source={{ uri: payment?.data.url }} style={{ flex: 1 }} onNavigationStateChange={onNavigationStateChange} />)
  }
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <HeaderWithBackButton title={'Lịch sử đặt hẹn'} customIcons={[
        <TouchableOpacity onPress={() => navigation.navigate("Doctors")}>
          <Feather name="plus" size={24} style={{ marginTop: 4 }} />
        </TouchableOpacity>
      ]} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        {appointment === null && <ActivityIndicator size={40} color={COLORS.primary} style={{ marginTop: 300 }} />}
        {appointment?.map((item, index) => {
          return (
            <View key={index}>
              <View style={styles.radio}>
                <View style={styles.radioTop}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ height: 50, marginTop: 4, marginLeft: 4 }}>
                      <Image alt="image" style={styles.profileAvatar} source={{ uri: item.doctor.user.image }} />
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.radioLabel}>{item.doctor.title + ' ' + item.doctor.user.lastName + ' ' + item.doctor.user.firstName}</Text>
                      <View style>
                        <Text style={{ fontSize: 13, fontWeight: '400', color: '#848a96' }}>{item.doctor.department.name}</Text>
                      </View>
                    </View>
                  </View>
                  {/* <View style={{ position: 'absolute', right: 60 }}>
                    <View style={{ flexDirection: 'row' }}>
                    </View>
                  </View> */}

                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingVertical: 3, borderWidth: 0.5, width: 82, borderRadius: 20, borderColor: '#368866', color: '#218e60', backgroundColor: '#e1f8ee', marginLeft: 56, marginTop: -8 }}>
                      <Text style={{ fontSize: 12, color: '#218e60', marginLeft: 6, fontWeight: '500' }}>Tư vấn từ xa</Text>
                    </View>
                    {item.isPaid == 0 && <View style={{ marginLeft: 8, paddingVertical: 3, width: 116, borderRadius: 20, backgroundColor: '#808e9b', marginTop: -8, flexDirection: 'row' }}>
                      <AntDesign name="close" size={12} style={{ marginLeft: 6, marginTop: 2, color: '#fff' }} />
                      <Text style={{ fontSize: 12, color: '#fff', marginLeft: 2, fontWeight: '500' }}>Chưa thanh toán</Text>
                    </View>}
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 14 }} >
                    <Image source={require('../assets/images/calendar.png')} style={{ width: 24, height: 24, marginLeft: 8, marginRight: 26 }} />
                    <View style={{ flexDirection: 'column' }}>
                      <Text style={styles.dateText}>{moment(item.date, 'YYYY/MM/DD').format('DD/MM/YYYY')}</Text>
                      <Text style={styles.cardFooterItemText}>{item.hour.hour}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ height: 50, marginTop: 4, marginLeft: 4 }}>
                      <Image alt="image" style={styles.profileAvatar} source={{ uri: item.doctor.user.image }} />
                    </View>
                    <View style={{ flexDirection: 'column', width: '86%' }}>
                      <Text style={styles.radioLabel}>{item.doctor.hospital}</Text>
                      <View style={{ width: '97%' }}>
                        <Text style={{ color: '#848a96' }}>{item.doctor.hospitalAddress}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ backgroundColor: '#f4f9ff', marginTop: -5, marginBottom: 14, paddingVertical: 10, paddingLeft: 16, borderBottomEndRadius: 12, borderBottomStartRadius: 12, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#dfe6e9' }}>
                {item.isPaid == 1 ? <TouchableOpacity style={{ flexDirection: 'row' }}
                  onPress={() => navigation.navigate("Doctors")}>
                  <Entypo name="ccw" size={16} style={{ marginTop: 1, color: '#0984e3' }} />
                  <Text style={{ marginLeft: 5, fontWeight: 500, fontSize: 13, color: '#0984e3' }}>Đặt lịch hẹn mới</Text>
                </TouchableOpacity> : <TouchableOpacity style={{ flexDirection: 'row' }}
                  onPress={() => onSubmit(item)}>
                  <Entypo name="align-right" size={16} style={{ marginTop: 1, color: '#0984e3' }} />
                  <Text style={{ marginLeft: 5, fontWeight: 500, fontSize: 13, color: '#0984e3' }}>Thanh toán ngay</Text>
                </TouchableOpacity>}
              </View>
            </View>
          )
        })}

      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  card: {
    paddingVertical: 14,
  },
  cardWrapper: {
    borderBottomWidth: 0.3,
    borderColor: "#ccc",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
    marginTop: 8,
    marginHorizontal: -8,
  },
  cardFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 0.7,
    borderRadius: 20
  },
  cardFooterItemText: {
    fontSize: 11,
    color: "#464646",
  },
  cardLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#272727",
    marginBottom: 4,
  },
  cardCompany: {
    fontSize: 14,
    fontWeight: "500",
    color: "#818181",
  },
  cardSalary: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardPrice: {
    marginLeft: "auto",
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardPriceConfirm: {
    marginLeft: "auto",
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary,
    position: 'absolute',
    right: 60,
    bottom: 0
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
    marginBottom: 20,
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
  radio: {
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginTop: 8,
  },
  radioActive: {
    borderColor: '#0069fe',
  },
  radioTop: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 4,
    position: 'relative'
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  radioUsers: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2f2f2f',
  },
  radioDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#848a96',
    marginLeft: 8
  },
  profileAvatar: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    marginRight: 20,
  },
});
