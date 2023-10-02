import { useEffect, useState } from "react";
import Apis, { endpoints } from "../config/Apis";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Alert, Image, TextInput, Button } from "react-native";
import moment from "moment/moment";
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from "react-native-modal";
import COLORS from "../constants/colors";
import Icon from 'react-native-vector-icons/FontAwesome';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import FeatherIcon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DoctorAppointment = () => {
    const [appointment, setAppointment] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isVisible, setVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(moment());
    const [kw, setKw] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUserAndToken = async () => {
            try {
                const userInfo = await AsyncStorage.getItem("user");
                const tokenInfo = await AsyncStorage.getItem("token");
                const parsedUser = JSON.parse(userInfo);

                setUser(parsedUser);

                if (parsedUser && tokenInfo) {
                    const e = `${endpoints["appointment"]}/?userId=${parsedUser.id}`;
                    const response = await Apis.get(e, { headers: { Authorization: `Bearer ${tokenInfo}` } });
                    setAppointment(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getUserAndToken();
    }, []);


    const toggleModal = () => {
        setVisible(!isVisible);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);
        toggleModal();
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(moment(selectedDate))
        }
    };

    const renderFilter = () => {
        return (
            <Grid>
                <Row style={{ alignItems: "center" }}>
                    <Col style={{ width: "15", padding: 10 }}>
                        <Text><Icon style={{ fontSize: 30 }} name="filter"></Icon></Text>
                    </Col>
                    <Col style={{ padding: 10 }}>
                        <Text>Theo ngày</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text style={{ borderWidth: 1, borderColor: "gray", padding: 5, marginTop: 5, borderRadius: 5 }}>{date.format("DD-MM-YYYY")} <Icon style={{ fontSize: 15 }} name="calendar"></Icon></Text>
                        </TouchableOpacity>
                    </Col>
                    <Col style={{ padding: 10 }}>
                        <Text>Theo tên</Text>
                        <TextInput autoCorrect={false} autoCapitalize="none" style={{ borderWidth: 1, borderColor: "gray", paddingHorizontal: 5, marginTop: 5, borderRadius: 5 }} value={kw} onChangeText={val => setKw(val)} placeholder="Nhập tên...." />
                    </Col>

                </Row>
            </Grid>
        )
    }

    const renderPopup = (selectedRow) => {
        const ModalText = ({ children }) => (
            <Text style={styles.modalText}>{children}</Text>
        );

        const TextStatus = ({ children, isConfirmed }) => (
            <Text style={{
                padding: 5, color: "white", textAlign: "center", width: "50%", borderRadius: 5,
                backgroundColor: isConfirmed ? COLORS.primary : COLORS.secondary
            }}>{children}</Text>
        );
        const updateConfirm = async (selectedRow, isConfirmed) => {
            try {
                const e = `${endpoints["appointment"]}/${selectedRow.id}/is-confirm?isConfirm=${isConfirmed}`
                console.log(e)
                const response = await Apis.put(e)
                console.log(response.status)

                if (response.status === 200) {

                    Alert.alert('Thông báo', 'Cập nhật thành công', [
                        { text: 'OK', onPress: () => toggleModal() },
                    ]);

                    selectedRow.isConfirm = isConfirmed;

                } else {
                    Alert.alert('Thông báo', 'Cập nhật thất bại')
                }

            } catch (error) {
                Alert.alert('Thông báo', 'Lỗi hệ thống...')
                console.error(error)
            }
        }
        return (
            <Modal isVisible={isVisible}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Lịch khám {selectedRow.id}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                    <View>
                        <ModalText>Ngày khám: {date.format("DD-MM-YYYY")}</ModalText>
                        <ModalText>Giờ khám: {selectedRow.hour.hour}</ModalText>
                        <ModalText>Bệnh nhân: {selectedRow.user.firstName} {selectedRow.user.lastName}</ModalText>
                        <ModalText>Lý do: {selectedRow.reason}</ModalText>
                        <ModalText>Bác sỹ khám: {selectedRow.doctor.user.firstName} {selectedRow.doctor.user.lastName}</ModalText>
                        <TextStatus isConfirmed={selectedRow.isConfirm}>Trạng thái: {selectedRow.isConfirm === 1 ? "Đã duyệt" : "Chờ duyệt"}</TextStatus>
                    </View>
                    <View style={styles.buttonContainer}>
                        {selectedRow.isConfirm === 0 ?
                            (<TouchableOpacity style={styles.acceptButton} onPress={() => updateConfirm(selectedRow, 1)} >
                                <Text style={styles.acceptButtonText}>Duyệt</Text>
                            </TouchableOpacity>)

                            : (<TouchableOpacity style={styles.cancelButton} onPress={() => updateConfirm(selectedRow, 0)}>
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>)
                        }
                    </View>
                </View>
            </Modal >
        );
    };

    const renderAppointment = () => {
        const filteredAppointments = appointment.filter((a) => {
            if (kw && kw.length > 0) {
                const fullName = `${a.user.firstName} ${a.user.lastName}`;
                return fullName.toLowerCase().includes(kw.toLowerCase());
            }
            if (date) {
                return moment(a.date).isSame(date, 'day');
            }
            return true;
        });

        return filteredAppointments.length === 0 ? (<Text>loading....</Text>)
            : (
                <Grid style={{ padding: 10 }}>
                    <Row>
                    </Row>
                    {filteredAppointments.map((a, index) => (
                        <TouchableOpacity key={a.id} style={{ backgroundColor: "white", padding: 5, borderRadius: 10, marginVertical: 5 }} onPress={() => handleRowClick(a)}>
                            <Row style={{ alignItems: "center", }}>
                                <Col style={{ width: "15%" }}>
                                    <Image
                                        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfZTQUVvurX87J2tBgAeq4_oFgv6FBgIOUVXw1b3_YsJaF7c3hE6mQcDMv3AWbM18pdyY&usqp=CAU" }}
                                        style={{ width: 50, height: 50, alignSelf: "center", marginBottom: 10 }}
                                    />
                                </Col>
                                <Col style={{ flex: 1, marginLeft: 15, marginTop: 20 }}>
                                    <Text style={{ fontSize: 17 }}>{a.user.firstName} {a.user.lastName}</Text>
                                    <Text style={{ marginVertical: 5, color: "#818181", fontSize: 14, fontWeight: "500", paddingRight: 20 }}>Lý do hẹn: {a.reason}/</Text>
                                </Col>
                            </Row>
                            <Row style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, fontWeight: 500, color: "#464646", marginVertical: 5, textAlign: "left", padding: 5 }}>
                                    <FeatherIcon color="#464646" name="briefcase" size={14} />
                                    {" "} Tình trạng: {a.isConfirm === 1 ? "Đã xác nhận" : "Chờ xác nhận"}
                                </Text>

                                <Text style={{ fontSize: 14, fontWeight: 500, color: "#464646", marginVertical: 5, textAlign: "left", padding: 5 }}>
                                    <FeatherIcon color="#464646" name="clock" size={14} />
                                    {" "} {a.hour.hour}
                                </Text>

                            </Row>

                        </TouchableOpacity>
                    ))}
                </Grid>
            )
    };

    return (
        <View style={styles.container}>
            <Text style={styles.dateText}>Danh sách lịch khám</Text>
            <ScrollView>
                {renderFilter()}
                {renderAppointment()}
            </ScrollView>
            {isVisible && renderPopup(selectedRow)}
            {showDatePicker && (
                <RNDateTimePicker value={new Date()} onChange={handleDateChange} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
    dateText: {
        fontSize: 20,
        padding: 10,
        marginBottom: 10,
        color: "white",
        backgroundColor: COLORS.primary,
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },

    modalText: {
        fontSize: 15,
        marginVertical: 5
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    acceptButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
    },
    acceptButtonText: {
        color: "white",
        fontSize: 16,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        marginLeft: 10,
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: COLORS.primary,
    },
})

export default DoctorAppointment;
