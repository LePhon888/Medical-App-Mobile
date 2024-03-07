import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Button } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/vi';
import moment from 'moment';
import COLORS from '../../constants/colors';
import Feather from "react-native-vector-icons/Feather";
import Loading from "../Loading"

import Apis, { endpoints } from '../../config/Apis';
import { Alert } from 'react-native';
import BottomSheet from '../BottomSheet';
import Toast from 'react-native-toast-message';
import ToastConfig from '../ToastConfig';

const StarRating = ({ rating, onSelectStar }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <View style={{ flexDirection: 'row' }}>
            {stars.map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => onSelectStar(star)}
                >
                    <FontAwesome
                        name={star <= rating ? 'star' : 'star'}
                        size={20}
                        color={star <= rating ? '#ff9220' : 'gray'}
                        style={{ marginRight: 5 }}

                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const RatingContent = ({ doctorId, userId, ratingStats, listRating, doctorRating, enableRating, refreshRating }) => {
    console.log(enableRating)
    const [isShowPopup, setShowPopup] = useState(false)
    const [isSubmitted, setSubmitted] = useState(false)

    const [ratingSubmitted, setRatingSubmitted] = useState({
        userId: userId,
        doctorId: doctorId,
        comment: "",
        star: 5,
    });

    const renderStars = () => {
        const starRows = [];
        for (let i = 4; i >= 0; i--) {
            const stars = [];
            const starCount = i + 1;

            for (let j = 0; j <= 4; j++) {
                const color = j <= i ? '#ff9220' : '#87909b';
                stars.push(
                    <FontAwesome key={`${i}-${j}`} name='star' color={color} size={12} style={{ marginRight: 2 }} />
                );
            }
            let count = 0;
            if (ratingStats && ratingStats.length > 0) {
                count = ratingStats.find(item => item[0] === starCount)?.[1] || 0;
            }

            starRows.push(
                <View key={i} style={styles.starRow}>
                    {stars}
                    <View style={styles.dashed}></View>
                    <Text style={styles.dashedText}>{count}</Text>
                </View>
            );
        }
        return starRows;
    };

    const getBackgroundColor = (name) => {
        const colors = ['#FF6F61', '#6A5ACD', '#20B2AA', '#FFA07A', '#87CEFA'];
        const index = name.length % colors.length;
        return colors[index];
    };

    const togglePopup = () => {
        setShowPopup(!isShowPopup)
        setSubmitted(false)
    }

    const handleStarSelection = (selectedStar) => {
        setRatingSubmitted({ ...ratingSubmitted, star: selectedStar });
    };

    const submit = async () => {
        try {
            setSubmitted(true);
            const res = await Apis.post(endpoints["rating"], ratingSubmitted);


            if (res.status === 200) {
                // Successful response, handle as needed
                setRatingSubmitted(prevRating => ({ ...prevRating, comment: '', star: 5 }));
                togglePopup(false)
                refreshRating()
            } else {
                // Handle other status codes, e.g., res.status === 400 for validation errors
                setSubmitted(false);
                Alert.alert("Thông báo", `Lỗi hệ thống: ${res.status} - ${res.data}`);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            setSubmitted(false);
            Alert.alert("Thông báo", `Lỗi hệ thống: ${error.message}`);
        }
    };


    return (
        <View>
            {/* Rating stats */}
            <View style={styles.container}>
                <View style={styles.ratingStatsContainer}>
                    <View style={{ flex: 1, marginRight: 20 }}>
                        <Text style={styles.ratingStatsText}>
                            {doctorRating ? doctorRating.toFixed(1) : '0.0'}
                        </Text>
                        <Text style={styles.ratingStatsSubText}>{listRating.length} Đánh giá</Text>
                    </View>
                    <View>
                        {renderStars()}
                    </View>
                </View>
            </View>
            {/* Add new rating, only visible based on the prop enableRating */}
            {enableRating && (
                <TouchableOpacity style={{ marginBottom: 25 }} onPress={() => togglePopup()}>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold', textAlign: 'center' }}>+ Thêm đánh giá</Text>
                </TouchableOpacity>
            )}
            {/* Rating user list */}
            {listRating.map((r, index) => (
                <View style={styles.userRatingContainer} key={index}>
                    {/* User Image (if available) */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        {r.userImage ? (
                            <Image source={{ uri: r.userImage }} style={styles.userImage} />
                        ) : (
                            <View style={{ ...styles.initialContainer, backgroundColor: getBackgroundColor(r.userName) }}>
                                <Text style={styles.initialText}>{r.userName.charAt(0).toUpperCase()}</Text>
                            </View>
                        )}

                        {/* User Info and Rating */}
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{r.userName}</Text>
                            <View style={styles.ratingContainer}>
                                {/* Render stars based on the user's rating */}
                                {Array.from({ length: r.star }).map((_, index) => (
                                    <FontAwesome key={index} name="star" size={12} color="#ff9220" style={styles.starIcon} />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.dateText}>{moment(r.createdDate).fromNow()}</Text>
                    </View>
                    {/* User Comment */}
                    {r.comment && r.comment !== '' && (
                        <View style={styles.commentContainer}>
                            <Text style={styles.commentText}>{r.comment}</Text>
                        </View>
                    )}
                    {/*  Horizontal Line */}
                    <View style={{ width: '100%', borderWidth: 0.3, borderColor: 'gray', marginBottom: 3, marginTop: 13, opacity: 0.1 }}></View>
                </View>
            ))}

            {/* popup add */}
            <BottomSheet visible={isShowPopup} onClose={() => togglePopup()}>
                <View>
                    {/* Popup Header */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.popupTitle}>Thêm đánh giá bác sỹ</Text>
                        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => togglePopup()}>
                            <Feather name="x" size={24} color={COLORS.textLabel} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}></View>
                    {/* Popup Body */}
                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Đánh giá chất lượng bác sĩ</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <StarRating
                                rating={ratingSubmitted.star}
                                onSelectStar={handleStarSelection}
                            />
                            <Text style={{ marginLeft: 10, color: COLORS.toastError, fontSize: 14, fontWeight: 'bold' }}>
                                {ratingSubmitted.star === 1 && 'Rất tệ'}
                                {ratingSubmitted.star === 2 && 'Tệ'}
                                {ratingSubmitted.star === 3 && 'Bình thường'}
                                {ratingSubmitted.star === 4 && 'Tốt'}
                                {ratingSubmitted.star === 5 && 'Xuất sắc'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Nhận xét và góp ý</Text>
                        <TextInput
                            style={styles.ratingInput}
                            multiline
                            placeholder="Nhận xét..."
                            value={ratingSubmitted.comment}
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => setRatingSubmitted({ ...ratingSubmitted, comment: text })}
                            maxLength={250}
                        />
                        <Text style={{ marginTop: 10, textAlign: "right", color: 'gray', fontSize: 13 }}>{`${ratingSubmitted.comment.length}/250`}</Text>

                    </View>
                    {/* Popup Footer */}
                    <TouchableOpacity style={styles.ratingButton} onPress={submit} disabled={isSubmitted}>
                        <Text style={styles.ratingButtonText}>Hoàn tất đánh giá</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
            {isSubmitted && <Loading transparent={true} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        marginTop: 10
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dashed: {
        backgroundColor: '#e5e9ec',
        height: 5,
        width: 100,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    dashedText: {
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 12,
        color: COLORS.textLabel
    },
    userRatingContainer: {
        flexDirection: 'column',
        marginBottom: 15,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 12,
        color: COLORS.textLabel,
        fontWeight: '700'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        marginTop: 2,
        marginRight: 2,
    },
    commentContainer: {
        marginTop: 10,
        height: 'auto'
    },
    commentText: {
        fontSize: 13,
        color: '#333',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    initialContainer: {
        width: 30,
        height: 30,
        borderRadius: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
    initialText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    ratingStatsContainer: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#f8f9fd',
        borderRadius: 10,
        marginBottom: 15,
    },
    ratingStatsText: {
        color: '#1f314b',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    ratingStatsSubText: {
        marginVertical: 5,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 14,
        color: COLORS.textLabel
    },
    ratingInputContainer: {
        marginVertical: 5,
        marginBottom: 20,
    },
    ratingInput: {
        flex: 1,
        height: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginRight: 10,
        fontSize: 14,
        backgroundColor: 'white'
    },
    ratingButton: {

        backgroundColor: '#2d86f3',
        padding: 12,
        borderRadius: 5,
        marginBottom: 15
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    ratingInputContainer: {
        marginVertical: 5,
        marginBottom: 20,
    },
    ratingInput: {
        borderWidth: 1,
        borderColor: "#d0d6dd",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    ratingButtonText: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    label: {
        color: COLORS.textLabel,
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10
    },
    popupTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.textLabel,
        fontWeight: 'bold',
        marginLeft: 'auto'
    },
    line: {
        width: '100%',
        borderBottomColor: 'gray',
        borderWidth: 0.3,
        opacity: 0.2,
        marginVertical: 16,
    },
    formContainer: {
        marginHorizontal: 10,
        marginBottom: 16
    }
});

export default RatingContent;
