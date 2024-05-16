import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import Apis, { endpoints } from "../config/Apis";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import HeaderWithBackButton from "../common/HeaderWithBackButton";

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
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState(null);

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
        const resCheckEmail = await Apis.get(endpoints.checkEmail + '?email=' + email);

        if (resCheckEmail.data === false) {
          Toast.show({ type: "error", text1: "Email đã được đăng ký tài khoản khác" });
          setLoading(false);
          return;
        }
        else {
          const res = await Apis.post(endpoints["signup"], {
            firstName,
            lastName,
            email,
            password,
          });
          setLoading(false);
          setNotification(true);
          setVerify(true);
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
        console.error(error);
      }
    };
    signUp();
  };

  const handleVerify = () => {
    const verifyAccount = async () => {
      try {
        setLoading(true);

        const res = await Apis.post(endpoints.verify, {
          email,
          code
        });
        setLoading(false);

        if (res.status === 200) {
          Toast.show({
            type: "success",
            text1: "Đăng ký thành công",
            text2: "Chuyển hướng đến trang đăng nhập",
          });
          setCode(null);
          setVerify(false);
          navigation.navigate("Login");
        }
      } catch (error) {
        Toast.show({ type: "error", text1: "Mã xác thực không hợp lệ" });
        console.error(error);
      }
    };
    verifyAccount();
  }

  const handleReSend = () => {
    const resend = async () => {
      try {
        setLoading(true);
        const res = await Apis.get(endpoints.resendCode + '?email=' + email);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    resend();
  }

  if (verify)
    return (
      <View style={{ flex: 1, paddingHorizontal: 22, backgroundColor: '#fff' }}>
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
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
              fontWeight: '600'
            }}
            onChangeText={(text) => setCode(text)}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text
            style={{
              fontSize: 16,
              color: '#656565',
              textAlign: 'center',
            }}
          >
            Mã xác thực được gửi qua email
          </Text>
          <TouchableOpacity onPress={() => handleReSend()} style={{ marginTop: 1, marginLeft: 5 }}>
            <Text style={{ color: COLORS.primary, fontWeight: '500', fontSize: 15 }}>Gửi lại</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Xác nhận"
          filled
          style={{
            marginTop: 18,
            marginBottom: 20,
          }}
          onPress={() => handleVerify()}
        />
      </View>
    );
  else
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ flex: 1, marginHorizontal: 22 }}>
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
                {isPasswordShown ? (
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
                {isConfirmPasswordShown ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
                ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginVertical: 6 }}>
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

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {error && (
              <Text
                style={{
                  color: COLORS.red,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: COLORS.grey,
                marginHorizontal: 10,
              }}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
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
          {notification && (
            <View>
              <Text style={{ flex: 1, justifyContent: "center" }}>
                Đăng ký thành công
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );

  // if (verify)
  //   return <> <View style={{ flex: 1, marginHorizontal: 22 }}>
  //     <View style={{ marginVertical: 22 }}>
  //       <Text
  //         style={{
  //           fontSize: 22,
  //           fontWeight: 600,
  //           color: COLORS.black,
  //         }}
  //       >
  //         Xác thực tài khoản
  //       </Text>
  //     </View>

  //     <View
  //       style={{
  //         width: "100%",
  //         height: 60,
  //         borderColor: COLORS.grey,
  //         borderWidth: 0.5,
  //         borderRadius: 8,
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <TextInput
  //         placeholder="XXX-XXX"
  //         placeholderTextColor={'#ccc'}
  //         keyboardType="numeric"
  //         maxLength={6}
  //         style={{
  //           width: "100%",
  //           textAlign: 'center',
  //           fontSize: 33,
  //           color: COLORS.textLabel,
  //           fontWeight: 600
  //         }}
  //         onChangeText={(text) => setCode(text)}
  //       />
  //     </View>
  //     <View style={{ flexDirection: 'row', marginTop: 10 }}>
  //       <Text
  //         style={{
  //           fontSize: 16,
  //           color: '#656565',
  //           textAlign: 'center',
  //         }}
  //       >
  //         Mã xác thực được gửi qua email
  //       </Text>
  //       <TouchableOpacity onPress={() => handleReSend()}
  //         style={{ marginTop: 1, marginLeft: 5 }}
  //       ><Text style={{ color: COLORS.primary, fontWeight: 500, fontSize: 15 }}>Gửi lại</Text>
  //       </TouchableOpacity>
  //     </View>

  //     <Button
  //       title="Xác nhận"
  //       filled
  //       style={{
  //         marginTop: 18,
  //         marginBottom: 20,
  //       }}
  //       onPress={() => handleVerify()}
  //     />
  //   </View></>
  // else
  //   return (
  //     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
  //       {/* {verify ? <>

  //       </> : 
  //       } */}
  //       <View style={{ flex: 1, marginHorizontal: 22 }}>
  //         <View style={{ marginVertical: 22 }}>
  //           <Text
  //             style={{
  //               fontSize: 22,
  //               fontWeight: "bold",
  //               color: COLORS.black,
  //             }}
  //           >
  //             Đăng ký tài khoản
  //           </Text>
  //         </View>

  //         <View style={{ marginBottom: 26 }}>
  //           <View
  //             style={{
  //               width: "100%",
  //               height: 48,
  //               borderColor: COLORS.grey,
  //               borderWidth: 0.5,
  //               borderRadius: 8,
  //               alignItems: "center",
  //               justifyContent: "center",
  //               paddingLeft: 22,
  //             }}
  //           >
  //             <TextInput
  //               placeholder="Nhập tên của bạn"
  //               placeholderTextColor={COLORS.black}
  //               keyboardType="default"
  //               style={{
  //                 width: "100%",
  //               }}
  //               onChangeText={(text) => setFirstName(text)}
  //             />
  //           </View>
  //         </View>

  //         <View style={{ marginBottom: 26 }}>
  //           <View
  //             style={{
  //               width: "100%",
  //               height: 48,
  //               borderColor: COLORS.grey,
  //               borderWidth: 0.5,
  //               borderRadius: 8,
  //               alignItems: "center",
  //               justifyContent: "center",
  //               paddingLeft: 22,
  //             }}
  //           >
  //             <TextInput
  //               placeholder="Nhập họ và tên lót của bạn"
  //               placeholderTextColor={COLORS.black}
  //               keyboardType="default"
  //               style={{
  //                 width: "100%",
  //               }}
  //               onChangeText={(text) => setLastName(text)}
  //             />
  //           </View>
  //         </View>

  //         <View style={{ marginBottom: 26 }}>
  //           <View
  //             style={{
  //               width: "100%",
  //               height: 48,
  //               borderColor: COLORS.grey,
  //               borderWidth: 0.5,
  //               borderRadius: 8,
  //               alignItems: "center",
  //               justifyContent: "center",
  //               paddingLeft: 22,
  //             }}
  //           >
  //             <TextInput
  //               placeholder="Nhập địa chỉ email của bạn"
  //               placeholderTextColor={COLORS.black}
  //               keyboardType="email-address"
  //               style={{
  //                 width: "100%",
  //               }}
  //               onChangeText={(text) => setEmail(text)}
  //             />
  //           </View>
  //         </View>

  //         <View style={{ marginBottom: 26 }}>

  //           <View
  //             style={{
  //               width: "100%",
  //               height: 48,
  //               borderColor: COLORS.grey,
  //               borderWidth: 0.5,
  //               borderRadius: 8,
  //               alignItems: "center",
  //               justifyContent: "center",
  //               paddingLeft: 22,
  //             }}
  //           >
  //             <TextInput
  //               placeholder="Nhập mật khẩu"
  //               placeholderTextColor={COLORS.black}
  //               secureTextEntry={isPasswordShown}
  //               style={{
  //                 width: "100%",
  //               }}
  //               onChangeText={(text) => setPassword(text)}
  //             />

  //             <TouchableOpacity
  //               onPress={() => setIsPasswordShown(!isPasswordShown)}
  //               style={{
  //                 position: "absolute",
  //                 right: 12,
  //               }}
  //             >
  //               {isPasswordShown == true ? (
  //                 <Ionicons name="eye-off" size={24} color={COLORS.black} />
  //               ) : (
  //                 <Ionicons name="eye" size={24} color={COLORS.black} />
  //               )}
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //         <View style={{ marginBottom: 26 }}>
  //           <View
  //             style={{
  //               width: "100%",
  //               height: 48,
  //               borderColor: COLORS.grey,
  //               borderWidth: 0.5,
  //               borderRadius: 8,
  //               alignItems: "center",
  //               justifyContent: "center",
  //               paddingLeft: 22,
  //             }}
  //           >
  //             <TextInput
  //               placeholder="Nhập lại mật khẩu"
  //               placeholderTextColor={COLORS.black}
  //               secureTextEntry={isConfirmPasswordShown}
  //               style={{
  //                 width: "100%",
  //               }}
  //               onChangeText={(text) => setConfirmPassword(text)}
  //             />

  //             <TouchableOpacity
  //               onPress={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
  //               style={{
  //                 position: "absolute",
  //                 right: 12,
  //               }}
  //             >
  //               {isPasswordShown == true ? (
  //                 <Ionicons name="eye-off" size={24} color={COLORS.black} />
  //               ) : (
  //                 <Ionicons name="eye" size={24} color={COLORS.black} />
  //               )}
  //             </TouchableOpacity>
  //           </View>
  //         </View>

  //         <View
  //           style={{
  //             flexDirection: "row",
  //             marginVertical: 6,
  //           }}
  //         >
  //           <Checkbox
  //             style={{ marginRight: 8 }}
  //             value={isChecked}
  //             onValueChange={setIsChecked}
  //             color={isChecked ? COLORS.primary : undefined}
  //           />

  //           <Text>Tôi đồng ý với các điều khoản dịch vụ</Text>
  //         </View>

  //         <Button
  //           title="Đăng ký"
  //           filled
  //           style={{
  //             marginTop: 18,
  //             marginBottom: 20,
  //           }}
  //           onPress={() => handleSignUp()}
  //         />
  //         <View
  //           style={{ justifyContent: "center", alignItems: "center" }}
  //         >
  //           {error && (
  //             <Text
  //               style={{
  //                 color: COLORS.red,
  //                 textAlign: "center",
  //               }}
  //             >
  //               {error}
  //             </Text>
  //           )}
  //         </View>
  //         <View
  //           style={{
  //             flexDirection: "row",
  //             alignItems: "center",
  //             marginVertical: 10,
  //           }}
  //         >
  //           <View
  //             style={{
  //               flex: 1,
  //               height: 1,
  //               backgroundColor: COLORS.grey,
  //               marginHorizontal: 10,
  //             }}
  //           />
  //         </View>

  //         <View
  //           style={{
  //             flexDirection: "row",
  //             justifyContent: "center",
  //             marginTop: 10
  //           }}
  //         >
  //           <Text style={{ fontSize: 16, color: COLORS.black }}>
  //             Đã có tài khoản
  //           </Text>
  //           <Pressable onPress={() => navigation.navigate("Login")}>
  //             <Text
  //               style={{
  //                 fontSize: 16,
  //                 color: COLORS.primary,
  //                 fontWeight: "bold",
  //                 marginLeft: 6,
  //               }}
  //             >
  //               Đăng nhập
  //             </Text>
  //           </Pressable>
  //         </View>
  //         {loading && <ActivityIndicator size="small" color={COLORS.primary} />}

  //         {loading == false && (
  //           <View>
  //             {notification == true && (
  //               <Text style={{ flex: 1, justifyContent: "center" }}>
  //                 Đăng ký thành công
  //               </Text>
  //             )}
  //           </View>
  //         )}
  //       </View>
  //     </SafeAreaView>
  //   );
};

export default Signup;
