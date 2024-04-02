import AsyncStorage from "@react-native-async-storage/async-storage";

export default optionCache = {
    namespace: "myapp",
    policy: {
        maxEntries: 50000,
        stdTTL: 0
    },
    backend: AsyncStorage
}