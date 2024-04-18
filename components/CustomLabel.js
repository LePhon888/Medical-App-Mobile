import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const AnimatedView = Animated.createAnimatedComponent(View);

CustomLabel.defaultProps = {
    leftDiff: 0,
};

const width = 60;
const height = 30;
const pointerWidth = width * 0.3;

function LabelBase(props) {
    const { scaleValue, position, value, leftDiff, pressed } = props;
    const cachedPressed = React.useRef(pressed);
    const screenWidth = Dimensions.get('window').width;

    // Calculate maximum position to keep the label within screen bounds
    const maxPosition = screenWidth - width / 2;

    const toolTipWidth = pointerWidth + width + 8 + position

    // Adjust the position to prevent it from going beyond the screen bounds
    const adjustedPosition = Math.min(position, maxPosition);

    React.useEffect(() => {
        Animated.timing(scaleValue.current, {
            toValue: pressed ? 1 : 0,
            duration: 200,
            delay: pressed ? 0 : 200,
            useNativeDriver: false,
        }).start();
        cachedPressed.current = pressed;
    }, [pressed]);

    return (
        Number.isFinite(position) &&
        Number.isFinite(value) && (
            <AnimatedView
                style={[
                    styles.sliderLabel,
                    {
                        left: adjustedPosition - width / 2,
                        opacity: scaleValue.current,
                        transform: [
                            { translateY: width },
                            { scale: scaleValue.current },
                            { translateY: -width },
                            { translateX: toolTipWidth >= screenWidth ? -(pointerWidth + 8) : 0 }
                        ],
                    },
                ]}
            >
                <View style={[styles.pointer, { left: toolTipWidth >= screenWidth ? (width - pointerWidth) * 1.1 : (width - pointerWidth) * 0.55 }]} />
                <Text style={styles.sliderLabelText}>{value.toLocaleString('vi-VN') + ' đ'}</Text>
            </AnimatedView>
        )
    );
}

export default function CustomLabel(props) {
    const scaleValue = React.useRef(new Animated.Value(0));

    const {
        leftDiff,
        oneMarkerValue,
        twoMarkerValue,
        oneMarkerLeftPosition,
        twoMarkerLeftPosition,
        oneMarkerPressed,
        twoMarkerPressed,
    } = props;

    console.log('twoMarkerLeftPosition', twoMarkerLeftPosition)

    return (
        <View style={styles.parentView}>
            <LabelBase
                scaleValue={scaleValue}
                position={oneMarkerLeftPosition}
                value={oneMarkerValue}
                leftDiff={leftDiff}
                pressed={oneMarkerPressed}
            />
            <LabelBase
                scaleValue={scaleValue}
                position={twoMarkerLeftPosition}
                value={twoMarkerValue}
                leftDiff={leftDiff}
                pressed={twoMarkerPressed}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    parentView: {
        position: 'relative',
    },
    sliderLabel: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '100%',
        height: height,
        borderRadius: 5, // Add border radius for rounded corners
        backgroundColor: '#656565',
        paddingHorizontal: 8, // Add horizontal padding for better spacing
    },
    sliderLabelText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white', // Change text color to improve visibility
    },
    pointer: {
        position: 'absolute',
        bottom: -pointerWidth / 5,
        transform: [{ rotate: '45deg' }],
        width: pointerWidth,
        height: pointerWidth,
        backgroundColor: '#656565',
        paddingHorizontal: 8,
    },
});