import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { endpoints } from "../config/Apis";

export default getNewAccessToken = async () => {
    const expiredDateAccessToken = await AsyncStorage.getItem("expiredDateAccessToken");
    const currentTime = new Date();
    const expiredTime = new Date(expiredDateAccessToken);
    if (currentTime >= expiredTime) {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        try {
            const resAccessToken = await Apis.post(endpoints.refreshToken, {
                refreshToken: refreshToken,
                email: JSON.stringify(user).email,
            },);
            if (resAccessToken) {
                await AsyncStorage.setItem("accessToken", resAccessToken.data.accessToken);
                await AsyncStorage.setItem("expiredDateAccessToken", resAccessToken.data.expiredDateAccessToken);
            }
        } catch (error) {
            console.error(error);
        }
    }
};