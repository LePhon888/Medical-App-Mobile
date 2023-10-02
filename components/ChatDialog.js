import { StyleSheet, TextInput, View } from "react-native";
import Dialog from "react-native-dialog";
const ChatDialog = ({ visible, closeDialog, setRoomId, setJoin }) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
        },
        TextInput: {
            marginLeft: 10,
            borderBottomWidth: 1,
            borderBottomColor: "gray"
        }
    });
    return (
        <View style={styles.container}>
            <Dialog.Container visible={visible} >
                <Dialog.Title>Tham gia trò chuyện</Dialog.Title>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Nhập mã phòng."
                    placeholderTextColor="black"
                    onChangeText={value => { setRoomId(value) }}
                />
                <Dialog.Button label="Hủy" color={"#1877F2"}
                    onPress={closeDialog} />
                <Dialog.Button label="Tham gia" color={"#1877F2"}
                    onPress={setJoin}
                />
            </Dialog.Container>
        </View>
    );
}
export default ChatDialog