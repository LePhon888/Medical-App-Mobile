import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Make sure to import FontAwesome from the correct package
import COLORS from '../../constants/colors';
import moment from 'moment';
const BulletContent = ({ field, title, iconComponent }) => {

    const formatDateTime = (date) => {
        return moment(date).format("YYYY");
    }

    return (
        <View style={styles.info}>
            {/* Icon and title */}
            <View style={{ ...styles.flexRowCenter, marginBottom: 10 }}>
                <View style={styles.infoIcon}>{iconComponent}</View>
                <Text style={styles.infoTitle}>{title}</Text>
            </View>
            {/* Bullet list */}
            {field.map((item, index) => {
                return (
                    <View key={index} style={styles.bulletPoint}>
                        <View style={styles.bulletIcon}>
                            <FontAwesome name='circle' color={'black'} size={5} />
                        </View>
                        <View style={styles.bulletContent}>
                            <Text style={styles.bulletTitle}>{item.title}</Text>
                            <Text style={styles.bulletSubTitle}>{`${item.place}\n${formatDateTime(item.fromDate)} - ${formatDateTime(item.toDate)}`}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    flexRowCenter: {
        flexDirection: 'row', alignItems: 'center',
    },
    header: {
        paddingHorizontal: 10,
        backgroundColor: '#d5ecfe',
        paddingTop: 20,
        paddingBottom: '20%',
    },
    backIcon: {
        padding: 10,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 10,
        color: '#212025',
        backgroundColor: '#faf9fe',
        borderRadius: 10,
    },
    favourite: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#faf9fe',
        borderRadius: 25,
    },
    avatarContainer: {
        top: -10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 150
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 4
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#425463',
    },
    department: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    consultation: {
        marginTop: 3,
        paddingVertical: 3,
        paddingHorizontal: 10,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        color: '#0e8558',
        borderWidth: 1,
        backgroundColor: '#d7ffed',
        borderColor: '#0e8558',
        borderRadius: 15,
    },
    content: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    target: {
        borderRadius: 15,
        fontSize: 13,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        backgroundColor: '#faf9fe',
    },
    dollar: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 25,
        padding: 1,
        marginRight: 7,
    },
    fee: {
        marginVertical: 5,
        fontSize: 13,
        color: '#282828',
        marginRight: 10,
        lineHeight: 1.5 * 13
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: 'white',
        paddingVertical: 5,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tabTitle: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    info: {
        marginVertical: 12,
    },
    infoIcon: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: 9,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoTitle: {
        color: '#262626',
        fontWeight: 'bold'
    },
    infoText: {
        fontSize: 14,
        marginTop: 10,
        lineHeight: 1.5 * 14
    },
    buttonReadMore: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 5,
    },
    bulletPoint: {
        marginLeft: 5,
        flexDirection: 'row',
        marginVertical: 7,
        alignItems: 'baseline'
    },
    bulletContent: {
        marginLeft: 15
    },
    bulletTitle: {
        fontWeight: 'bold',
        color: '#000',
        lineHeight: 1.5 * 14
    },
    bulletSubTitle: {
        color: '#595959',
        lineHeight: 1.5 * 14
    },
    bulletIcon: {
        marginHorizontal: 4,
    },
    buttonSchedule: {
        backgroundColor: COLORS.primary,
        marginVertical: 10,
        marginHorizontal: 14,
        borderRadius: 5,
    },
    textSchedule: {
        paddingVertical: 12,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
    },
    mapText: {
        padding: 16,
        backgroundColor: '#f8f9fd'
    },
    paymentList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    paymentItem: {
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 10,
    },
    paymentText: {
        marginTop: 5,
        color: '#595959',
        fontSize: 12,
    },
    paymentImageContainer: {
        paddingVertical: 1,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#d5d6d8'
    },
    paymentImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});

export default memo(BulletContent);
