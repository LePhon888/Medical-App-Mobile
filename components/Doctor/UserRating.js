import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/vi';
import moment from 'moment';

const UserRating = ({ userName, userImage, star, comment, createdDate }) => {
    const getBackgroundColor = (name) => {
        const colors = ['#FF6F61', '#6A5ACD', '#20B2AA', '#FFA07A', '#87CEFA'];
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <View style={styles.userRatingContainer}>
            {/* User Image (if available) */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                {userImage ? (
                    <Image source={{ uri: userImage }} style={styles.userImage} />
                ) : (
                    <View style={{ ...styles.initialContainer, backgroundColor: getBackgroundColor(userName) }}>
                        <Text style={styles.initialText}>{userName.charAt(0).toUpperCase()}</Text>
                    </View>
                )}

                {/* User Info and Rating */}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userName}</Text>
                    <View style={styles.ratingContainer}>
                        {/* Render stars based on the user's rating */}
                        {Array.from({ length: star }).map((_, index) => (
                            <FontAwesome key={index} name="star" size={12} color="#ff9220" style={styles.starIcon} />
                        ))}
                    </View>
                </View>
                <Text style={styles.dateText}>{moment(createdDate).fromNow()}</Text>
            </View>
            {/* User Comment */}
            <View style={styles.commentContainer}>
                <Text style={styles.commentText}>{comment}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    userRatingContainer: {
        flexDirection: 'column',
        marginBottom: 15,
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
});

export default UserRating;
