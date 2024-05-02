import {
    View,
    Text,
    Image,
    Pressable,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import Apis, { authApi, endpoints } from "../config/Apis";
import { UserContext } from "../App";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { getUserFromStorage } from "../utils/GetUserFromStorage";
import { useUser } from "../context/UserContext";
import Loading from "../components/Loading";

const Login = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState();
    const [user, dispatch] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const { userId, storeUserId } = useUser()

    const login = () => {
        const processLogin = async () => {
            try {
                setIsLoading(true);
                setError(null);
                let res = await Apis.post(endpoints["login"], { 'email': email, 'password': password });
                if (res && res.data && res.data.accessToken && res.data.refreshToken) {
                    await AsyncStorage.setItem("accessToken", res.data.accessToken);
                    await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
                    await AsyncStorage.setItem("expiredDateRefreshToken", res.data.expiredDateRefreshToken);
                    await AsyncStorage.setItem("expiredDateAccessToken", res.data.expiredDateAccessToken);
                } else {
                    console.error("Access token or refresh token is missing or undefined");
                    // Handle the error or display a message to the user
                }

                let { data } = await axios.get(endpoints["currentUser"], {
                    headers: {
                        Authorization: `Bearer ${res.data.accessToken}`,
                    },
                });
                storeUserId(data.id)

                await AsyncStorage.setItem("user", JSON.stringify(data));
                dispatch({ type: "login", payload: data, });

                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    if (navigation)
                        navigation.navigate('MainScreen');
                }

            } catch (error) {
                console.error("Login error:", error);
                setError("Không tìm thấy tài khoản hoặc chưa xác thực email");
            } finally {
                setIsLoading(false);
            }
        };
        processLogin();
    };

    const handleLoginGoogle = async () => {
        try {
            await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            let res = await Apis.post(endpoints["googleLogin"], userInfo);
            if (res && res.data && res.data.accessToken && res.data.refreshToken) {
                await AsyncStorage.setItem("accessToken", res.data.accessToken);
                await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
                await AsyncStorage.setItem("expiredDateRefreshToken", res.data.expiredDateRefreshToken);
                await AsyncStorage.setItem("expiredDateAccessToken", res.data.expiredDateAccessToken);
            } else {
                console.error("Access token or refresh token is missing or undefined");
                // Handle the error or display a message to the user
            }
            const token = res.data.accessToken;
            let { data } = await axios.get(endpoints["currentUser"], {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await AsyncStorage.setItem("user", JSON.stringify(data));
            storeUserId(data.id)

            dispatch({
                type: "login",
                payload: userInfo,
            });

            const userData = await AsyncStorage.getItem("user");
            if (userData) navigation.navigate('MainScreen');
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("Google Sign-In Cancelled");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log("Google Sign-In in Progress");
            } else {
                console.error("Google Sign-In Error:", error);
            }
        }
    };

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                "30139582015-5ftl3a00g106h5pjbj8jr64jucnk038g.apps.googleusercontent.com",
        });

    }, []);

    useEffect(() => {
        const loadStoredCredentials = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                const storedPassword = await AsyncStorage.getItem("password");
                const userInfo = await getUserFromStorage()

                if (storedEmail) {
                    setEmail(storedEmail);
                }
                if (storedPassword) {
                    setPassword(storedPassword);
                }

                if (userInfo) {
                    setUserInfo(userInfo)
                    storeUserId(userInfo.id)
                    navigation.navigate('MainScreen');
                }

            } catch (error) {
                console.error("Error loading stored credentials:", error);
            }
        };

        loadStoredCredentials();
    }, []);

    const navigateToForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/images/logo.png')} style={{ width: 300, height: 300 }} />
                </View>
                <View style={{ marginBottom: 24 }}>
                    <View
                        style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 0.3,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 18,
                        }}
                    >
                        <TextInput
                            placeholder="Nhập địa chỉ email"
                            placeholderTextColor={COLORS.black}
                            keyboardType="email-address"
                            style={{
                                width: "100%"
                            }}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <View
                        style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 0.3,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 18,
                        }}
                    >
                        <TextInput
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%",
                            }}
                            value={password}
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

                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={navigateToForgotPassword}>
                    <Text>{'Quên mật khẩu'}</Text>
                </TouchableOpacity>

                <Button
                    title="Đăng nhập"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={() => login()}
                />
                {error && (
                    <Text
                        style={{
                            color: COLORS.red,
                            marginBottom: 10,
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </Text>
                )}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 20,
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
                    <Text style={{ fontSize: 14 }}>Hoặc đăng nhập với</Text>
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
                    }}
                >
                    <TouchableOpacity
                        onPress={() => handleLoginGoogle()}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            height: 52,
                            borderWidth: 0.5,
                            borderColor: '#ccc',
                            marginRight: 4,
                            borderRadius: 10,
                        }}
                    >
                        <Image
                            source={require("../assets/google.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8,
                            }}
                            resizeMode="contain"
                        />

                        <Text>Google</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: 22,
                    }}
                >
                    <Text style={{ fontSize: 16, color: COLORS.black }}>
                        Bạn chưa có tài khoản{" "}
                    </Text>
                    <Pressable onPress={() => navigation.navigate("Signup")}>
                        <Text
                            style={{
                                fontSize: 16,
                                color: COLORS.primary,
                                fontWeight: "bold",
                                marginLeft: 2,
                            }}
                        >
                            Đăng ký
                        </Text>
                    </Pressable>
                </View>
            </View>
            {isLoading && <Loading transparent={true} />}

        </SafeAreaView>
    );
};

export default Login;