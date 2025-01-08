import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { googleAndroidClientKey, googleWebClientKey } from "@/keys";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
    webClientId: googleWebClientKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    offlineAccess: true,
    forceCodeForRefreshToken: false,
});

const AuthContext = createContext<{
    signIn: () => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export const useSession = () => {
    const value = useContext(AuthContext);

    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error(
                "useSession must be wrapped in a <SessionProvider />"
            );
        }
    }

    return value;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
    const [[isLoading, session], setSession] = useStorageState("session");
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: googleAndroidClientKey,
        webClientId: googleWebClientKey,
    });

    const getUserInfo = async (token: string | undefined) => {
        if (!token) return;

        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const user = await response.json();
            return user;
            // await AsyncStorage.setItem("@user", JSON.stringify(user));
            // setUserInfo(user);
        } catch (error) {
            console.log(
                "Web Google Auth: Something went wrong while getting the user"
            );
        }
    };

    return (
        <AuthContext.Provider
            value={{
                signIn: () => {
                    // Perform sign-in login here
                    setSession("xxx");
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
