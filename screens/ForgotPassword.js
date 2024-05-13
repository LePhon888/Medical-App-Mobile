import { Animated, Clipboard, Image, Keyboard, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import HeaderWithBackButton from "../common/HeaderWithBackButton"
import COLORS from "../constants/colors"
import { text } from "@fortawesome/fontawesome-svg-core"
import InputWithRightIcon from "../components/InputWithRightIcon"
import { useEffect, useRef, useState } from "react"
import Button from "../components/Button"
import Apis, { endpoints } from "../config/Apis"
import Toast from "react-native-toast-message"
import { isNumber } from "lodash"
import Loading from "../components/Loading"

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const otpRef = useRef([]);
    const [otpCurrent, setOtpCurrent] = useState(0)
    const [otpValid, setOtpValid] = useState(false)
    const [cooldown, setCooldown] = useState(0);
    const [loading, setLoading] = useState(false)
    const scrollViewRef = useRef(null)
    const [placeHolder, setPlaceHoler] = useState('Quay lại đăng nhập')

    const [validation, setValidation] = useState({
        valid: true,
        message: ''
    })
    const step = {
        sendEmail: 1,
        validateOtp: 2,
        changePassword: 3
    }
    const [currentStep, setCurrentStep] = useState(step["sendEmail"])
    const [password, setPassword] = useState({
        newPassword: '',
        newPasswordSecure: true,
        newPasswordValid: true,
        newPasswordErrorMsg: '',
        confirmPassword: '',
        confirmPasswordSecure: true,
        confirmPasswordValid: true,
        confirmPasswordErrorMsg: '',
    })

    const onChangePassword = (field, value) => {
        setPassword(prev => ({ ...prev, [field]: value }));

        if (field === 'newPassword') {
            const valid = value.length >= 6
            const confirmValid = value === password["confirmPassword"]
            setPassword(prev => ({
                ...prev,
                newPasswordValid: valid,
                newPasswordErrorMsg: 'Mật khẩu phải chứa ít nhất 6 ký tự.',
                confirmPasswordValid: confirmValid,
                confirmPasswordErrorMsg: 'Xác nhận mật khẩu phải khớp với mật khẩu mới.'
            }))
        } else if (field === 'confirmPassword') {
            const valid = value === password["newPassword"]
            setPassword(prev => ({
                ...prev,
                confirmPasswordValid: valid,
                confirmPasswordErrorMsg: 'Xác nhận mật khẩu phải khớp với mật khẩu mới.'
            }))
        }
    };

    // Function to update OTP state based on index
    const addOtpNumber = async (text, index) => {

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move focus to the next square if text is entered
        if (text !== '' && index < otp.length - 1) {
            otpRef.current[index + 1].focus();
        }

    };

    const addOtpPaste = (text) => {
        if (text.length === 6) {
            const extractedDigits = text.match(/\d/g); // Extract digits from clipboard content
            if (extractedDigits) {
                const newOtp = [...otp];
                for (let i = 0; i < Math.min(newOtp.length, extractedDigits.length); i++) {
                    newOtp[i] = extractedDigits[i];
                }
                setOtp(newOtp);
            }
        }
        setValidation({ valid: true })
    }

    const removeOtpNumber = (index) => {
        // If the current square is not empty, clear it
        if (otp[index] !== '') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
        }
        // Move focus to the previous square if available
        if (index > 0) {
            otpRef.current[index - 1].focus();
        }
    };



    const onBack = () => {
        if (currentStep === step["validateOtp"]) {
            setCurrentStep(step["sendEmail"])
        } else {
            navigation.goBack()
        }
    }

    const onChangeEmail = (text) => {
        setEmail(text);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email pattern
        const isValidEmail = emailPattern.test(text); // Check if the provided text matches the email pattern
        setValidation({
            valid: isValidEmail,
            message: 'Vui lòng nhập theo định dạng @mail.com'
        });
    };


    const validateOtp = async () => {
        try {
            setLoading(true)
            const res = await Apis.get(`${endpoints["otp"]}/validate?email=${email}&code=${otp.join("")}`)
            if (res.status === 200) {
                setCurrentStep(step["changePassword"])
                setValidation({ valid: true })
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setValidation({
                    valid: false,
                    message: 'Mã OTP không hợp lệ. Vui lòng thử lại.'
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống, vui lòng thử lại sau.'
                })
            }
        } finally {
            setLoading(false)
        }
    }

    const sendOTP = async () => {
        try {
            setLoading(true)
            const res = await Apis.get(`${endpoints["user"]}/email/${email}`)
            if (res.status === 200) {
                setCurrentStep(step["validateOtp"])
                setValidation({ valid: true })

                // Set cooldown to 30 seconds
                setCooldown(30);
                // Start countdown
                const countdownInterval = setInterval(() => {
                    setCooldown(prevCooldown => {
                        if (prevCooldown === 0) {
                            clearInterval(countdownInterval); // Clear interval when cooldown ends
                            return 0;
                        } else {
                            return prevCooldown - 1;
                        }
                    });
                }, 1000);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setValidation({
                    valid: false,
                    message: 'Không tìm thấy tài khoản. Vui lòng kiểm tra lại email.'
                })
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi hệ thống, vui lòng thử lại sau.'
                })
            }

        } finally {
            setLoading(false)
        }

    }

    const updatePassword = async () => {
        try {
            setLoading(true)
            const res = await Apis.post(`${endpoints["user"]}/email`, {
                email: email,
                password: password.confirmPassword
            })

            if (res.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Đổi mật khẩu thành công.'
                })

                navigation.goBack()

            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống, vui lòng thử lại sau.'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setOtpValid(otp.every(value => value !== ""))
    }, [otp]);

    const onOtpFocus = (index) => {
        setOtpCurrent(index)
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            console.log('keyboardDidShow')
            scrollViewRef.current.scrollToEnd({ animated: true })
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        if (currentStep === step["validateOtp"]) {
            setPlaceHoler('Quay lại bước trước')
            otpRef.current[0].focus()
        } else {
            setPlaceHoler('Quay lại đăng nhập')
        }
    }, [currentStep])


    return (
        <ScrollView style={[styles.screen]} showsVerticalScrollIndicator={false} ref={scrollViewRef} keyboardShouldPersistTaps='always'>
            <View style={styles.body}>
                <View style={{ alignItems: "center" }}>
                    <Image source={require('../assets/images/logo.png')}
                        style={{ width: 300, height: 200 }} />
                </View>

                {/* Start Send Email  */}
                {currentStep === step["sendEmail"] &&
                    <>
                        <Text style={styles.title}>{'Quên mật khẩu'}</Text>
                        <Text style={styles.description}>{'Vui lòng nhập địa chỉ email của bạn để nhận mã'}
                            <Text style={{ fontWeight: 'bold' }}>{' OTP'}</Text>
                            {' để xác thực'}
                        </Text>
                        <View style={styles.container}>
                            {/* <Text style={styles.label}>{'Địa chỉ email'}</Text> */}
                            <InputWithRightIcon
                                placeholder={'Nhập địa chỉ email'}
                                value={email}
                                valid={validation.valid}
                                errorMsg={validation.message}
                                iconVisible={email.length > 0}
                                onChangeText={(text) => onChangeEmail(text)}
                            />
                        </View>
                        <View style={styles.container}>
                            <Button
                                filled
                                title={'Gửi'}
                                onPress={sendOTP}
                                disabled={!validation.valid}
                                style={{
                                    opacity: !validation.valid ? 0.6 : 1
                                }}
                            />
                        </View>
                    </>
                }
                {/* End Send Email  */}


                {/* Start Validate OTP */}
                {currentStep === step["validateOtp"] &&
                    <>
                        <Text style={styles.title}>{'Xác thực OTP'}</Text>
                        <Text style={styles.description}>{'Vui lòng nhập mã '}
                            <Text style={{ fontWeight: 'bold' }}>{'OTP'}</Text>
                            {' gồm 6 chữ số đã gửi qua '}
                            <Text style={{ textDecorationLine: 'underline', fontWeight: '500' }}>{email}</Text>
                        </Text>
                        <View style={[styles.container, { flexDirection: 'row', justifyContent: 'center', marginTop: 24 }]}>
                            {otp.map((digit, index) => (
                                <View key={index} style={[styles.square, { borderColor: otpCurrent === index ? COLORS.toastInfo : '#ccc' }]}>
                                    <TextInput
                                        ref={(input) => (otpRef.current[index] = input)}
                                        style={styles.input}
                                        value={digit}
                                        onChangeText={(text) => addOtpPaste(text)}
                                        onFocus={(e) => onOtpFocus(index)}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key === 'Backspace') {
                                                removeOtpNumber(index);
                                            } else {
                                                addOtpNumber(nativeEvent.key, index)
                                            }
                                        }}
                                        cursorColor={COLORS.toastInfo}
                                        keyboardType="numeric"
                                        maxLength={6}
                                    />
                                </View>
                            ))}

                        </View>

                        {!validation.valid && validation.message != '' &&
                            <Text style={styles.error}>{validation.message}</Text>
                        }

                        <TouchableOpacity style={styles.container} onPress={sendOTP} disabled={cooldown > 0}>
                            <Text style={styles.primaryText}>{`Gửi lại mã ${cooldown > 0 ? `(${cooldown})` : ''}`}</Text>
                        </TouchableOpacity>

                        <View style={styles.container}>
                            <Button
                                filled
                                title={'Xác thực'}
                                onPress={validateOtp}
                                disabled={!otpValid}
                                style={{
                                    opacity: !otpValid ? 0.6 : 1
                                }}
                            />
                        </View>
                    </>
                }
                {/* End Validate OTP */}


                {/* Start Change Password  */}
                {currentStep === step["changePassword"] &&
                    <>
                        <Text style={styles.title}>{'Đổi mật khẩu'}</Text>
                        <Text style={styles.description}>{`Để đảm bảo tính bảo mật của tài khoản của bạn, mật khẩu mới nên: \n- Có ít nhất 6 ký tự \n- Bao gồm ít nhất một chữ hoa, một số và một ký tự đặc biệt.`}
                        </Text>
                        <View style={styles.container}>
                            <Text style={styles.label}>{'Mật khẩu mới'}</Text>
                            <InputWithRightIcon
                                secureTextEntry={password.newPasswordSecure}
                                placeholder={'Nhập mật khẩu mới'}
                                value={password.newPassword}
                                valid={password.newPasswordValid}
                                errorMsg={password.newPasswordErrorMsg}
                                iconName={password.newPasswordSecure ? 'eye-off' : 'eye'}
                                onChangeText={(text) => onChangePassword('newPassword', text)}
                                onIconPressed={() => onChangePassword('newPasswordSecure', !password.newPasswordSecure)}
                            />
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.label}>{'Xác nhận mật khẩu mới'}</Text>
                            <InputWithRightIcon
                                secureTextEntry={password.confirmPasswordSecure}
                                placeholder={'Nhập xác nhận mật khẩu mới'}
                                value={password.confirmPassword}
                                valid={password.confirmPasswordValid}
                                errorMsg={password.confirmPasswordErrorMsg}
                                onChangeText={(text) => onChangePassword('confirmPassword', text)}
                                iconName={password.confirmPasswordSecure ? 'eye-off' : 'eye'}
                                onIconPressed={() => onChangePassword('confirmPasswordSecure', !password.confirmPasswordSecure)} />
                        </View>
                        <View style={styles.container}>
                            <Button
                                filled
                                title={'Xác nhận'}
                                onPress={updatePassword}
                                disabled={(
                                    !password.confirmPasswordValid
                                    || !password.newPasswordValid
                                    || password.confirmPassword.length < 1
                                    || password.newPassword.length < 1
                                )}
                                style={{
                                    opacity: (
                                        !password.confirmPasswordValid
                                        || !password.newPasswordValid
                                        || password.confirmPassword.length < 1
                                        || password.newPassword.length < 1
                                    ) ? 0.6 : 1
                                }}
                            />
                        </View>
                    </>
                }
                {/* End Change Password  */}
                <TouchableOpacity style={styles.container} onPress={onBack}>
                    <Text style={{ textAlign: 'center', color: COLORS.primary, fontWeight: '400' }}>{placeHolder}</Text>
                </TouchableOpacity>
                {loading && <Loading transparent={true} />}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: COLORS.white,
        flex: 1,
    },
    body: {
        flex: 1,
        paddingHorizontal: 24
    },
    description: {
        color: '#676767',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
    },
    title: {
        fontStyle: 'normal',
        color: '#353535',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    container: {
        marginVertical: 10,
    },
    label: {
        color: COLORS.textLabel,
        fontSize: 14,
        fontWeight: "bold"
    },
    primaryText: {

        color: COLORS.primary,
        fontWeight: '400'
    },
    square: {
        width: 48,
        height: 56,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        fontSize: 18,
        textAlign: 'center',
    },
    error: {
        color: COLORS.toastError, fontSize: 12, marginTop: 8
    }
})

export default ForgotPassword