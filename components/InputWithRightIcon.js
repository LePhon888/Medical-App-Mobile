import { memo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import COLORS from "../constants/colors";
import { text } from "@fortawesome/fontawesome-svg-core";

const InputWithRightIcon = ({
    placeholder,
    value,
    onChangeText,
    style,
    secureTextEntry = false,
    onIconPressed,
    iconName = 'x-circle',
    iconVisible = true,
    valid = true,
    errorMsg = '',
    textStyle,
    errorMsgStyle,
    editable = true,
    onPress,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleIconPressed = () => {
        if (!onIconPressed) {
            onChangeText('')
        } else {
            onIconPressed()
        }
    }

    const handleOnPress = () => {
        if (onPress) {
            onPress()
        }
    }

    return (
        <View onTouchEndCapture={handleOnPress}>
            <View style={[styles.flexRowCenter, styles.input, { borderColor: !valid ? COLORS.toastError : isFocused ? COLORS.toastInfo : '#ccc' }, { ...style }]}>
                <TextInput
                    secureTextEntry={secureTextEntry}
                    style={{ width: '90%', color: COLORS.black, ...textStyle }}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={(text) => onChangeText(text)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    cursorColor={COLORS.toastInfo}
                    editable={editable}
                />
                {iconVisible &&
                    <Feather
                        style={{ color: COLORS.textLabel, marginLeft: 'auto' }}
                        name={iconName}
                        onPress={handleIconPressed}
                        size={24} />
                }
            </View>
            {!valid && errorMsg != '' &&
                <Text style={[styles.error, { ...errorMsgStyle }]}>{errorMsg}</Text>
            }
        </View>

    );
};

const styles = StyleSheet.create({
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 16,
        marginTop: 10,
        backgroundColor: "white",
        height: 48,
    },
    label: {
        color: COLORS.textLabel,
        fontSize: 14,
        fontWeight: "bold"
    },
    error: {
        color: COLORS.toastError, fontSize: 12, marginTop: 8
    }
})

export default memo(InputWithRightIcon)