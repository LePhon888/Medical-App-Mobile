import React, { memo, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import COLORS from "../../constants/colors";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
                        size={15}
                        color={star <= rating ? '#ff9220' : 'gray'}

                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const RatingInput = () => {
    const [ratingSubmitted, setRatingSubmitted] = useState({
        userId: "",
        doctorId: "",
        comment: "",
        star: 0,
    });

    const handleStarSelection = (selectedStar) => {
        setRatingSubmitted({ ...ratingSubmitted, star: selectedStar });
    };

    return (
        <View style={styles.ratingInputContainer}>
            <TextInput
                style={styles.ratingInput}
                multiline
                placeholder="Nhập đánh giá..."
                value={ratingSubmitted.comment}
                underlineColorAndroid='transparent'
                onChangeText={(text) => setRatingSubmitted({ ...ratingSubmitted, comment: text })}
                maxLength={250}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity style={styles.ratingButton}>
                    <Text style={styles.ratingButtonText}>Đánh giá</Text>
                </TouchableOpacity>
                <StarRating
                    rating={ratingSubmitted.star}
                    onSelectStar={handleStarSelection}
                />
                <Text style={{ textAlign: "right", color: 'gray', fontSize: 13 }}>{`${ratingSubmitted.comment.length}/250`}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ratingInputContainer: {
        marginVertical: 5,
        marginBottom: 20,
    },
    ratingInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginRight: 10,
        fontSize: 13,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    ratingButton: {
        backgroundColor: COLORS.primary,
        width: 100,
        paddingVertical: 7,
        borderRadius: 20,
    },
    ratingButtonText: {
        textAlign: 'center',
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold',
    }
});

export default memo(RatingInput);
