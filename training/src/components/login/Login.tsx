import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import ThemedTextInput from "../themed/ThemedTextInput";
import ThemedButton from "../themed/ThemedButton";

type LoginProps = {
    onLogin: (username: string, password: string) => void;
};

const Login = ({ onLogin }: LoginProps) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <View style={styles.container} testID="login-component">
            <ThemedText type="title" style={{ marginBottom: 18 }}>
                {t("login.title")}
            </ThemedText>
            <View>
                <ThemedTextInput
                    style={styles.input}
                    placeholder={t("login.usernamePlaceholder")}
                    value={username}
                    onChangeText={setUsername}
                    testID="username-input"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <ThemedTextInput
                    style={styles.input}
                    placeholder={t("login.passwordPlaceholder")}
                    value={password}
                    onChangeText={setPassword}
                    testID="password-input"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onSubmitEditing={() => onLogin(username, password)}
                />
            </View>
            <ThemedButton
                title={"Login"}
                style={styles.button}
                onPress={() => onLogin(username, password)}
                testID="login-button"
            />
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    input: {
        height: 40,
        width: 250,
        borderWidth: 1,
        padding: 6,
        marginBottom: 16,
    },
    button: {
        width: 160,
    },
});
