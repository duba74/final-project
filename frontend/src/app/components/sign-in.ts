import {
    GoogleSignin,
    statusCodes,
    isSuccessResponse,
    isErrorWithCode,
} from "@react-native-google-signin/google-signin";

export const signIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            console.log("Sign in successful");
            // setState({ userInfo: response.data });
            console.log(response.data);
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
