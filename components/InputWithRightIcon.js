import { memo, useState } from "react";
import { Text, TextInput, View } from "react-native";
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
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleIconPressed = () => {
        if (!onIconPressed) {
            onChangeText('')
        } else {
            onIconPressed()
        }
    }
    return (
        <View>
            <View style={[styles.flexRowCenter, styles.input, { borderColor: !valid ? COLORS.toastError : isFocused ? COLORS.toastInfo : '#ccc' }, { ...style }]}>
                <TextInput
                    secureTextEntry={secureTextEntry}
                    style={{ width: '90%' }}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={(text) => onChangeText(text)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    cursorColor={COLORS.toastInfo}
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
                <Text style={styles.error}>{errorMsg}</Text>
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