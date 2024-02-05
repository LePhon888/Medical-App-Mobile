import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RatingStats = ({ listStats }) => {
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
            if (listStats && listStats.length > 0) {
                count = listStats.find(item => item[0] === starCount)?.[1] || 0;
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

    return (
        <View>
            {renderStars()}
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default RatingStats;
