import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import ThemedTextInput from "../themed/ThemedTextInput";

const Login = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <ThemedView style={styles.container} testID="login-component">
            <ThemedText type="title" style={{ marginBottom: 18 }}>
                {t("login.title")}
            </ThemedText>
            <ThemedTextInput
                style={styles.input}
                placeholder={t("login.usernamePlaceholder")}
                value={username}
                onChangeText={setUsername}
                testID="username-input"
            />
            <ThemedTextInput
                style={styles.input}
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChangeText={setPassword}
                testID="password-input"
            />

            {/* <Button title="Login" /> */}
        </ThemedView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        height: 40,
        width: 250,
        borderWidth: 1,
        padding: 6,
        marginBottom: 12,
    },
});
