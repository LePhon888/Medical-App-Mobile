import React from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    Switch,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useState } from 'react'
import { Button } from 'react-native'
import DatePicker from 'react-native-date-picker'

const CIRCLE_SIZE = 18;
const CIRCLE_RING_SIZE = 2;

function Option({ title, subtitle, value, onPress, type = 'switch' }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.option}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>{title}</Text>
                    <Text style={styles.optionText}>{subtitle}</Text>
                </View>
                <View style={{ flex: 1, maxWidth: 72, alignItems: 'flex-end' }}>
                    {type === 'switch' && (
                        <Switch
                            value={value}
                            onChange={onPress}
                            trackColor={{ true: '#7259e2' }}
                        />
                    )}
                    {type === 'radio' && (
                        <View style={styles.circle}>
                            <View
                                style={[
                                    styles.circleInside,
                                    value && { backgroundColor: '#7259e2' },
                                ]}
                            />
                        </View>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default function AppointmentRegister() {
    const [form, setForm] = React.useState({
        privacy: true,
        contribution: 'public',
    });
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(true)
    const sheet = React.useRef();

    React.useEffect(() => {
        sheet.current.open();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.placeholder}>
                <View style={styles.placeholderInset}>

                </View>
            </View>

            <RBSheet
                customStyles={{ container: styles.sheet }}
                height={530}
                openDuration={250}
                ref={sheet}>
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetHeaderTitle}>New Group</Text>
                </View>
                <View style={styles.sheetBody}>
                    <Option
                        title="Private"
                        subtitle="Only viewable by people you invite"
                        value={form.privacy}
                        onPress={() => {
                            setForm({ ...form, privacy: !form.privacy });
                        }}
                    />

                    <View style={styles.section}>
                        <Text style={styles.sectionText}>Contribution Settings</Text>

                        <Option
                            type="radio"
                            title="Restricted"
                            subtitle="Only people with access can open with the link"
                            value={form.contribution === 'restricted'}
                            onPress={() => {
                                setForm({ ...form, contribution: 'restricted' });
                            }}
                        />
                        <Option
                            type="radio"
                            title="Public"
                            subtitle="Anyone on the internet with the link can view"
                            value={form.contribution === 'public'}
                            onPress={() => {
                                setForm({ ...form, contribution: 'public' });
                            }}
                        />
                    </View>
                    <DatePicker
                        modal
                        open={open}
                        date={date}
                        onConfirm={(date) => {
                            setOpen(false)
                            setDate(date)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Create Group</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sheetHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    sheetHeaderTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    sheetBody: {
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    section: {
        paddingTop: 24,
    },
    sectionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#b1b1b1',
        textTransform: 'uppercase',
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fafafa',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 8,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0d0c22',
        marginBottom: 6,
    },
    optionText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        color: '#a8a8a8',
    },
    circle: {
        width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        borderRadius: 9999,
        backgroundColor: 'white',
        borderWidth: CIRCLE_RING_SIZE,
        borderColor: '#d4d4d4',
        marginRight: 8,
        marginBottom: 12,
    },
    circleInside: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: 9999,
        position: 'absolute',
        top: CIRCLE_RING_SIZE,
        left: CIRCLE_RING_SIZE,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        padding: 14,
        borderWidth: 1,
        borderColor: '#7259e2',
        marginTop: 24,
        backgroundColor: '#7259e2',
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    container: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    sheet: {
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 0,
        padding: 24,
    },
    placeholderInset: {
        borderWidth: 4,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
});