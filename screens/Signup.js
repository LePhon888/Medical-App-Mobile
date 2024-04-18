import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import Apis, { endpoints } from "../config/Apis";
import { ActivityIndicator } from "react-native";

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verify, setVerify] = useState(true);
  const handleSignUp = () => {
    const signUp = async () => {
      setError(null);

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
      }

      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      if (!emailPattern.test(email)) {
        setError("Email không hợp lệ.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Mật khẩu và xác nhận mật khẩu không khớp.");
        return;
      }

      if (!isChecked) {
        setError("Vui lòng đồng ý với điều khoản dịch vụ.");
        return;
      }
      try {
        setLoading(true);
        const res = await Apis.post(endpoints["signup"], {
          firstName,
          lastName,
          email,
          password,
        });
        setLoading(false);
        if (res.status === 201) {
          setNotification(true);
          setVerify(true);
          navigation.navigate("Login");
        } else setError("Error");
      } catch (error) {
        console.log(error);
      }
    };
    signUp();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {verify ? <>
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginVertical: 22 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: COLORS.black,
              }}
            >
              Xác thực tài khoản
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              height: 60,
              borderColor: COLORS.grey,
              borderWidth: 0.5,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              placeholder="XXX-XXX"
              placeholderTextColor={'#ccc'}
              keyboardType="numeric"
              maxLength={6}
              style={{
                width: "100%",
                textAlign: 'center',
                fontSize: 33,
                color: COLORS.textLabel,
              }}
              onChangeText={(text) => {
                setLastName(text);
              }} />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#656565',
                textAlign: 'center',
              }}
            >
              Chưa nhận được mã xác thực?
            </Text>
            <Pressable onPress={() => setVerify(false)}
              style={{ marginTop: 1, marginLeft: 5 }}
            ><Text style={{ color: COLORS.primary, fontWeight: 500, fontSize: 15 }}>Gửi lại</Text>
            </Pressable>
          </View>

          <Button
            title="Xác nhận"
            filled
            style={{
              marginTop: 18,
              marginBottom: 20,
            }}
            onPress={() => handleSignUp()}
          />
        </View>
      </> : <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: COLORS.black,
            }}
          >
            Đăng ký tài khoản
          </Text>
        </View>

        <View style={{ marginBottom: 26 }}>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.grey,
              borderWidth: 0.5,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Nhập tên của bạn"
              placeholderTextColor={COLORS.black}
              keyboardType="default"
              style={{
                width: "100%",
              }}
              onChangeText={(text) => setFirstName(text)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 26 }}>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.grey,
              borderWidth: 0.5,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Nhập họ và tên lót của bạn"
              placeholderTextColor={COLORS.black}
              keyboardType="default"
              style={{
                width: "100%",
              }}
              onChangeText={(text) => setLastName(text)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 26 }}>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.grey,
              borderWidth: 0.5,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Nhập địa chỉ email của bạn"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 26 }}>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.grey,
              borderWidth: 0.5,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Nhập mật khẩu"
              placeholderTextColor={COLORS.black}
              secureTextEntry={isPasswordShown}
              style={{
                width: "100%",
              }}
              onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 26 }}>
          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.grey,
              borderWidth: 0.5,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={COLORS.black}
              secureTextEntry={isConfirmPasswordShown}
              style={{
                width: "100%",
              }}
              onChangeText={(text) => setConfirmPassword(text)}
            />

            <TouchableOpacity
              onPress={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
          }}
        >
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : undefined}
          />

          <Text>Tôi đồng ý với các điều khoản dịch vụ</Text>
        </View>

        <Button
          title="Đăng ký"
          filled
          style={{
            marginTop: 18,
            marginBottom: 20,
          }}
          onPress={() => handleSignUp()}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.black }}>
            Đã có tài khoản
          </Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Đăng nhập
            </Text>
          </Pressable>
        </View>
        {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {error && (
            <Text
              style={{
                color: COLORS.red,
                marginBottom: 200,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
          )}
        </View>
        {loading == false && (
          <View>
            {notification == true && (
              <Text style={{ flex: 1, justifyContent: "center" }}>
                Đăng ký thành công
              </Text>
            )}
          </View>
        )}
      </View>}
    </SafeAreaView>
  );
};

export default Signup;
