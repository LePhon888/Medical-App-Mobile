import React, { useContext, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { UserContext } from "../App";
import { launchImageLibrary } from "react-native-image-picker";
import Apis, { endpoints } from "../config/Apis";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useUser } from "../context/UserContext";
import COLORS from "../constants/colors";
const SECTIONS = [
  {
    header: "Cài đặt",
    items: [
      // { id: "pass", icon: "user", label: "Đổi mật khẩu", type: "link" },
      // { id: "delete", icon: "user-minus", label: "Xóa tài khoản", type: "link" },
      { id: "notify", icon: "volume-2", label: "Thông báo", type: "link" },
      // { id: "language", icon: "globe", label: "Ngôn ngữ", type: "select" },
      // { id: "darkMode", icon: "moon", label: "Giao diện", type: "toggle" },
    ],
  },
  {
    header: "Giúp đỡ",
    items: [
      { id: "bug", icon: "tablet", label: "Góp ý ứng dụng", type: "link" },
      // { id: "bug1", icon: "flag", label: "Báo lỗi ứng dụng", type: "link" },
      // { id: "contact", icon: "mail", label: "Liên hệ chúng tôi", type: "link" },
      { id: "right", icon: "alert-circle", label: "Chính sách quyền riêng tư", type: "link" },
      // { id: "question", icon: "file-text", label: "Câu hỏi thường gặp", type: "link" },
    ],
  },
  {
    header: "Trạng thái",
    items: [
      //   {
      //     id: "download",
      //     icon: "download",
      //     label: "Downloads",
      //     type: "link",
      //   },
      {
        id: "logout",
        icon: "log-out",
        label: "Đăng xuất",
        type: "link",
      },
    ],
  },
];

export default function Setting({ navigation, route }) {
  const [form, setForm] = useState({
    language: "Tiếng việt",
    darkMode: true,
    wifi: false,
  });
  const [user, dispatch] = useState(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const isFocused = useIsFocused();
  const { userId, storeUserId } = useUser()

  useEffect(() => {
    const getUserAndToken = async () => {
      if (isFocused) {
        try {
          const currentUser = await AsyncStorage.getItem("user");
          setUserInfo(JSON.parse(currentUser));
          if (currentUser) {
            setSelectedImage(JSON.parse(currentUser).image);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    getUserAndToken();
  }, [isFocused]);

  const handleLogout = async () => {
    try {
      if (userInfo && userInfo.provider === "GOOGLE") {
        await GoogleSignin.signOut();
      }
      await Apis.delete(`${endpoints["userDevice"]}/delete/user/${userId}`)
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      dispatch({
        type: "logout",
      });
      navigation.navigate("Login");

    } catch (error) {
      // Handle errors if needed
      console.error("Error during logout:", error);
    } finally {
      navigation.navigate("Login");
    }
  };


  return (
    <View style={{ backgroundColor: '#fff', height: '100%' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>
          <TouchableOpacity>
            <Image
              alt=""
              source={{
                uri: `${selectedImage
                  ? selectedImage
                  : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80"
                  }`,
              }}
              style={styles.profileAvatar}
            />
          </TouchableOpacity>

          <Text style={styles.profileName}>
            {userInfo?.firstName || "Vui lòng bổ sung tên"}
          </Text>

          <Text style={styles.profileEmail}>
            {userInfo?.email || "Vui lòng bổ sung email"}
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditProfile", {
                userInfo,
              });
            }}
          >
            <View style={styles.profileAction}>
              <Text style={styles.profileActionText}>Chỉnh sửa thông tin</Text>
              <FeatherIcon color="#fff" name="edit" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            {/* <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{header}</Text>
            </View> */}
            <View style={styles.sectionBody}>
              {items.map(({ id, label, icon, type, value }, index) => {
                return (
                  <View
                    key={id}
                    style={[
                      styles.rowWrapper,
                      index === 0 && { borderTopWidth: 0 },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (id === "logout") {
                          handleLogout()
                        } else if (id === 'notify') {
                          navigation.navigate('Notification')
                        }
                      }}
                    >
                      <View style={styles.row}>
                        <FeatherIcon
                          color="#616161"
                          name={icon}
                          style={styles.rowIcon}
                          size={22}
                        />

                        <Text style={styles.rowLabel}>{label}</Text>

                        <View style={styles.rowSpacer} />

                        {type === "select" && (
                          <Text style={styles.rowValue}>{form[id]}</Text>
                        )}

                        {type === "toggle" && (
                          <Switch
                            onChange={(val) => setForm({ ...form, [id]: val })}
                            value={form[id]}
                          />
                        )}

                        {(type === "select" || type === "link") && (
                          <FeatherIcon
                            color="#ababab"
                            name="chevron-right"
                            size={22}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
        <View>
          <View style={{ alignItems: "center", marginTop: 70 }}>
            <Image source={require('../assets/images/logo.png')}
              style={{ width: 300, height: 200 }} />
          </View>
          <Text style={{ textAlign: 'center', color: 'gray', marginTop: -50 }}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  section: {
    borderWidth: 0.6,
    marginHorizontal: 10,
    borderRadius: 20,
    borderColor: '#ccc',
    marginVertical: 8,
    overflow: 'hidden'
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a7a7a7",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: {
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  profile: {
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#090909",
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "400",
    color: "#848484",
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 24,
    height: 50,
  },
  rowWrapper: {
    paddingLeft: 24,
    backgroundColor: "#fff",
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
  rowValue: {
    fontSize: 17,
    color: "#616161",
    marginRight: 4,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
