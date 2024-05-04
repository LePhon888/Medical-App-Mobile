import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import COLORS from "../constants/colors";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "react-native";
import moment from "moment";
import { RadioButton } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import Apis, { endpoints } from "../config/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeatherIcon from "react-native-vector-icons/Feather";
import HeaderWithBackButton from "../common/HeaderWithBackButton";
import Button from "../components/Button";
import getNewAccessToken from "../utils/getNewAccessToken";

const EditProfile = ({ route, navigation }) => {
    const [user, setUser] = useState(route.params.userInfo);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [avatar, setAvatar] = useState(user.image);
    const [error, setError] = useState(null);

    const userFields = [
        { field: "firstName", label: "Họ", type: "text" },
        { field: "lastName", label: "Tên", type: "text" },
        { field: "birthday", label: "Ngày sinh", type: "date" },
        {
            field: "gender",
            label: "Giới tính",
            type: "select",
            options: ["Nam", "Nữ"],
        },
        { field: "address", label: "Địa chỉ", type: "text" },
        { field: "password", label: "Mật khẩu", type: "text" },
        { field: "phoneNumber", label: "Số điện thoại", type: "text" },
    ];

    const handleInputChange = (field, value) => {
        setUser({
            ...user,
            [field]: value,
        });
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        handleInputChange("birthday", moment(selectedDate).format("YYYY-MM-DD"));
    };

    const openImagePicker = () => {
        const options = {
            mediaType: "photo",
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("Image picker error: ", response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setAvatar(imageUri);
            }
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        await getNewAccessToken();

        formData.append("user", {
            string: JSON.stringify(user),
            type: "application/json",
        });

        if (avatar !== user.image) {
            formData.append("file", {
                uri: avatar,
                name: "image.jpg",
                type: "image/jpeg",
            });
        }

        try {
            const e = `${endpoints["user"]}/`;
            const token = await AsyncStorage.getItem("accessToken");
            let res = await Apis.post(e, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200) {
                const updatedUser = { ...user };
                if (avatar !== user.image) {
                    updatedUser.image = avatar;
                }
                await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
                navigation.goBack();
            }
        } catch (error) {
            console.log(error);
            Toast.show("Có lỗi xảy ra, vui lòng thử lại sau", Toast.LONG);
            if (error.response && error.response.status === 400)
                setError(error.response.data);
            else setError("Vui lòng chọn ảnh có kích thước nhỏ");
        }
    };

    const Header = () => {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FeatherIcon color="white" name="chevron-left" size={20} />
                </TouchableOpacity>
                <Text style={styles.titleText}>Chỉnh sửa thông tin</Text>
            </View>
        );
    };

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <HeaderWithBackButton />
            {user && (
                <ScrollView style={styles.formContainer}>
                    <TouchableOpacity
                        style={styles.imageContainer}
                        onPress={openImagePicker}
                    >
                        <Image
                            alt=""
                            source={{
                                uri:
                                    avatar ||
                                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
                            }}
                            style={styles.profileAvatar}
                        />
                    </TouchableOpacity>
                    {userFields.map((fieldInfo) => {
                        const { field, label, type, options } = fieldInfo;
                        return (
                            <View key={field} style={styles.fieldContainer}>
                                <Text style={styles.label}>{label}:</Text>
                                {type === "text" ? (
                                    <TextInput
                                        style={styles.input}
                                        value={user[field] || ""}
                                        onChangeText={(text) => handleInputChange(field, text)}
                                        secureTextEntry={field === "password" && true}
                                        placeholder={`Nhập ${label.toLocaleLowerCase()}....`}
                                    />
                                ) : type === "date" ? (
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                        <TextInput
                                            style={styles.input}
                                            value={moment(user[field]).format("DD/MM/YYYY") || ""}
                                            placeholder={`Nhập ${label.toLocaleLowerCase()}....`}
                                            onChangeText={(text) => handleInputChange(field, text)}
                                            editable={false}
                                        />
                                    </TouchableOpacity>
                                ) : type === "select" ? (
                                    <RadioButton.Group
                                        onValueChange={(value) => handleInputChange(field, value)}
                                        value={user[field]}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <RadioButton.Item
                                                label="Nam"
                                                value={0}
                                                status={user[field] === 0 ? "checked" : "unchecked"}
                                            />
                                            <RadioButton.Item
                                                label="Nữ"
                                                value={1}
                                                status={user[field] === 1 ? "checked" : "unchecked"}
                                            />
                                        </View>
                                    </RadioButton.Group>
                                ) : null}
                            </View>
                        );
                    })}

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

                    <View style={styles.buttonContainer}>
                        <Button title="Cập nhật" filled onPress={handleSubmit} />
                    </View>

                </ScrollView>
            )}

            {showDatePicker && (
                <RNDateTimePicker value={new Date()} onChange={handleDateChange} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    titleText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
    },
    formContainer: {
        padding: 20,
    },
    fieldContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        padding: 8,
        fontSize: 16,
        marginTop: 5,
        color: "black",
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    buttonContainer: {
        marginBottom: 40,
        color: "#007bff",
    },
});

export default EditProfile;
