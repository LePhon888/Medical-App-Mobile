import Header from "./Header";

const Layout = ({ title }) => {
    return (
        <View style={styles.container}>
            <Header title={title} />
        </View>
    )
}
export default Layout

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
});