import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TextInput, Button } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/vi';
import moment from 'moment';
import COLORS from '../../constants/colors';
import { faL } from '@fortawesome/free-solid-svg-icons';
import Apis, { endpoints } from '../../config/Apis';
import { Alert } from 'react-native';

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

    const togglePopup = (isShow) => {
        setShowPopup(isShow)
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
                Alert.alert("Thông báo", "Thêm đánh giá mới thành công");
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
                <TouchableOpacity style={{ marginBottom: 25 }} onPress={() => togglePopup(true)}>
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
                    <View style={styles.commentContainer}>
                        <Text style={styles.commentText}>{r.comment}</Text>
                    </View>
                </View>
            ))}

            {/* popup add */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isShowPopup}
                onRequestClose={() => togglePopup(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* Overlay */}
                    <TouchableWithoutFeedback onPress={() => togglePopup(false)}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.popupContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.title}>Thông tin đánh giá bác sĩ</Text>
                            <FontAwesome name='close' style={{ marginLeft: 'auto' }} size={22} color={COLORS.textLabel} onPress={() => togglePopup(false)} />
                        </View>

                        <Text style={styles.label}>Đánh giá chất lượng</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <StarRating
                                rating={ratingSubmitted.star}
                                onSelectStar={handleStarSelection}
                            />
                            <Text style={{ marginLeft: 10, color: 'red', fontSize: 14 }}>
                                {ratingSubmitted.star === 1 && 'Rất tệ'}
                                {ratingSubmitted.star === 2 && 'Tệ'}
                                {ratingSubmitted.star === 3 && 'Bình thường'}
                                {ratingSubmitted.star === 4 && 'Tốt'}
                                {ratingSubmitted.star === 5 && 'Xuất sắc'}
                            </Text>
                        </View>

                        <Text style={styles.label}>Nhận xét</Text>
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
                        <TouchableOpacity style={styles.ratingButton} onPress={submit} disabled={isSubmitted}>
                            <Text style={styles.ratingButtonText}>Gửi đánh giá</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        color: '#FFF', // Text color for initials
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
        color: '#666968'
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
        backgroundColor: COLORS.primary,
        width: 120,
        paddingVertical: 7,
        borderRadius: 20,
        alignSelf: 'center'
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    popupContainer: {
        backgroundColor: '#f8f9fd',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        position: 'absolute',
        bottom: 150,
        left: 20,
        right: 20,
        zIndex: 101,
    },
    ratingInputContainer: {
        marginVertical: 5,
        marginBottom: 20,
    },
    ratingInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingVertical: 20,
        paddingHorizontal: 20,
        fontSize: 13,
        backgroundColor: 'white',
        borderRadius: 12,
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
        fontWeight: '700',
        marginVertical: 10,
    },
    title: {
        fontSize: 15,
        color: COLORS.textLabel,
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: 'auto'
    },
    popupContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
        padding: 15,
        elevation: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 101,
    },
});

export default RatingContent;
