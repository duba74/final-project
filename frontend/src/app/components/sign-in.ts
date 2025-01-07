import {
    GoogleSignin,
    statusCodes,
    isSuccessResponse,
    isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            console.log("Sign in successful");
            // setState({ userInfo: response.data });
            const user = response.data.user;
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            console.log(user);
        } else {
            console.log("Sign in cancelled");
        }
    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    console.log("Sign in already in progress");
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.log("Service not available");
                    break;
                default:
                    console.log("Some other Google sign in error happened");
            }
        } else {
            console.log("Some other error happened");
        }
    }
};
