import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Apis, { endpoints } from "../config/Apis";
import COLORS from "../constants/colors";

export default function AppointmentList({ navigation: { goBack } }) {
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

  return (
    <SafeAreaView style={{ backgroundColor: "#f2f2f2" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.actionWrapper}>
          <TouchableOpacity
            onPress={() => goBack()}
            style={{ marginRight: "auto" }}
          >
            <View style={styles.action}>
              <FeatherIcon color="#242329" name="chevron-left" size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.action}>
              <FeatherIcon color="#242329" name="heart" size={18} />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Danh sách lịch hẹn </Text>
        {appointment ? (
          appointment.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.cardWrapper,
                  index === 0 && { borderTopWidth: 0 },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                >
                  <View style={styles.card}>
                    <View style={styles.cardTop}>
                      {/* <View
                        style={[
                          styles.cardLogo,
                          { backgroundColor: COLORS.primary },
                        ]}
                      ></View> */}

                      <View style={styles.cardBody}>
                        <View>
                          <Text style={styles.cardTitle}>
                            {item.user.firstName} {item.user.lastName}
                          </Text>

                          <Text style={styles.cardCompany}>
                            Lý do hẹn:
                            {item.reason}
                          </Text>
                        </View>

                        <Text style={styles.cardSalary}>{item.date}</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <View style={styles.cardFooterItem}>
                        <Text style={styles.cardFooterItemText}>
                          {
                            <Text
                              style={
                                item.isConfirm === 1
                                  ? styles.cardPriceConfirm
                                  : styles.cardPrice
                              }
                            >
                              {item.isConfirm === 1
                                ? "Đã xác nhận"
                                : "Đang xác nhận"}
                            </Text>
                          }
                        </Text>
                      </View>

                      <View
                        style={[styles.cardFooterItem, { marginLeft: "auto" }]}
                      >
                        <Text style={styles.cardFooterItemText}>
                          Bác sĩ: {item.doctor.user.firstName}
                        </Text>
                        <Text>{"  "}</Text>
                        <FeatherIcon color="#464646" name="clock" size={14} />

                        <Text style={styles.cardFooterItemText}>
                          {item.hour.hour}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text>Loading</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  card: {
    paddingVertical: 14,
  },
  cardWrapper: {
    borderTopWidth: 1,
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
  },
  cardFooterItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#464646",
    marginLeft: 4,
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
    fontSize: 15,
    fontWeight: "700",
    color: "#959796",
  },
  cardPrice: {
    marginLeft: "auto",
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardPriceConfirm: {
    marginLeft: "auto",
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.secondary,
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
});
