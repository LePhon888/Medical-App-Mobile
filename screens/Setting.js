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
const SECTIONS = [
  {
    header: "Cài đặt",
    items: [
      { id: "language", icon: "globe", label: "Ngôn ngữ", type: "select" },
      { id: "darkMode", icon: "moon", label: "Giao diện", type: "toggle" },
    ],
  },
  {
    header: "Giúp đỡ",
    items: [
      { id: "bug", icon: "flag", label: "Báo lỗi", type: "link" },
      { id: "contact", icon: "mail", label: "Liên hệ chúng tôi", type: "link" },
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

export default function Setting({ navigation }) {
  const [form, setForm] = useState({
    language: "Tiếng việt",
    darkMode: true,
    wifi: false,
  });
  const [user, dispatch] = useState(UserContext)
  const [userInfo, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getUserAndToken = async () => {
      try {
        const currentUser = await AsyncStorage.getItem("user");
        const tokenInfo = await AsyncStorage.getItem("token");
        setUser(JSON.parse(currentUser));
        setToken(tokenInfo)
        if (currentUser) {
          setSelectedImage(JSON.parse(currentUser).image);
        }

      } catch (error) {
        console.error(error);
      }
    };
    getUserAndToken();
  }, []);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;

        update(imageUri);
      }
    });
  };

  const update = async (imageUri) => {
    console.log(`Bearer ${token}`)
    try {
      const formData = new FormData();
      formData.append('user', { "string": JSON.stringify(userInfo), type: 'application/json' })
      formData.append('file', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' })

      const e = `${endpoints["user"]}/${userInfo.id}`;
      console.log(userInfo)

      console.log(formData)

      let res = await Apis.post(e, formData, {
        headers:
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status === 200) {
        setSelectedImage(imageUri);
      } else {
        console.log('Error updating user profile:', res.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#f6f6f6" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>

          <TouchableOpacity
            onPress={openImagePicker}
          >
            <Image
              alt=""
              source={{
                uri: selectedImage || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
              }}
              style={styles.profileAvatar}
            />
          </TouchableOpacity>


          <Text style={styles.profileName}>John Doe</Text>

          <Text style={styles.profileEmail}>john.doe@mail.com</Text>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{header}</Text>
            </View>
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
                          dispatch({
                            type: "logout",
                          });
                          navigation.navigate("Login");
                        } else {
                          // Handle other item actions
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  section: {
    paddingTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 24,
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
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
    backgroundColor: "#007bff",
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
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
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
