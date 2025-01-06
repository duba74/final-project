import { useEffect, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import { addTrainingModule, logRecords } from "../database/db-utils";
import database, {
    trainingEventCollection,
    trainingModuleCollection,
} from "../database/database";
import mainSync from "../database/main-sync";
import secondarySync from "../database/secondary-sync";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { googleAndroidClientKey, googleWebClientKey } from "@/keys";
import { signIn } from "./components/sign-in";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
    webClientId: googleWebClientKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    offlineAccess: true,
    forceCodeForRefreshToken: false,
});

export default function Index() {
    const [userInfo, setUserInfo] = useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        // androidClientId: googleAndroidClientKey,
        webClientId: googleWebClientKey,
    });

    const createTrainingEvent = async (date: string | Date = new Date()) => {
        const trainingModules = await trainingModuleCollection.query().fetch();
        const trainingModule = trainingModules.at(1);
        if (trainingModule) {
            const newTrainingEvent = await trainingModule.addTrainingEvent(
                date
            );
            console.log(newTrainingEvent);
        }
    };

    useEffect(() => {
        handleSignInWithGoogle();
    }, [response]);

    const handleSignInWithGoogle = async () => {
        const user = await AsyncStorage.getItem("@user");

        if (!user) {
            if (response?.type === "success") {
                await getUserInfo(response.authentication?.accessToken);
            }
        } else {
            setUserInfo(JSON.parse(user));
        }
    };

    const getUserInfo = async (token: string | undefined) => {
        if (!token) return;

        try {
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const user = await response.json();
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            setUserInfo(user);
        } catch (error) {
            console.log("Something went wrong while getting the user");
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>{JSON.stringify(userInfo)}</Text>
            {Platform.OS === "web" ? (
                <Button
                    title="Sign in with Google"
                    onPress={() => promptAsync()}
                />
            ) : (
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signIn}
                />
            )}
            <Button
                title="Delete local storage"
                onPress={() => AsyncStorage.removeItem("@user")}
            />
            <Button title="Main sync" onPress={mainSync} />
            <Button title="Secondary sync" onPress={secondarySync} />
            <Button
                title="Show villages"
                onPress={() => {
                    logRecords("village");
                }}
            />
            <Button
                title="Show modules"
                onPress={() => {
                    logRecords("trainingModule");
                }}
            />
            <Button
                title="Show events"
                onPress={() => {
                    logRecords("trainingEvent");
                }}
            />
        </View>
    );
}
