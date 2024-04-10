import React, { useState, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const TypingAnimation = () => {
    const [dot1Opacity] = useState(new Animated.Value(1));
    const [dot2Opacity] = useState(new Animated.Value(1));
    const [dot3Opacity] = useState(new Animated.Value(1));

    useEffect(() => {
        const typingAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(dot1Opacity, {
                    toValue: 0.3,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(dot1Opacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(dot2Opacity, {
                    toValue: 0.3,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(dot2Opacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(dot3Opacity, {
                    toValue: 0.3,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(dot3Opacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ])
        );

        typingAnimation.start();

        return () => {
            typingAnimation.stop();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.dot, { opacity: dot1Opacity }]}>&#9679;</Animated.Text>
            <Animated.Text style={[styles.dot, { opacity: dot2Opacity }]}>&#9679;</Animated.Text>
            <Animated.Text style={[styles.dot, { opacity: dot3Opacity }]}>&#9679;</Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dot: {
        fontSize: 16,
        color: COLORS.grey,
    },
});

export default TypingAnimation;
