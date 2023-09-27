import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import COLORS from "../constants/colors";
import { SelectList } from "react-native-dropdown-select-list";
import Button from "../components/Button";
const { width } = Dimensions.get("screen");
import { TouchableWithoutFeedback } from "react-native";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import Apis, { authApi, endpoints } from "../config/Apis";
import { UserContext } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MedicalRegister = ({ navigation }) => {
  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    "YYYY/MM/DD"
  );

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function compareTimes(time1, time2) {
    const minutes1 = timeToMinutes(time1);
    const minutes2 = timeToMinutes(time2);

    if (minutes1 < minutes2) {
      return -1;
    } else if (minutes1 > minutes2) {
      return 1;
    } else {
      return 0;
    }
  }
  function checkValidDateTime(hour) {
    if (compareTimes(hour.hour, getCurrentTime()) === -1) {
      return true;
    }
    return false;
  }

  function checkDateStatus(selectedDate) {
    const currentDate = getFormatedDate(new Date(), "YYYY/MM/DD");
    return compareDates(selectedDate, currentDate) === 0;
  }

  function compareDates(date1, date2) {
    const d1 = new Date(date1.replace(/\//g, "-"));
    const d2 = new Date(date2.replace(/\//g, "-"));

    if (d1 < d2) {
      return -1; // date1 is earlier
    } else if (d1 > d2) {
      return 1; // date1 is later
    } else {
      return 0; // date1 and date2 are the same
    }
  }

  function formatDateToDDMMYYYY(appointmentDate) {
    const dateObj = new Date(appointmentDate);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const [user, dispatch] = useContext(UserContext);
  const [selectedGender, setSelectedGender] = useState("Nam");
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(startDate);
  const [hours, setHours] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [reason, setReason] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [payment, setPayment] = useState(null);

  const handleOnPress = () => {
    setOpen(!open);
  };

  const handleChangeDate = (propDate) => {
    setDate(propDate);
  };

  const formatDate = (dateString) => {
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(dateString)) {
      return null; // Invalid date format
    }
    const formattedDateString = dateString.replace(/\//g, "-");

    const date = new Date(formattedDateString);

    if (isNaN(date.getTime())) {
      return null;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatYMD = (dateString) => {
    const formattedDateString = dateString.replace(/\//g, "-");
    const date = new Date(formattedDateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };
  const formatBirthday = (inputText) => {
    const [day, month, year] = inputText.split("-");

    const date = new Date(`${year}-${month}-${day}`);

    if (!isNaN(date)) {
      const formattedDate = date.toISOString().split("T")[0];
      return formattedDate;
    } else {
      return null;
    }
  };

  const tabs = [
    { name: "1. Bệnh nhân" },
    { name: "2. Chọn thời gian" },
    { name: "3. Thanh toán" },
  ];

  const handleNextStep = async () => {
    if (value < tabs.length - 1) {
      setValue(value + 1);
    }
    if (value === 1) {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      // { id: 2, hour: "08:15" }
      const id = JSON.parse(user).id;
      const info = {
        user: {
          firstName,
          birthday: formatBirthday(birthday),
          email,
          gender: selectedGender === "Nam" ? 0 : 1,
        },
        reason,
        date: formatYMD(date),
        registerUser: { id },
        doctorId: parseInt(selectedDoctor, 10),
        hour: selectedHour,
      };

      const userJson = info;
      try {
        const res = await Apis.post(endpoints["appointment"], userJson, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointment(res.data);
        // console.log("appointment " + res.data.id);
        const resPayment = await Apis.get(
          `${endpoints["payment"]}?orderInfo=${res.data.id}&amount=${res.data.fee.fee}`
        );
        setPayment(resPayment);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (value === 2) {
      Linking.openURL(payment.data.url)
        .then((data) => {
          // console.log("URL opened:", data);
        })
        .catch((error) => {
          console.error("URL open error:", error);
        });
    }
  };

  const handlePreviousStep = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  const handleInputChange = (text) => {
    setBirthday(text);
    const dateRegex =
      /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19\d{2}|200[0-4])$/; // Updated regex for dd-MM-yyyy format
    const isValidDate = dateRegex.test(text);

    if (!isValidDate) {
      setIsValid(false);
    } else {
      // Extract day, month, and year from the input
      const [day, month, year] = text.split("-").map(Number);

      // Additional checks for year, e.g., ensure the year is before 2005 and after 1900
      const currentYear = new Date().getFullYear();

      if (year < 1900 || year > 2004) {
        setIsValid(false);
      } else if (year === currentYear && month > new Date().getMonth() + 1) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  };

  const handleInputChangeEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    setIsValidEmail(emailRegex.test(text));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Apis.get(endpoints["hours"]);
        setHours(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Apis.get(endpoints["departments"]);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Apis.get(
          `${endpoints["doctors"]}?departmentId=${selectedDepartment}`
        );
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };
    fetchData();
  }, [selectedDepartment]);
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
                  <Text
                    style={[
                      styles.text,
                      isActive ? { color: "#6366f1" } : null,
                    ]}
                  >
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
        {value === 0 ? (
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
                  paddingLeft: 16,
                }}
              >
                <TextInput
                  placeholder="Nhập họ và tên (*)"
                  placeholderTextColor={COLORS.black}
                  keyboardType="default"
                  style={{
                    width: "100%",
                  }}
                  onChangeText={(text) => setFirstName(text)}
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
                  paddingLeft: 16,
                }}
              >
                <TextInput
                  placeholder="Nhập ngày sinh (*)"
                  placeholderTextColor={COLORS.black}
                  keyboardType="default"
                  style={{
                    width: "100%",
                  }}
                  onChangeText={(text) => handleInputChange(text)}
                />
              </View>
              {!isValid ? (
                <Text style={{ color: "red" }}>
                  Ngày sinh phải theo định dạng dd-MM-yyyy hoặc ngày sinh sai
                </Text>
              ) : null}
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
                  paddingLeft: 16,
                }}
              >
                <TextInput
                  placeholder="Nhập email (*)"
                  placeholderTextColor={COLORS.black}
                  style={{
                    width: "100%",
                  }}
                  keyboardType="email-address"
                  onChangeText={(text) => handleInputChangeEmail(text)}
                />
              </View>
              {!isValidEmail ? (
                <Text style={{ color: "red" }}>Email không hợp lệ</Text>
              ) : null}
            </View>
            <View style={{ marginBottom: 12, marginTop: 12 }}>
              <Text style={styles.label}>Chọn giới tính *</Text>
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
                    height: 44,
                    borderColor: COLORS.black,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      selectedGender === "Nam" ? COLORS.primary : COLORS.white,
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
                <View style={{ width: 10 }} />
                <TouchableOpacity
                  onPress={() => setSelectedGender("Nữ")}
                  style={{
                    flex: 1,
                    width: "46%",
                    height: 44,
                    borderColor: COLORS.black,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      selectedGender === "Nữ" ? COLORS.primary : COLORS.white,
                  }}
                >
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
            <View style={{ marginTop: 30 }}>
              <Text style={styles.label}>Chọn khoa khám * </Text>
              <SelectList
                setSelected={(val) => setSelectedDepartment(val)}
                data={departments.map((department) => ({
                  key: department.id.toString(),
                  value: department.name,
                }))}
                save="object"
                defaultOption={{ key: "1", value: "Khoa khám" }}
              />
            </View>
            <View style={{ marginTop: 14 }}>
              <Text style={styles.label}>Chọn bác sĩ *</Text>
              {Array.isArray(doctors) && doctors.length > 0 && (
                <SelectList
                  setSelected={(val) => setSelectedDoctor(val)}
                  data={doctors.map((doctor) => ({
                    key: doctor.id.toString(),
                    value: doctor.user.firstName + " " + doctor.user.lastName,
                  }))}
                  save="object"
                  label="Chọn bác sĩ"
                  defaultOption={{ key: "a", value: "Bác sĩ khám" }}
                />
              )}
            </View>
            <View style={{ marginBottom: 12, marginTop: 24 }}>
              <View
                style={{
                  width: "100%",
                  height: 80,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 16,
                  paddingTop: 0,
                }}
              >
                <TextInput
                  placeholder="Mô tả triệu chứng bệnh (*)"
                  placeholderTextColor={COLORS.black}
                  style={{
                    width: "100%",
                    height: "80%",
                  }}
                  multiline={true}
                  onChangeText={(text) => setReason(text)}
                />
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )}
        {value === 1 ? (
          <View>
            <TouchableOpacity
              onPress={handleOnPress}
              style={{
                flex: 1,
                height: 40,
                borderColor: COLORS.grey,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: COLORS.black,
                  marginLeft: 8,
                }}
              >
                Chọn ngày tư vấn: <Text>{formatDate(date)}</Text>
              </Text>
            </TouchableOpacity>
            <Modal animationType="slide" transparent={true} visible={open}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DatePicker
                    mode="calendar"
                    selected={date}
                    minimumDate={startDate}
                    onDateChange={(selectedDate) =>
                      handleChangeDate(selectedDate)
                    }
                  />
                  <TouchableOpacity
                    onPress={handleOnPress}
                    style={{
                      flex: 1,
                      height: 48,
                      borderColor: COLORS.grey,
                      borderWidth: 1,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        height: 20,
                      }}
                    >
                      Đóng
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Text
              style={{
                color: COLORS.black,
                marginBottom: 10,
                marginTop: 18,
              }}
            >
              Chọn giờ tư vấn:
              <Text> {selectedHour ? selectedHour.hour : null}</Text>
            </Text>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {hours.map((h) => (
                <TouchableOpacity
                  key={h.id}
                  style={{
                    height: 48,
                    width: "18%",
                    borderColor: COLORS.grey,
                    borderWidth: 1,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 6,
                    marginRight: 6,
                    marginBottom: 6,
                    backgroundColor:
                      checkValidDateTime(h) && checkDateStatus(date)
                        ? "#ccc"
                        : selectedHour != null && selectedHour.id === h.id
                        ? COLORS.primary
                        : COLORS.white,
                  }}
                  onPress={() => {
                    if (!checkDateStatus(date) || !checkValidDateTime(h)) {
                      setSelectedHour(h);
                    }
                  }}
                >
                  <Text
                    style={{
                      color:
                        checkValidDateTime(h) && checkDateStatus(date)
                          ? COLORS.black
                          : selectedHour != null && selectedHour.id === h.id
                          ? COLORS.white
                          : COLORS.black,
                    }}
                  >
                    {h.hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View></View>
        )}
        {appointment && value === 2 ? (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Thông tin cuộc hẹn:</Text>
            <Text>Bác sĩ: {appointment.doctor.user.firstName}</Text>
            <Text>Ngày hẹn: {formatDateToDDMMYYYY(appointment.date)}</Text>
            <Text>Giờ hẹn: {appointment.hour.hour}</Text>
            <Text>Bệnh nhân: {appointment.user.firstName}</Text>
            <Text></Text>
            <Text>Chúng tôi sẽ gửi mã phòng qua email của bạn.</Text>
            <Text></Text>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {value === 1 || value === 2 ? (
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
          ) : null}
          <Button
            title={
              value === 0 ? "Tiếp tục" : value === 1 ? "Đăng ký" : "Thanh toán"
            }
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
export default MedicalRegister;
