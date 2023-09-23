import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../constants/colors";
import { SelectList } from "react-native-dropdown-select-list";
import Button from "../components/Button";
const { width } = Dimensions.get("screen");
import { TouchableWithoutFeedback } from "react-native";

const MedicalRegister = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState("Nam");

  const [selected, setSelected] = React.useState("");
  const [value, setValue] = React.useState(0);

  const tabs = [
    { name: "1. Bệnh nhân" },
    { name: "2. Chọn thời gian" },
    { name: "3. Thanh toán" },
  ];
  const data = [
    { key: "1", value: "Mobiles", disabled: true },
    { key: "2", value: "Appliances" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers", disabled: true },
    { key: "5", value: "Vegetables" },
    { key: "6", value: "Diary Products" },
    { key: "7", value: "Drinks" },
  ];

  const handleNextStep = () => {
    if (value < tabs.length - 1) {
      setValue(value + 1);
    }
  };

  const handlePreviousStep = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View
        style={{
          backgroundColor: COLORS.primary,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: COLORS.white,
          }}
        >
          Đăng ký lịch hẹn với bác sĩ
        </Text>
      </View>
      <View style={styles.container}>
        {tabs.map((item, index) => {
          const isActive = index === value;

          return (
            <View style={{ flex: 1 }} key={item.name}>
              <TouchableWithoutFeedback disabled={true}>
                <View style={styles.item}>
                  <Text style={[styles.text, isActive && { color: "#6366f1" }]}>
                    {item.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: 26, marginTop: 16 }}
      >
        {value === 0 && (
          <View>
            <View style={{ marginBottom: 12, marginTop: 12 }}>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Nhập địa chỉ email (*)"
                  placeholderTextColor={COLORS.black}
                  keyboardType="email-address"
                  style={{
                    width: "100%",
                  }}
                />
              </View>
            </View>
            <View style={{ marginBottom: 12, marginTop: 12 }}>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Nhập mật khẩu (*)"
                  placeholderTextColor={COLORS.black}
                  style={{
                    width: "100%",
                  }}
                />
              </View>
            </View>
            <View style={{ marginBottom: 12, marginTop: 12 }}>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Nhập mật khẩu (*)"
                  placeholderTextColor={COLORS.black}
                  style={{
                    width: "100%",
                  }}
                />
              </View>
            </View>
            <View style={{ marginBottom: 12, marginTop: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedGender("Nam")}
                  style={{
                    flex: 1,
                    height: 48,
                    borderColor: COLORS.black,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      selectedGender === "Nam" ? COLORS.primary : COLORS.white, // Set background color based on selection
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedGender === "Nam" ? COLORS.white : COLORS.black,
                      marginLeft: 8,
                    }}
                  >
                    Nam
                  </Text>
                </TouchableOpacity>
                <View style={{ width: 10 }} /> {/* Add some spacing */}
                <TouchableOpacity
                  onPress={() => setSelectedGender("Nữ")}
                  style={{
                    flex: 1,
                    height: 48,
                    borderColor: COLORS.black,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      selectedGender === "Nữ" ? COLORS.primary : COLORS.white, // Set background color based on selection
                  }}
                >
                  {/* Use your custom icon for "Nữ" here */}
                  <Text
                    style={{
                      color:
                        selectedGender === "Nữ" ? COLORS.white : COLORS.black,
                      marginLeft: 8,
                    }}
                  >
                    Nữ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginBottom: 12, marginTop: 12 }}>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Nhập mật khẩu (*)"
                  placeholderTextColor={COLORS.black}
                  style={{
                    width: "100%",
                  }}
                />
              </View>
            </View>
            <View style={{ marginTop: 30 }}>
              <Text style={styles.label}>Chọn khoa khám</Text>
              <SelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                save="value"
                defaultOption={{ key: "a", value: "AA" }}
              />
            </View>
            <View style={{ marginTop: 14 }}>
              <Text style={styles.label}>Chọn bác sĩ</Text>
              <SelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                save="value"
                label="Chọn bác sĩ"
                defaultOption={{ key: "a", value: "AA" }}
              />
            </View>
            <View style={{ marginBottom: 12, marginTop: 24 }}>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Mô tả triệu chứng bệnh (*)"
                  placeholderTextColor={COLORS.black}
                  style={{
                    width: "100%",
                  }}
                  multiline={true}
                />
              </View>
            </View>
          </View>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {(value === 1 || value === 2) && (
            <Button
              title="Quay lại"
              filled
              style={{
                marginTop: 18,
                marginBottom: 4,
                width: "48%",
                marginRight: 6,
              }}
              onPress={() => handlePreviousStep()}
            />
          )}
          <Button
            title="Tiếp tục"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
              width: value === 0 ? "100%" : "48%",
            }}
            onPress={() => handleNextStep()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderColor: "#e5e7eb",
    borderBottomWidth: 2,
    position: "relative",
    overflow: "hidden",
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
});
export default MedicalRegister;
