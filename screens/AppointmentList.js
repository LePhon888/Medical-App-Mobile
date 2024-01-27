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
import { medicines } from "../config/data";

export default function AppointmentList({ navigation: { goBack } }) {
  function formatDate(inputDate) {
    const dateComponents = inputDate.split("-");

    const dateObject = new Date(
      dateComponents[0],
      dateComponents[1] - 1,
      dateComponents[2]
    );

    const formattedDate = `${dateObject.getDate()}-${(dateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObject.getFullYear()}`;

    return formattedDate;
  }
  const [appointment, setAppointment] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const response = await Apis.get(
          endpoints["appointment"] + "/" + JSON.parse(user).id
        );
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const data = [
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    },
    {
      reason: 'Ho khó thở',
      date: '10/01/2023',
      hour: '08:00',
      department: 'Đa khoa',
      doctor: 'BS.CKI Nguyen An Binh'
    }
  ]

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <HeaderWithBackButton title={'Lịch sử đặt hẹn'} customIcons={[
        <Feather name="plus" size={24} style={{ marginTop: 4 }} />
      ]} />
      <ScrollView contentContainerStyle={styles.container}>
        {data.map((item, index) => {
          return (
            <View key={index}>
              <View style={styles.radio}>
                <View style={{ height: 50 }}>
                  <Image alt="image" style={styles.profileAvatar} source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80" }} />
                </View>
                <View style={styles.radioTop}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.radioLabel}>{item.doctor}</Text>
                  </View>
                  <View style={{ position: 'absolute', right: 60 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/images/chronometer.png')} style={{ width: 16, height: 16, marginRight: 1 }} />
                      <Text style={styles.cardFooterItemText}>{item.hour}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', position: 'absolute', right: 60, top: 20 }}>
                    <Image source={require('../assets/images/calendar.png')} style={{ width: 20, height: 20, marginRight: 1 }} />
                    <Text style={styles.cardSalary}>{item.date}</Text>
                  </View>
                  <View >
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#848a96', marginBottom: 4 }}>{item.department}</Text>
                  </View>
                  <View style={{ borderWidth: 1, width: 94, borderRadius: 20, borderColor: '#368866', color: '#218e60', backgroundColor: '#e1f8ee', marginTop: 2 }}>
                    <Text style={{ fontSize: 14, color: '#218e60', marginLeft: 7 }}>Tư vấn từ xa</Text>
                  </View>
                </View>
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
    fontSize: 12,
    fontWeight: "500",
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
    fontSize: 13,
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
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 0.3,
    borderColor: '#ccc',
    marginTop: 8
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 5,
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
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 10,
  },
});
