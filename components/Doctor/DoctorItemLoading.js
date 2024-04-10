import React, { memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const DoctorItemLoading = () => {

    const renderLoadingItems = (count) => {
        const loadingItems = [];
        for (let i = 0; i < count; i++) {
            loadingItems.push(
                <View key={i} style={styles.itemContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.avatar} />
                        <View style={styles.textContainer}>
                            <View style={styles.placeHolderShorter}></View>
                            <View style={styles.placeHolderMedium}></View>
                            <View style={styles.placeHolderShorter}></View>
                            <View style={styles.placeHolderMedium}></View>
                        </View>
                    </View>
                    <View style={styles.dashedLine}></View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.placeHolderShorter}></View>
                        <View style={styles.placeHolderShorter}></View>
                    </View>
                    <View style={styles.placeHolderMedium}></View>
                    <View style={styles.placeHolderMedium}></View>
                </View>
            );
        }
        return loadingItems;
    };

    return (
        <ScrollView key='Doctors' style={styles.container} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {renderLoadingItems(5)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    placeHolderShorter: {
        backgroundColor: COLORS.placeHolder,
        height: 15,
        width: 100,
        borderRadius: 3,
        marginVertical: 3,
        marginRight: 5,
    },
    placeHolderMedium: {
        backgroundColor: COLORS.placeHolder,
        height: 15,
        width: "auto",
        borderRadius: 3,
        marginVertical: 3,
    },
    itemContainer: {
        marginVertical: 5,
        padding: 12,
        borderWidth: 0.8,
        borderRadius: 10,
        borderColor: '#eaeaea',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: COLORS.placeHolder
    },
    textContainer: {
        flex: 1,
    },
    dashedLine: {
        borderBottomWidth: 2,
        borderBottomColor: '#e7e7e7',
        opacity: 0.5,
        borderStyle: 'dashed',
        width: '100%',
        marginVertical: 10,
    },
});

export default memo(DoctorItemLoading);
